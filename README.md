# Interface Theme Pack

面向 CodeDrobe 的原创致敬界面主题资产库。五套共享视觉源分别生成 Codex 与 WorkBuddy 单目标主题包，共计十套。主题图形、CSS、SVG、PNG 与文档均为本仓库原创，不包含第三方角色、Logo、截图、台词、音乐、地图、单位图标或官方 UI。

## 主题目录

| 主题 | 客户端 | 版本 | 主题包 | 静态校验 | 实机状态 |
|---|---|---:|---|---|---|
| 侦探暗夜 | Codex | 1.0.0 | [下载主题包](Codex%E4%B8%BB%E9%A2%98%E5%8C%85/%E4%BE%A6%E6%8E%A2%E6%9A%97%E5%A4%9C/detective-noir-codex.codedrobe-theme) | PASS | NOT_RUN |
| 侦探暗夜 | WorkBuddy | 1.0.0 | [下载主题包](WorkBuddy%E4%B8%BB%E9%A2%98%E5%8C%85/%E4%BE%A6%E6%8E%A2%E6%9A%97%E5%A4%9C/detective-noir-workbuddy.codedrobe-theme) | PASS | NOT_RUN |
| 鹰羽信条 | Codex | 1.0.0 | [下载主题包](Codex%E4%B8%BB%E9%A2%98%E5%8C%85/%E9%B9%B0%E7%BE%BD%E4%BF%A1%E6%9D%A1/creed-of-shadows-codex.codedrobe-theme) | PASS | NOT_RUN |
| 鹰羽信条 | WorkBuddy | 1.0.0 | [下载主题包](WorkBuddy%E4%B8%BB%E9%A2%98%E5%8C%85/%E9%B9%B0%E7%BE%BD%E4%BF%A1%E6%9D%A1/creed-of-shadows-workbuddy.codedrobe-theme) | PASS | NOT_RUN |
| 灵境汤屋 | Codex | 1.0.0 | [下载主题包](Codex%E4%B8%BB%E9%A2%98%E5%8C%85/%E7%81%B5%E5%A2%83%E6%B1%A4%E5%B1%8B/spirit-bathhouse-codex.codedrobe-theme) | PASS | NOT_RUN |
| 灵境汤屋 | WorkBuddy | 1.0.0 | [下载主题包](WorkBuddy%E4%B8%BB%E9%A2%98%E5%8C%85/%E7%81%B5%E5%A2%83%E6%B1%A4%E5%B1%8B/spirit-bathhouse-workbuddy.codedrobe-theme) | PASS | NOT_RUN |
| 红色警戒指挥部 | Codex | 1.0.0 | [下载主题包](Codex%E4%B8%BB%E9%A2%98%E5%8C%85/%E7%BA%A2%E8%89%B2%E8%AD%A6%E6%88%92%E6%8C%87%E6%8C%A5%E9%83%A8/red-alert-command-codex.codedrobe-theme) | PASS | NOT_RUN |
| 红色警戒指挥部 | WorkBuddy | 1.0.0 | [下载主题包](WorkBuddy%E4%B8%BB%E9%A2%98%E5%8C%85/%E7%BA%A2%E8%89%B2%E8%AD%A6%E6%88%92%E6%8C%87%E6%8C%A5%E9%83%A8/red-alert-command-workbuddy.codedrobe-theme) | PASS | NOT_RUN |
| 星海霸权 | Codex | 1.0.0 | [下载主题包](Codex%E4%B8%BB%E9%A2%98%E5%8C%85/%E6%98%9F%E6%B5%B7%E9%9C%B8%E6%9D%83/stellar-dominion-codex.codedrobe-theme) | PASS | NOT_RUN |
| 星海霸权 | WorkBuddy | 1.0.0 | [下载主题包](WorkBuddy%E4%B8%BB%E9%A2%98%E5%8C%85/%E6%98%9F%E6%B5%B7%E9%9C%B8%E6%9D%83/stellar-dominion-workbuddy.codedrobe-theme) | PASS | NOT_RUN |

> `PASS` 仅表示包结构、CSS 安全边界、资源和清单通过仓库静态校验。`NOT_RUN` 表示尚未在真实 Codex/WorkBuddy renderer 上执行 probe、apply、verify、截图与 restore。

## 快速使用

要求 Node.js `>=22.4`，建议固定使用 `@codedrobe/core@0.3.0`：

```bash
npm install --global @codedrobe/core@0.3.0
codedrobe theme inspect /absolute/theme.codedrobe-theme
codedrobe probe --app codex --theme /absolute/theme.codedrobe-theme
codedrobe apply --app codex --theme /absolute/theme.codedrobe-theme
codedrobe verify --app codex --theme /absolute/theme.codedrobe-theme --screenshot /absolute/result.png
codedrobe restore --app codex
```

WorkBuddy 将 `--app codex` 替换为 `--app workbuddy`。未经明确授权不要使用 `--restart-existing`。

## 本地构建

```bash
npm run build
npm run validate
npm run index
npm test
npm run check
```

`.codedrobe-theme` 是 UTF-8 JSON 文件，不是 ZIP；包内嵌目标 CSS 与一张原创徽记 PNG 的 Base64 数据。共享主题源同时保留四层原创 SVG 字符串，方便审查与再生成。

## 目录

- `shared-theme-sources/`：五套共享设计事实源；
- `Codex主题包/`：五套 Codex 单目标包；
- `WorkBuddy主题包/`：五套 WorkBuddy 单目标包；
- `scripts/`：构建、校验与索引生成；
- `docs/`：使用、制作、版权和兼容性说明；
- `tests/`：结构、构建、安全与文档回归测试。

## 许可证与商标

仓库原创代码、CSS、图形和文档采用 MIT License。Codex、OpenAI、WorkBuddy、Tencent、CodeDrobe 及其他第三方名称仅用于兼容性描述，相关商标归各自权利人所有。本仓库不代表任何第三方官方背书。
