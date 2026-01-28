<!--
  Sync Impact Report:
  - Version change: 1.0.0 → 1.1.0
  - Added principles: VI. 专业前端设计 (frontend-design 技能使用)
  - Modified sections: None
  - Templates requiring updates: None (existing templates compatible)
  - Follow-up TODOs: None
-->

# Peer Review System 前端 Constitution

## 核心原则

### I. 全站中文优先

所有用户可见的界面文本、提示信息、错误消息、文档必须使用简体中文。代码注释和 API 文档可使用英文，但用户交互层面必须完全中文化。

**理由**：确保目标用户群体（中英文混合团队或中文用户）能够无障碍使用系统，提升用户体验和可理解性。

### II. 组件化开发

UI 必须拆分为独立、可复用的组件。每个组件必须拥有清晰的职责边界、独立的样式（使用 CSS Modules 或类似方案）、 Props 类型定义。组件文件结构遵循 feature-based 或 domain-driven 方式组织。

**理由**：提升代码可维护性、可测试性，支持团队并行开发，减少代码重复。

### III. 响应式设计

所有页面必须适配桌面端（1024px+）、平板端（768px-1023px）、移动端（<768px）。使用移动优先（Mobile-First）的策略进行样式开发，确保核心功能在小屏幕设备上可用。

**理由**：现代 Web 应用的用户访问设备多样，响应式设计确保一致的用户体验。

### IV. 用户体验优先

界面设计遵循一致的设计语言（Design System），提供清晰的视觉反馈（加载状态、成功/失败提示），交互响应时间不超过 200ms，关键操作提供确认步骤，避免用户误操作。

**理由**：良好的 UX 提升用户满意度和系统采用率，减少培训和 Support 成本。

### V. 代码质量与测试

前端代码必须通过 ESLint/Prettier 检查，提交前运行单元测试。核心业务逻辑（状态管理、数据转换、复杂交互）必须有对应的单元测试覆盖。UI 组件必须有快照测试或 Storybook 文档。

**理由**：保障代码一致性，减少线上 Bug，降低重构风险。

### VI. 专业前端设计

在进行任何前端界面设计时，必须使用 `/frontend-design` 技能生成高质量、可访问、符合现代设计标准的 UI 实现。设计产出必须经过用户确认后再进行代码实现。

**理由**：确保界面设计质量、用户体验一致性，减少设计返工，提升整体交付效率。

## 额外约束

**技术栈要求**：
- 必须使用 TypeScript 进行开发
- 必须使用现代框架（React/Vue 3.x 或更新版本）
- 样式方案：CSS Modules、Tailwind CSS 或 Styled Components
- 状态管理：根据项目规模选择 Context API、Zustand、Redux Toolkit

**性能标准**：
- 首屏加载时间（LCP）不超过 2.5 秒
- 页面切换过渡动画不超过 300ms
- 避免不必要的重新渲染，使用 React.memo / useMemo / useCallback 优化

## 开发工作流

**代码审查要求**：
- 所有代码变更必须通过 Pull Request 审查
- 审查者必须验证中文文本准确性和一致性
- 至少一名 reviewer 批准后方可合并

**质量门禁**：
- CI 流水线必须通过：Lint → Type Check → Test → Build
- 测试覆盖率不低于 70%（行覆盖率）
- Build 产物大小在合理范围内

## 治理

本 Constitution 是项目开发的最高准则，所有开发活动必须遵循。修改 Constitution 必须：
1. 在 PR 中说明修改原因和影响范围
2. 经核心维护者批准
3. 同步更新相关模板文件

**Version**: 1.1.0 | **Ratified**: 2026-01-28 | **Last Amended**: 2026-01-28
