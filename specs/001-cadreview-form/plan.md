# Implementation Plan: 干部述职评议表单

**Branch**: `001-cadreview-form` | **Date**: 2026-01-28 | **Spec**: [link](spec.md)
**Input**: Feature specification from `specs/001-cadreview-form/spec.md`

## Summary

干部述职评议表单是一个集成到飞书工作台的移动优先 Web 应用，用于年终干部考核场景。核心功能包括：飞书 OAuth2.0 授权登录、从飞书多维表格获取评议任务列表、对被评议人进行 5 项评分、提交/修改评议数据到飞书多维表格。所有数据实时从飞书接口获取，不做本地持久化。

## Technical Context

**Language/Version**: TypeScript 5.x + React 18.x
**Primary Dependencies**: React, React Router, axios, Tailwind CSS
**Storage**: localStorage (refresh_token only) + 内存存储 (access_token, 用户信息)
**Testing**: Jest + React Testing Library + Vitest
**Target Platform**: Web (移动端优先，适配 <768px / 768-1023px / >=1024px)
**Project Type**: Single-page web application (前端应用，调用飞书 API)
**Performance Goals**:
- 任务列表加载时间 < 2 秒
- 表单提交成功率 >= 99%
- 数据提交后列表刷新 < 1 秒
**Constraints**:
- 必须使用 TypeScript
- 必须使用 React/Vue 3.x
- 首屏 LCP < 2.5 秒
- 遵循 Constitution 全站中文优先原则
**Scale/Scope**:
- 单用户场景（考核现场评议人）
- 预估 50-100 个评议任务
- 无需后端服务，所有数据通过飞书 API 直接交互

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 全站中文优先 | ✅ PASS | 所有 UI 文本使用简体中文 |
| II. 组件化开发 | ✅ PASS | 组件拆分，职责清晰 |
| III. 响应式设计 | ✅ PASS | 移动优先，适配三端 |
| IV. 用户体验优先 | ✅ PASS | 加载状态、错误提示完整 |
| V. 代码质量与测试 | ✅ PASS | ESLint + TypeScript + 单元测试 |
| VI. 专业前端设计 | ✅ PASS | 使用 /frontend-design 技能 |

**结论**: 所有 Constitution 原则满足，无违规。

## Project Structure

### Documentation (this feature)

```text
specs/001-cadreview-form/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (/speckit.specify output)
├── research.md          # Phase 0 output (skipped - no unknowns)
├── data-model.md        # Phase 1 output (this file)
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md # Feishu API contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── common/          # 通用组件 (Button, Modal, Loading, Toast)
│   ├── layout/          # 布局组件 (Header, PageContainer)
│   ├── task/            # 任务列表相关 (TaskList, TaskItem)
│   └── review/          # 评议表单相关 (ScoreInput, ReviewForm)
├── pages/
│   ├── AuthCallback/    # 授权回调页面
│   ├── TaskList/        # 任务列表页面
│   └── ReviewForm/      # 评议表单页面
├── services/
│   ├── feishu/          # 飞书 API 服务
│   │   ├── auth.ts      # 授权相关 API
│   │   ├── bitable.ts   # 多维表格 API
│   │   └── user.ts      # 用户信息 API
│   └── index.ts         # API 导出
├── hooks/
│   ├── useAuth.ts       # 授权状态管理
│   ├── useTasks.ts      # 任务列表数据管理
│   └── useReview.ts     # 评议表单状态管理
├── stores/
│   └── auth.ts          # 授权状态 store (Zustand/Context)
├── utils/
│   ├── constants.ts     # 常量定义 (API URLs, table IDs)
│   ├── helpers.ts       # 工具函数 (token 刷新, 字段映射)
│   └── validators.ts    # 校验函数
├── types/
│   ├── index.ts         # 全局类型定义
│   ├── feishu.ts        # 飞书 API 类型
│   └── review.ts        # 评议业务类型
├── assets/              # 静态资源
├── styles/              # 全局样式
├── App.tsx              # 应用入口
└── main.tsx             # 入口渲染

tests/
├── unit/                # 单元测试
├── integration/         # 集成测试
└── contract/            # API 契约测试
```

**Structure Decision**: 单页面 Web 应用结构，按功能模块组织。飞书 API 调用封装在 services/feishu 目录，组件按功能分组织到 components/ 和 pages/ 目录。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

无 Constitution 违规，无需填写。
