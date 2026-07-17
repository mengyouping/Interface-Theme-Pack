# 十套原创致敬主题包实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立五套共享原创视觉源，并分别生成 Codex 与 WorkBuddy 共十套可下载、可审查、可静态验证的 CodeDrobe 主题包。

**Architecture:** 共享源是视觉唯一事实源；Node.js 构建器生成确定性的 UTF-8 JSON `.codedrobe-theme`，校验器检查官方 schema 关键约束并生成哈希报告，索引器生成公开下载目录。

**Tech Stack:** Node.js 22.16、ES Modules、JSON、CSS、SVG、PNG、CodeDrobe schemaVersion 1、GitHub Actions。

## 全局约束

- 所有提交、PR 和合并说明使用中文；
- 原创致敬，不包含第三方受保护素材；
- 双端单目标独立打包；
- 静态通过不冒充实机兼容；
- 运行基线为 `@codedrobe/core@0.3.0` 与 Node.js `>=22.4`。

## 任务状态

- [x] 建立 package、主题配置、串行测试入口和质量工作流；
- [x] 通过测试先行建立五套共享主题源；
- [x] 生成四类原创 SVG 与对应 PNG；
- [x] 编写 Codex 与 WorkBuddy 独立宿主 CSS；
- [x] 实现确定性 CodeDrobe JSON 主题包构建器；
- [x] 生成 Codex 五套与 WorkBuddy 五套主题包；
- [x] 实现包结构、CSS、图片、大小和状态静态校验；
- [x] 生成 `build-report.json` 与 SHA-256 验证报告；
- [x] 建立 README、使用、制作、版权与兼容性文档；
- [x] 建立 6 项 Node.js 回归测试；
- [x] 执行 `npm run check`，6/6 测试通过；
- [ ] 创建中文 PR 并合入 `main`；
- [ ] 从主线回读十套包和验证报告。

## 本地验证结果

```text
主题源码：5/5 PASS
单目标主题包：10/10 PASS
静态校验：10/10 PASS
Node.js 回归：6/6 PASS
Codex 实机：NOT_RUN
WorkBuddy 实机：NOT_RUN
restore 实机：NOT_RUN
```

首次实机使用仍需执行 `codedrobe theme inspect`、`probe`、`apply`、`verify --screenshot` 和 `restore`。
