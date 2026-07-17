# Interface Theme Pack 原创致敬主题包设计规格

## 1. 项目目标

在公开仓库 `mengyouping/Interface-Theme-Pack` 中建立一套可持续维护的 CodeDrobe 主题包资产库。首批交付五套原创致敬主题，每套主题分别提供 Codex 与 WorkBuddy 独立主题包，同时共享统一的视觉源、设计令牌和版权说明。

首批主题：

1. 侦探暗夜 `detective-noir`；
2. 鹰羽信条 `creed-of-shadows`；
3. 灵境汤屋 `spirit-bathhouse`；
4. 红色警戒指挥部 `red-alert-command`；
5. 星海霸权 `stellar-dominion`。

## 2. 核心原则

- 采用原创致敬方案，不复制受保护作品的角色、Logo、截图、海报、地图、UI、台词、音乐或模型；
- 作品名称仅用于设计来源说明，不进入主题 ID、文件名、包名或主题清单；
- 同一主题只维护一份共享设计源，Codex 与 WorkBuddy 分别适配和打包；
- 源码、主题包、预览、版权声明和验证状态同时公开；
- 静态构建成功不等于真实客户端兼容，未经真实 renderer 验证的主题必须标记为 `NOT_RUN`；
- 运行时固定使用 `@codedrobe/core@0.3.0`，升级时重新执行全链路验证。

## 3. 仓库结构

```text
Interface-Theme-Pack/
├── README.md
├── LICENSE
├── NOTICE.md
├── package.json
├── scripts/
│   ├── build-themes.mjs
│   ├── validate-themes.mjs
│   └── generate-index.mjs
├── docs/
│   ├── 使用说明.md
│   ├── 主题制作指南.md
│   ├── 版权与商标说明.md
│   ├── 兼容性矩阵.md
│   └── superpowers/
│       ├── specs/
│       └── plans/
├── shared-theme-sources/
│   ├── detective-noir/
│   ├── creed-of-shadows/
│   ├── spirit-bathhouse/
│   ├── red-alert-command/
│   └── stellar-dominion/
├── Codex主题包/
│   ├── 侦探暗夜/
│   ├── 鹰羽信条/
│   ├── 灵境汤屋/
│   ├── 红色警戒指挥部/
│   └── 星海霸权/
└── WorkBuddy主题包/
    ├── 侦探暗夜/
    ├── 鹰羽信条/
    ├── 灵境汤屋/
    ├── 红色警戒指挥部/
    └── 星海霸权/
```

## 4. 共享主题源模型

每个 `shared-theme-sources/<theme-id>/` 目录包含：

```text
<theme-id>/
├── design-tokens.json
├── theme-metadata.json
├── assets/
│   ├── hero.svg
│   ├── texture.svg
│   ├── emblem.svg
│   └── ambient.svg
├── codex.css
├── workbuddy.css
└── README.md
```

### 4.1 `design-tokens.json`

保存双端共享的视觉参数：

- 主背景、次背景、表面色；
- 主文字、次文字、弱化文字；
- 主强调色、危险色、成功色；
- 边框、阴影、发光、透明度；
- 圆角、间距、代码块、输入框和选中态参数。

### 4.2 `theme-metadata.json`

保存：

- `id`；
- 中文显示名；
- 英文显示名；
- 版本；
- 原创视觉说明；
- 禁止使用的受保护元素；
- 作者与许可证；
- Codex 与 WorkBuddy 兼容状态。

### 4.3 原创资产

所有视觉资产使用仓库内可审查的 SVG 源文件生成，不使用外部图片链接。每套主题至少包含：

- 一张主视觉背景；
- 一张低对比度纹理；
- 一个原创抽象徽记；
- 一张环境装饰图层。

装饰图层必须使用 `pointer-events: none`，不得遮挡原生交互。

## 5. 五套主题视觉定义

### 5.1 侦探暗夜

- 色彩：午夜蓝、墨黑、线索红、金属银；
- 元素：钟表刻度、线索网络、城市雨夜、放大镜几何；
- 气质：冷静、推理、克制、精密；
- 禁止：角色轮廓、蝴蝶结变声器、官方字体、作品 Logo。

### 5.2 鹰羽信条

- 色彩：石灰白、炭灰、猩红、古铜；
- 元素：鹰羽、古城墙纹理、隐秘三角、手稿线条；
- 气质：历史、秩序、隐秘、垂直空间；
- 禁止：刺客徽标、角色服装复刻、游戏截图、官方图腾。

### 5.3 灵境汤屋

- 色彩：朱红、墨绿、暖金、雾白；
- 元素：灯笼、水波、木构剪影、蒸汽、纸纹；
- 气质：温暖、神秘、东方幻想、夜间旅途；
- 禁止：具体角色、无脸男轮廓、汤屋原建筑复刻、电影截图。

### 5.4 红色警戒指挥部

- 色彩：军绿、暗铁、警戒红、雷达青；
- 元素：战略网格、雷达扫描、工业铆钉、数据终端；
- 气质：冷战、命令中心、实时监控、机械效率；
- 禁止：阵营 Logo、单位图标、地图截图、游戏 UI 复刻。

### 5.5 星海霸权

- 色彩：深空蓝、幽能紫、机械青、星云白；
- 元素：星云、能量轨迹、舰桥 HUD、六边形装甲；
- 气质：宏大、未来、深空、能量科技；
- 禁止：种族标志、角色、单位、官方 Logo、游戏界面复刻。

## 6. Codex 与 WorkBuddy 独立交付结构

每个主题在两个目标目录分别生成：

```text
<中文主题名>/
├── <theme-id>-codex.codedrobe-theme
├── theme.json
├── codex.css
├── assets/
├── preview.svg
├── README.md
└── validation.json
```

WorkBuddy 目录将 `codex` 替换为 `workbuddy`。

### 6.1 主题清单

每个输出包只声明一个 target，以便用户按客户端独立下载、安装和排障。清单必须包含：

- `schemaVersion: 1`；
- 唯一主题 ID；
- 语义版本；
- 内嵌命名图片；
- 对应目标 CSS；
- 基础主题色；
- `required` 与 `recommended` 验证节点。

### 6.2 CSS 作用域

- Codex 规则必须位于 `html.codedrobe-host-codex` 下；
- WorkBuddy 规则必须位于 `html.codedrobe-host-workbuddy` 下；
- 不使用远程 `@import`、远程 `url(...)`、脚本或事件处理器；
- 不隐藏导航、菜单、模型选择、输入框、发送按钮和滚动区域；
- 支持 `prefers-reduced-motion`；
- 固定宽度不得造成横向溢出。

## 7. 构建系统

### 7.1 `build-themes.mjs`

职责：

1. 读取五套共享主题源；
2. 分别生成 Codex 与 WorkBuddy 单目标目录；
3. 复制原创 SVG 资产；
4. 生成目标 `theme.json`；
5. 调用固定版本 CodeDrobe Core 打包 `.codedrobe-theme`；
6. 输出构建摘要。

### 7.2 `validate-themes.mjs`

静态检查：

- 主题 ID、目录和文件名唯一；
- JSON 可解析；
- 所有图片路径存在；
- 每包只包含一个 target；
- CSS 作用域正确；
- 不存在远程资源、JavaScript、`@import` 或危险 URL；
- 图片数量不超过 32；
- 包体不超过 30 MB；
- README 和 `validation.json` 存在；
- 十个主题输出全部完成。

### 7.3 `generate-index.mjs`

生成根目录主题索引，展示：

- 主题名称；
- 目标客户端；
- 当前版本；
- 文件路径；
- 静态构建状态；
- 实机验证状态；
- 恢复命令。

## 8. 验证状态模型

每个 `validation.json` 使用以下状态：

- `PASS`：实际完成且证据存在；
- `FAIL_CODE`：主题源、构建、格式或校验失败；
- `BLOCKED_ENV`：缺少 Node、CodeDrobe、客户端或 Runner；
- `NOT_RUN`：尚未进行真实客户端验证。

首版目标状态：

```text
主题源码生成：PASS
JSON/CSS/资产静态检查：PASS
.codedrobe-theme 打包：PASS
Codex 实机 probe/apply/verify：NOT_RUN
WorkBuddy 实机 probe/apply/verify：NOT_RUN
restore 实机验证：NOT_RUN
```

不将静态预览图冒充客户端截图。

## 9. 使用流程

用户下载对应 `.codedrobe-theme` 后执行：

```bash
codedrobe theme inspect /absolute/theme.codedrobe-theme
codedrobe probe --app <app-id> --theme /absolute/theme.codedrobe-theme
codedrobe apply --app <app-id> --theme /absolute/theme.codedrobe-theme
codedrobe verify --app <app-id> --theme /absolute/theme.codedrobe-theme --screenshot /absolute/preview.png
```

出现兼容问题或试用结束时执行：

```bash
codedrobe restore --app <app-id>
```

未经用户授权不得加入 `--restart-existing`。

## 10. 版权与公开仓库策略

- 仓库许可证只覆盖原创代码、CSS、SVG 和文档；
- 第三方产品名仅用于兼容性描述或灵感说明，其商标归原权利人所有；
- 主题名、徽记和视觉资产全部原创；
- 不接受直接提交官方素材、影视截图、游戏截图或来源不明图片；
- Pull Request 模板要求贡献者确认素材所有权；
- 发现侵权内容时删除对应资产和构建产物，并在变更记录中说明。

## 11. 测试与验收

### 11.1 自动化验收

- 五套共享主题源完整；
- Codex 主题目录 5 个；
- WorkBuddy 主题目录 5 个；
- 十个单目标清单可解析；
- 十个 CSS 文件具备正确宿主作用域；
- 十个主题包成功打包；
- 静态安全扫描无远程资源或脚本；
- 索引、README、版权说明和兼容矩阵完整。

### 11.2 实机验收

每个客户端主题后续必须验证：

- 首页；
- 普通会话或任务页；
- 侧栏；
- 输入区；
- 代码块、表格、长文本和滚动；
- 菜单、模型选择和发送操作；
- 无横向溢出；
- 装饰层不拦截点击；
- `restore` 能恢复官方外观。

## 12. 失败处理

- 构建失败：停止发布该主题，不保留伪造包；
- JSON 或资源路径失败：修复共享源后重新生成双端产物；
- 单端选择器失效：只修复该端 CSS，不复制修改到另一端；
- 应用升级导致失效：重新采集真实 DOM 快照，提升主题版本后重新打包；
- 实机交互被破坏：立即执行 `codedrobe restore --app <app-id>`；
- 版权争议：先下架争议资产和包，再调查来源。

## 13. 首批交付范围

本阶段交付：

- 五套原创共享视觉源；
- 五套 Codex 独立主题源码与包；
- 五套 WorkBuddy 独立主题源码与包；
- 自动生成、打包、静态验证和索引脚本；
- 使用、制作、版权和兼容性文档；
- 仓库根 README、许可证、NOTICE 和贡献约束；
- 静态预览图；
- 构建与验证结果。

本阶段不包含：

- 主题商店后端；
- 在线安装服务；
- 自动修改 Codex 或 WorkBuddy 安装包；
- 未经授权的官方素材；
- 在缺少真实客户端的情况下伪造实机验证结论。
