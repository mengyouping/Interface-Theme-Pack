# 十套原创致敬主题包实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `Interface-Theme-Pack` 中建立五套共享原创视觉源，并分别生成 Codex 与 WorkBuddy 共十套可下载、可审查、可静态验证的 CodeDrobe 主题包。

**Architecture:** 以 `shared-theme-sources/` 作为唯一设计事实源，每套主题保存元数据、令牌、原创 SVG 和双端 CSS。Node.js 构建器从共享源生成两个发布目录，使用确定性 ZIP 结构生成 `.codedrobe-theme`，校验器验证清单、资源、CSS 安全边界、包内容和数量，索引器生成公开主题目录。

**Tech Stack:** Node.js >=22.4、ES Modules、JSON、CSS、SVG、ZIP、CodeDrobe schemaVersion 1、GitHub Actions。

## Global Constraints

- 所有提交、PR 和合并说明使用中文；
- 五套主题全部采用原创致敬方案，不包含第三方角色、Logo、截图、台词、音乐、地图、单位图标或官方 UI；
- 主题 ID、包名和公开显示名不使用受保护作品名称；
- 同一主题只维护一份共享源，Codex 与 WorkBuddy 分别生成单目标主题包；
- CSS 必须分别限定在 `html.codedrobe-host-codex` 和 `html.codedrobe-host-workbuddy`；
- 禁止远程 `@import`、远程 `url(...)`、JavaScript、事件处理器和交互遮挡层；
- 静态验证通过不得描述为真实客户端兼容；首版实机状态统一为 `NOT_RUN`；
- `.codedrobe-theme` 每包只含一个 target，资源数量不超过 32，包体不超过 30 MB；
- 运行基线记录为 `@codedrobe/core@0.3.0` 与 Node.js `>=22.4`；
- 构建结果必须可重复，重复运行不得产生无关差异。

---

### Task 1: 建立仓库工程骨架与测试入口

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.github/workflows/theme-quality.yml`
- Create: `scripts/lib/theme-config.mjs`
- Create: `tests/theme-config.test.mjs`

**Interfaces:**
- Produces: `THEMES`、`TARGETS`、`ROOT_DIR`、`sourceDir(theme)`、`outputDir(theme, target)`，供构建、校验、索引脚本共同使用。

- [ ] 编写失败测试，断言存在五个唯一主题、两个唯一目标和十个唯一输出组合。
- [ ] 运行 `node --test tests/theme-config.test.mjs`，预期在配置模块不存在时失败。
- [ ] 实现配置模块与项目脚本入口。
- [ ] 再次运行测试，预期全部通过。
- [ ] 使用中文提交工程骨架。

### Task 2: 建立五套共享原创视觉源

**Files:**
- Create: `shared-theme-sources/<theme-id>/theme-metadata.json`
- Create: `shared-theme-sources/<theme-id>/design-tokens.json`
- Create: `shared-theme-sources/<theme-id>/assets/hero.svg`
- Create: `shared-theme-sources/<theme-id>/assets/texture.svg`
- Create: `shared-theme-sources/<theme-id>/assets/emblem.svg`
- Create: `shared-theme-sources/<theme-id>/assets/ambient.svg`
- Create: `shared-theme-sources/<theme-id>/codex.css`
- Create: `shared-theme-sources/<theme-id>/workbuddy.css`
- Create: `shared-theme-sources/<theme-id>/README.md`
- Create: `tests/source-themes.test.mjs`

**Interfaces:**
- Consumes: Task 1 的 `THEMES` 和路径函数。
- Produces: 五份完整共享主题源，构建器只从这里读取视觉事实。

- [ ] 编写测试，检查每套主题九个必需文件、元数据 ID、颜色令牌、四个原创 SVG 和正确 CSS 宿主作用域。
- [ ] 运行测试并确认缺失源文件导致失败。
- [ ] 完成侦探暗夜、鹰羽信条、灵境汤屋、红色警戒指挥部、星海霸权五套视觉源。
- [ ] 运行测试，确认五套共享源全部通过。
- [ ] 使用中文提交共享视觉源。

### Task 3: 实现确定性主题包构建器

**Files:**
- Create: `scripts/lib/zip-store.mjs`
- Create: `scripts/build-themes.mjs`
- Create: `tests/zip-store.test.mjs`
- Create: `tests/build-themes.test.mjs`

**Interfaces:**
- Consumes: 共享主题源、`THEMES`、`TARGETS`。
- Produces: `Codex主题包/<中文主题名>/` 与 `WorkBuddy主题包/<中文主题名>/` 下的清单、CSS、资产、预览、说明、验证状态和 `.codedrobe-theme`。

- [ ] 编写 ZIP 单元测试，检查本地文件头、中央目录、CRC32 和相同输入产生相同字节。
- [ ] 编写构建集成测试，要求十个输出目录和十个包全部存在且每包仅声明一个 target。
- [ ] 运行测试并确认构建器未实现时失败。
- [ ] 实现无第三方依赖的 ZIP Store 打包器与双端构建流程。
- [ ] 运行 `npm run build` 和相关测试，确认十套产物生成成功。
- [ ] 使用中文提交构建器与主题产物。

### Task 4: 实现严格静态校验器

**Files:**
- Create: `scripts/validate-themes.mjs`
- Create: `tests/validate-themes.test.mjs`

**Interfaces:**
- Consumes: 十套构建输出。
- Produces: 进程退出码、控制台摘要和各输出目录 `validation.json`。

- [ ] 编写测试，覆盖远程资源、错误作用域、缺失资产、多 target、超限资源和不完整输出。
- [ ] 运行测试并确认校验模块缺失时失败。
- [ ] 实现 JSON、CSS、SVG、ZIP、数量、大小、版权字段和状态语义校验。
- [ ] 运行 `npm run validate`，要求十套主题静态校验全部 `PASS`，实机字段保持 `NOT_RUN`。
- [ ] 使用中文提交校验器。

### Task 5: 生成公开索引、使用文档与版权治理

**Files:**
- Create: `scripts/generate-index.mjs`
- Create: `README.md`
- Create: `NOTICE.md`
- Create: `LICENSE`
- Create: `docs/使用说明.md`
- Create: `docs/主题制作指南.md`
- Create: `docs/版权与商标说明.md`
- Create: `docs/兼容性矩阵.md`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `tests/docs.test.mjs`

**Interfaces:**
- Consumes: 构建结果及 `validation.json`。
- Produces: 可浏览的主题索引、安装/恢复命令、兼容性状态与贡献治理规则。

- [ ] 编写文档测试，检查十套下载路径、`inspect/probe/apply/verify/restore` 命令、原创声明和 `NOT_RUN` 说明。
- [ ] 运行测试并确认文档缺失时失败。
- [ ] 实现索引生成与全部公开文档。
- [ ] 运行 `npm run index` 和文档测试。
- [ ] 使用中文提交文档与治理文件。

### Task 6: 建立全量质量门禁并完成构建验证

**Files:**
- Modify: `package.json`
- Modify: `.github/workflows/theme-quality.yml`
- Create: `tests/repository.test.mjs`

**Interfaces:**
- Consumes: 全部源码、构建器、校验器和文档。
- Produces: `npm test`、`npm run build`、`npm run validate`、`npm run check` 的统一质量结论。

- [ ] 编写仓库级测试，检查恰好五套共享源、十套发布目录、十个主题包、无受保护名称进入 ID/包名、无未声明二进制来源。
- [ ] 运行完整测试并修复真实失败。
- [ ] 执行两次干净构建，对比主题包哈希，确认确定性。
- [ ] 执行 `npm run check`，要求测试、构建、校验和索引均通过。
- [ ] 使用中文提交质量门禁与验证记录。

### Task 7: 创建中文 PR 并合入主线

**Files:**
- Modify: `docs/superpowers/plans/2026-07-16-original-tribute-theme-packs.md`

**Interfaces:**
- Consumes: 已验证实施分支。
- Produces: 中文 PR、中文合并提交和 `main` 主线最终版本。

- [ ] 回写任务完成状态和实际测试结果。
- [ ] 比较实施分支与 `main`，确认只包含本项目范围内变更。
- [ ] 创建中文 PR，说明原创边界、十套产物和实机 `NOT_RUN` 状态。
- [ ] 检查 CI；若 Runner 在零步骤阶段阻断，记录为 `BLOCKED_ENV`，不得伪装为测试通过。
- [ ] 使用中文标题和说明合并到 `main`。
- [ ] 从主线回读 README、两类主题目录、构建脚本、十个包和验证结果。
