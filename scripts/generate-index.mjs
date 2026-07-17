import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT_DIR, THEMES, TARGETS, outputDir, packageName } from './lib/theme-config.mjs';

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

export async function generateIndex() {
  const report = JSON.parse(await fs.readFile(path.join(ROOT_DIR, 'build-report.json'), 'utf8'));
  const statusById = new Map(report.packages.map((item) => [item.themeId, item]));
  const rows = [];
  for (const theme of THEMES) {
    for (const target of TARGETS) {
      const validation = statusById.get(`${theme.id}-${target.id}`);
      const packagePath = path.relative(ROOT_DIR, path.join(outputDir(theme, target), packageName(theme, target))).replaceAll('\\', '/');
      rows.push(`| ${theme.name} | ${target.label} | 1.0.0 | [下载主题包](${encodeURI(packagePath)}) | ${validation.staticValidation} | ${validation.clientVerification} |`);
    }
  }
  const readme = `# Interface Theme Pack\n\n面向 CodeDrobe 的原创致敬界面主题资产库。五套共享视觉源分别生成 Codex 与 WorkBuddy 单目标主题包，共计十套。主题图形、CSS、SVG、PNG 与文档均为本仓库原创，不包含第三方角色、Logo、截图、台词、音乐、地图、单位图标或官方 UI。\n\n## 主题目录\n\n| 主题 | 客户端 | 版本 | 主题包 | 静态校验 | 实机状态 |\n|---|---|---:|---|---|---|\n${rows.join('\n')}\n\n> \`PASS\` 仅表示包结构、CSS 安全边界、资源和清单通过仓库静态校验。\`NOT_RUN\` 表示尚未在真实 Codex/WorkBuddy renderer 上执行 probe、apply、verify、截图与 restore。\n\n## 快速使用\n\n要求 Node.js \`>=22.4\`，建议固定使用 \`@codedrobe/core@0.3.0\`：\n\n\`\`\`bash\nnpm install --global @codedrobe/core@0.3.0\ncodedrobe theme inspect /absolute/theme.codedrobe-theme\ncodedrobe probe --app codex --theme /absolute/theme.codedrobe-theme\ncodedrobe apply --app codex --theme /absolute/theme.codedrobe-theme\ncodedrobe verify --app codex --theme /absolute/theme.codedrobe-theme --screenshot /absolute/result.png\ncodedrobe restore --app codex\n\`\`\`\n\nWorkBuddy 将 \`--app codex\` 替换为 \`--app workbuddy\`。未经明确授权不要使用 \`--restart-existing\`。\n\n## 本地构建\n\n\`\`\`bash\nnpm run build\nnpm run validate\nnpm run index\nnpm test\nnpm run check\n\`\`\`\n\n\`.codedrobe-theme\` 是 UTF-8 JSON 文件，不是 ZIP；包内嵌目标 CSS 与一张原创徽记 PNG 的 Base64 数据。共享主题源同时保留四层原创 SVG 字符串，方便审查与再生成。\n\n## 目录\n\n- \`shared-theme-sources/\`：五套共享设计事实源；\n- \`Codex主题包/\`：五套 Codex 单目标包；\n- \`WorkBuddy主题包/\`：五套 WorkBuddy 单目标包；\n- \`scripts/\`：构建、校验与索引生成；\n- \`docs/\`：使用、制作、版权和兼容性说明；\n- \`tests/\`：结构、构建、安全与文档回归测试。\n\n## 许可证与商标\n\n仓库原创代码、CSS、图形和文档采用 MIT License。Codex、OpenAI、WorkBuddy、Tencent、CodeDrobe 及其他第三方名称仅用于兼容性描述，相关商标归各自权利人所有。本仓库不代表任何第三方官方背书。\n`;
  await fs.writeFile(path.join(ROOT_DIR, 'README.md'), readme, 'utf8');
  return rows.length;
}

if (isMain) console.log(`README 已生成，登记 ${await generateIndex()} 套主题包。`);
