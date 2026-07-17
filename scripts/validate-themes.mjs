import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { ROOT_DIR, THEMES, TARGETS, outputDir, packageName } from './lib/theme-config.mjs';

const MAX_BYTES = 30 * 1024 * 1024;
const SAFE_ID = /^[a-z0-9][a-z0-9_-]*$/i;
const BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
const SAFE_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

export function validateCss(css, targetId) {
  if (typeof css !== 'string' || !css.trim()) throw new Error('CSS 不能为空。');
  if (!css.includes(`html.codedrobe-host-${targetId}`)) throw new Error(`CSS 缺少 ${targetId} 宿主作用域。`);
  if (/@import\s/i.test(css) || /url\(\s*["']?(?!data:)/i.test(css)) throw new Error('CSS 包含远程资源或不受控 URL。');
  if (/javascript:/i.test(css) || /<script/i.test(css) || /on(?:click|load|error)\s*=/i.test(css)) throw new Error('CSS 包含脚本或事件处理器。');
  if (/pointer-events\s*:\s*auto/i.test(css) && /::(?:before|after)/i.test(css)) throw new Error('装饰伪元素不得恢复交互拦截。');
  return true;
}

function assertText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} 必须是非空文本。`);
}

function validateVerification(value) {
  if (value === undefined) return;
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('verification 必须是对象。');
  const requirements = [
    ...(value.required ?? []), ...(value.recommended ?? []),
    ...(value.contexts ?? []).flatMap((item) => [...(item.required ?? []), ...(item.recommended ?? [])])
  ];
  if (!requirements.length) throw new Error('verification 至少需要一个检查项。');
  for (const item of requirements) {
    assertText(item.name, 'verification.name');
    if (!SAFE_ID.test(item.name) || !Array.isArray(item.any) || !item.any.length || item.any.some((selector) => typeof selector !== 'string' || !selector.trim())) {
      throw new Error('verification 检查项无效。');
    }
  }
}

export function validateBundle(bundle, targetId) {
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle)) throw new Error('主题包必须是 JSON 对象。');
  if (bundle.format !== 'codedrobe-theme' || bundle.schemaVersion !== 1) throw new Error('主题包格式或 schemaVersion 无效。');
  assertText(bundle.theme?.id, 'theme.id');
  assertText(bundle.theme?.displayName, 'theme.displayName');
  assertText(bundle.theme?.version, 'theme.version');
  if (!SAFE_ID.test(bundle.theme.id)) throw new Error('主题 ID 不安全。');
  const targets = Object.keys(bundle.targets ?? {});
  if (targets.length !== 1 || targets[0] !== targetId) throw new Error('主题包必须是与目录一致的单目标包。');
  const target = bundle.targets[targetId];
  validateCss(target?.css, targetId);
  validateVerification(target?.verification);
  const images = Object.entries(bundle.assets?.images ?? {});
  if (!images.length || images.length > 32) throw new Error('图片数量必须在 1 到 32 之间。');
  for (const [name, image] of images) {
    if (!SAFE_ID.test(name) || !image || typeof image !== 'object') throw new Error('图片 ID 或图片对象无效。');
    if (path.basename(image.filename ?? '') !== image.filename || !SAFE_MIME.has(image.mimeType) || !BASE64.test(image.base64 ?? '')) {
      throw new Error(`图片 ${name} 的文件名、类型或 Base64 无效。`);
    }
  }
  return true;
}

async function validateOutput(theme, target) {
  const dir = outputDir(theme, target);
  const required = [packageName(theme, target)];
  for (const file of required) {
    try { await fs.access(path.join(dir, file)); }
    catch { throw new Error(`${theme.id}:${target.id} 缺少 ${file}`); }
  }
  const packagePath = path.join(dir, packageName(theme, target));
  const stat = await fs.stat(packagePath);
  if (stat.size > MAX_BYTES) throw new Error(`${theme.id}:${target.id} 包体超过 30 MB。`);
  const bundle = JSON.parse(await fs.readFile(packagePath, 'utf8'));
  validateBundle(bundle, target.id);
  if (bundle.theme.id !== `${theme.id}-${target.id}`) throw new Error(`${theme.id}:${target.id} 主题 ID 与路径不一致。`);
  return { themeId: bundle.theme.id, target: target.id, status: 'PASS', bytes: stat.size };
}

export async function validateAllThemes() {
  const results = [];
  for (const theme of THEMES) for (const target of TARGETS) results.push(await validateOutput(theme, target));
  const packages = [];
  for (const theme of THEMES) for (const target of TARGETS) {
    const absolute = path.join(outputDir(theme, target), packageName(theme, target));
    const relative = path.relative(ROOT_DIR, absolute).replaceAll('\\', '/');
    const bytes = await fs.readFile(absolute);
    packages.push({
      themeId: `${theme.id}-${target.id}`,
      displayName: `${theme.name} · ${target.label}`,
      target: target.id,
      path: relative,
      bytes: bytes.length,
      sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      staticValidation: 'PASS',
      clientVerification: 'NOT_RUN',
      restoreVerification: 'NOT_RUN'
    });
  }
  const report = {
    schemaVersion: 1,
    generatedBy: 'scripts/validate-themes.mjs',
    coreBaseline: '@codedrobe/core@0.3.0',
    nodeBaseline: '>=22.4',
    packageFormat: 'UTF-8 JSON',
    packages
  };
  await fs.writeFile(path.join(ROOT_DIR, 'build-report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  const rows = packages.map((item) => `| ${item.displayName} | ${item.staticValidation} | ${item.clientVerification} | ${item.bytes} | \`${item.sha256}\` |`).join('\n');
  const markdown = `# 构建验证报告\n\n- CodeDrobe Core 基线：\`@codedrobe/core@0.3.0\`；\n- Node.js 基线：\`>=22.4\`；\n- 主题包格式：UTF-8 JSON；\n- 静态校验：10/10 PASS；\n- 真实客户端验证：10/10 NOT_RUN；\n- restore 实机验证：10/10 NOT_RUN。\n\n| 主题包 | 静态校验 | 实机验证 | 字节数 | SHA-256 |\n|---|---|---|---:|---|\n${rows}\n\n静态 PASS 不代表真实客户端兼容；首次使用仍需执行 probe、apply、verify、截图和 restore。\n`;
  await fs.mkdir(path.join(ROOT_DIR, 'docs'), { recursive: true });
  await fs.writeFile(path.join(ROOT_DIR, 'docs/构建验证报告.md'), markdown, 'utf8');
  return results;
}

if (isMain) {
  const results = await validateAllThemes();
  console.log(`静态校验通过：${results.length}/10`);
  for (const item of results) console.log(`- ${item.themeId}: PASS (${item.bytes} bytes)`);
}
