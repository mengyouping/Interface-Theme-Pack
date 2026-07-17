# Interface Theme Pack 原创致敬主题包设计规格

## 目标

在公开仓库中维护五套原创视觉源，并分别生成 Codex 与 WorkBuddy 单目标 CodeDrobe 主题包，共十套：侦探暗夜、鹰羽信条、灵境汤屋、红色警戒指挥部、星海霸权。

## 版权边界

- 只吸收侦探叙事、历史隐秘、东方幻想、复古指挥中心、深空科技等抽象视觉语言；
- 不复制第三方角色、Logo、截图、台词、音乐、地图、单位图标、官方字体或官方 UI；
- 公开 ID、包名、文件名和显示名使用原创名称；
- 第三方产品名只用于兼容性说明，不暗示官方授权或合作。

## 架构

`shared-theme-sources/` 是唯一设计事实源。每套主题保存元数据、设计令牌、四层原创 SVG、一张原创徽记 PNG 以及 Codex/WorkBuddy 两份 CSS。构建器从共享源生成 `Codex主题包/` 和 `WorkBuddy主题包/`，每个输出目录只包含一个目标应用。

## CodeDrobe 包格式

`.codedrobe-theme` 是 UTF-8 JSON，不是 ZIP。包遵循 `schemaVersion: 1`，包含：

- `format: codedrobe-theme`；
- `theme.id/displayName/version/copy`；
- 单一 `targets.codex` 或 `targets.workbuddy`；
- 目标 CSS、options 与 verification；
- `assets.images` 中一张原创徽记 PNG 的文件名、MIME 和 Base64；四层 SVG 保留在共享源中用于审查和再生成。

单包不超过 30 MB，图片不超过 32 张，只使用 PNG/JPEG/WebP/GIF。构建结果省略非必要时间戳，确保相同输入产生相同字节。

## CSS 安全边界

- Codex 全部限定在 `html.codedrobe-host-codex`；
- WorkBuddy 全部限定在 `html.codedrobe-host-workbuddy`；
- 禁止远程 `@import`、远程 `url(...)`、JavaScript 与事件处理器；
- 装饰层使用 `pointer-events: none`；
- 不隐藏导航、菜单、输入、模型选择、发送和滚动区域；
- 支持 `prefers-reduced-motion`。

## 构建与验证

- `npm run build`：生成十套主题源码目录与 `.codedrobe-theme`；
- `npm run validate`：校验 JSON、CSS、图片、单目标、大小与状态语义，并生成 SHA-256 报告；
- `npm run index`：生成根目录主题索引；
- `npm test`：串行执行构建、安全、文档和仓库回归测试；
- `npm run check`：按构建、校验、索引、测试的顺序完成全量门禁。

静态状态与实机状态分离：源码生成、包构建和静态校验可以为 `PASS`；没有真实客户端、DOM、截图和恢复证据时，Codex、WorkBuddy 与 restore 必须保持 `NOT_RUN`。

## 首版验收

- 五套共享主题源完整；
- Codex 五套、WorkBuddy 五套，共十个单目标包；
- 十个包静态校验均为 `PASS`；
- 十个包均记录 SHA-256；
- 所有实机状态保持 `NOT_RUN`；
- 公开文档说明安装、验证、恢复和版权边界；
- 所有提交、PR 与合并说明使用中文。
