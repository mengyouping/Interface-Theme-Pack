import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { THEMES, TARGETS, ROOT_DIR, sourceDir, outputDir, packageName } from '../scripts/lib/theme-config.mjs';
import { buildAllThemes } from '../scripts/build-themes.mjs';
import { validateAllThemes, validateBundle, validateCss } from '../scripts/validate-themes.mjs';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

test('配置稳定映射五套共享源和十套单目标输出', () => {
  assert.equal(THEMES.length, 5);
  assert.equal(TARGETS.length, 2);
  assert.equal(new Set(THEMES.map((item) => item.id)).size, 5);
  assert.equal(new Set(TARGETS.map((item) => item.id)).size, 2);
  assert.equal(new Set(THEMES.flatMap((theme) => TARGETS.map((target) => `${theme.id}:${target.id}`))).size, 10);
});

test('五套紧凑共享源包含元数据、令牌、原创SVG、双端CSS和徽记图片', () => {
  for (const theme of THEMES) {
    const file = path.join(sourceDir(theme), 'theme-source.json');
    assert.equal(fs.existsSync(file), true);
    const source = readJson(file);
    assert.equal(source.metadata.id, theme.id);
    assert.equal(source.metadata.license, 'MIT');
    assert.match(source.tokens.colors.background, /^#[0-9a-f]{6}$/i);
    for (const name of ['heroSvg', 'textureSvg', 'emblemSvg', 'ambientSvg']) assert.match(source.assets[name], /^<svg/);
    assert.equal(source.assets.emblemImage.mimeType, 'image/png');
    assert.match(source.assets.emblemImage.base64, /^[A-Za-z0-9+/]+=*$/);
    assert.match(source.css.codex, /html\.codedrobe-host-codex/);
    assert.match(source.css.workbuddy, /html\.codedrobe-host-workbuddy/);
    for (const css of Object.values(source.css)) {
      assert.doesNotMatch(css, /@import\s/i);
      assert.doesNotMatch(css, /url\(\s*["']?https?:/i);
      assert.doesNotMatch(css, /javascript:/i);
    }
  }
});

test('构建生成十个字节稳定的 CodeDrobe JSON 主题包', async () => {
  await buildAllThemes();
  const first = new Map();
  for (const theme of THEMES) for (const target of TARGETS) {
    const file = path.join(outputDir(theme, target), packageName(theme, target));
    assert.equal(fs.existsSync(file), true);
    const bytes = fs.readFileSync(file);
    first.set(file, crypto.createHash('sha256').update(bytes).digest('hex'));
    const bundle = JSON.parse(bytes.toString('utf8'));
    assert.equal(bundle.format, 'codedrobe-theme');
    assert.deepEqual(Object.keys(bundle.targets), [target.id]);
    assert.equal(Object.keys(bundle.assets.images).length, 1);
  }
  await buildAllThemes();
  for (const [file, hash] of first) {
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), hash);
  }
});

test('校验器拒绝远程资源、错误作用域、多目标和无效图片', () => {
  assert.throws(() => validateCss('body{background:url(https://example.com/a.png)}', 'codex'));
  assert.throws(() => validateCss('html.codedrobe-host-workbuddy body{}', 'codex'));
  const valid = {
    format: 'codedrobe-theme', schemaVersion: 1,
    theme: { id: 'safe-codex', displayName: 'Safe', version: '1.0.0' },
    targets: { codex: { css: 'html.codedrobe-host-codex body{}', verification: { required: [{ name: 'body', any: ['body'] }] } } },
    assets: { images: { emblem: { filename: 'emblem.png', mimeType: 'image/png', base64: 'aGVsbG8=' } } }
  };
  assert.equal(validateBundle(valid, 'codex'), true);
  assert.throws(() => validateBundle({ ...valid, targets: { ...valid.targets, workbuddy: valid.targets.codex } }, 'codex'));
  assert.throws(() => validateBundle({ ...valid, assets: { images: { emblem: { filename: '../x', mimeType: 'image/svg+xml', base64: '*' } } } }, 'codex'));
});

test('十套主题静态校验 PASS 且实机与恢复保持 NOT_RUN', async () => {
  await buildAllThemes();
  const results = await validateAllThemes();
  assert.equal(results.length, 10);
  assert.equal(results.every((item) => item.status === 'PASS'), true);
  const report = readJson(path.join(ROOT_DIR, 'build-report.json'));
  assert.equal(report.packages.length, 10);
  assert.equal(report.packages.every((item) => item.staticValidation === 'PASS'), true);
  assert.equal(report.packages.every((item) => item.clientVerification === 'NOT_RUN'), true);
  assert.equal(report.packages.every((item) => item.restoreVerification === 'NOT_RUN'), true);
});

test('公开仓库文档包含十套路径、完整命令和原创版权边界', () => {
  for (const file of ['README.md', 'LICENSE', 'NOTICE.md', 'docs/主题包指南.md', 'docs/构建验证报告.md']) {
    assert.equal(fs.existsSync(path.join(ROOT_DIR, file)), true, `缺少 ${file}`);
  }
  const readme = fs.readFileSync(path.join(ROOT_DIR, 'README.md'), 'utf8');
  for (const command of ['theme inspect', 'probe --app', 'apply --app', 'verify --app', 'restore --app']) assert.match(readme, new RegExp(command));
  for (const theme of THEMES) for (const target of TARGETS) assert.match(readme, new RegExp(packageName(theme, target)));
  assert.match(readme, /原创致敬/);
  assert.match(readme, /NOT_RUN/);
});
