# Tasks: 干部述职评议表单

**Input**: Design documents from `specs/001-cadreview-form/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Frontend project: `src/` at repository root
- Paths shown below assume the project structure defined in plan.md

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize React + TypeScript project with required dependencies

- [x] T001 Create React + TypeScript project structure per implementation plan
- [x] T002 [P] Configure Vite build tool with TypeScript in vite.config.ts
- [x] T003 [P] Install dependencies: react, react-dom, react-router-dom, axios, tailwindcss
- [x] T004 [P] Configure Tailwind CSS in tailwind.config.js and src/styles/index.css
- [x] T005 [P] Setup ESLint and Prettier configuration files
- [x] T006 [P] Create environment configuration in .env with feishu credentials
- [x] T007 [P] Configure TypeScript compiler options in tsconfig.json

**Checkpoint**: Project builds successfully, ESLint passes, Dev server runs

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

### Type Definitions

- [x] T008 Create global type definitions in src/types/index.ts
- [x] T009 [P] Create Feishu API types in src/types/feishu.ts
- [x] T010 [P] Create review business types in src/types/review.ts

### Constants and Utilities

- [x] T011 Create API constants in src/utils/constants.ts (URLs, table IDs, scope strings)
- [x] T012 [P] Create field mapping utilities in src/utils/helpers.ts
- [x] T013 [P] Create score validators in src/utils/validators.ts

### API Services

- [x] T014 Create Feishu API service structure in src/services/feishu/
- [x] T015 [P] Implement auth API in src/services/feishu/auth.ts
- [x] T016 [P] Implement bitable API in src/services/feishu/bitable.ts
- [x] T017 [P] Implement user API in src/services/feishu/user.ts
- [x] T018 [P] Create API index export in src/services/index.ts

### State Management

- [x] T019 Create auth store in src/stores/auth.ts (access_token memory, refresh_token localStorage)

### Common Components

- [x] T020 Create Button component in src/components/common/Button.tsx
- [x] T021 [P] Create Modal component in src/components/common/Modal.tsx
- [x] T022 [P] Create Loading component in src/components/common/Loading.tsx
- [x] T023 [P] Create Toast component in src/components/common/Toast.tsx

### Global Styles

- [x] T024 Create global styles in src/styles/index.css
- [x] T025 [P] Configure Tailwind directives and custom theme in tailwind.config.js

**Checkpoint**: Foundation ready - type definitions, API services, and common components available

---

## Phase 3: User Story 1 - 飞书授权登录 (Priority: P1) 🎯 MVP

**Goal**: 用户首次打开应用时能够跳转到飞书授权页面完成授权

**Independent Test**: 验证应用能正确解析授权码并获取用户信息

### Hooks

- [x] T026 [P] [US1] Create useAuth hook in src/hooks/useAuth.ts

### Pages

- [x] T027 [US1] Create AuthCallback page in src/pages/AuthCallback/index.tsx
- [x] T028 [US1] Create AuthCallback page styles in src/pages/AuthCallback/index.css

### Layout

- [x] T029 [US1] Create App layout wrapper in src/App.tsx

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> NOTE: Write these tests FIRST, ensure they FAIL before implementation

**CRITICAL**: No tests requested in spec, skip test tasks

### Implementation for User Story 1

- [x] T030 [US1] Implement authorization URL generator in src/services/feishu/auth.ts
- [x] T031 [US1] Implement token exchange and storage in useAuth hook
- [x] T032 [US1] Implement user info fetch in useAuth hook
- [x] T033 [US1] Implement token refresh logic in useAuth hook
- [x] T034 [US1] Build AuthCallback page with code parsing and token exchange
- [x] T035 [US1] Add routing for AuthCallback page in App.tsx

**Checkpoint**: User Story 1 complete - authorization flow works end-to-end

---

## Phase 4: User Story 2 - 任务列表展示 (Priority: P1)

**Goal**: 用户能够查看评议任务列表，了解待评议和已评议的对象

**Independent Test**: 任务列表正确展示所有评议任务，状态筛选功能正常

### Hooks

- [x] T036 [P] [US2] Create useTasks hook in src/hooks/useTasks.ts

### Components

- [x] T037 [US2] Create Header component in src/components/layout/Header.tsx
- [x] T038 [P] [US2] Create TaskItem component in src/components/task/TaskItem.tsx
- [x] T039 [P] [US2] Create TaskList component in src/components/task/TaskList.tsx

### Pages

- [x] T040 [US2] Create TaskList page in src/pages/TaskList/index.tsx
- [x] T041 [US2] Create TaskList page styles in src/pages/TaskList/index.css

### Tests for User Story 2 (OPTIONAL) ⚠️

**CRITICAL**: No tests requested in spec, skip test tasks

### Implementation for User Story 2

- [x] T042 [US2] Extend bitable API to support task list search in src/services/feishu/bitable.ts
- [x] T043 [US2] Implement useTasks hook with dual-table fetch and merge logic
- [x] T044 [US2] Build TaskItem component with subject info, status, and score display
- [x] T045 [US2] Build TaskList component to render merged task list
- [x] T046 [US2] Build TaskList page with loading states and empty handling
- [x] T047 [US2] Add routing for TaskList page in App.tsx

**Checkpoint**: User Story 2 complete - task list displays correctly with all fields

---

## Phase 5: User Story 3 - 发起评议 (Priority: P1)

**Goal**: 用户能够对待评议对象发起评议，填写评分项并提交

**Independent Test**: 完整流程测试 - 从点击发起评议到数据提交成功

### Hooks

- [x] T048 [P] [US3] Create useReview hook in src/hooks/useReview.ts

### Components

- [x] T049 [US3] Create ScoreInput component in src/components/review/ScoreInput.tsx
- [x] T050 [P] [US3] Create ReviewForm component in src/components/review/ReviewForm.tsx

### Pages

- [x] T051 [US3] Create ReviewForm page in src/pages/ReviewForm/index.tsx
- [x] T052 [US3] Create ReviewForm page styles in src/pages/ReviewForm/index.css

### Tests for User Story 3 (OPTIONAL) ⚠️

**CRITICAL**: No tests requested in spec, skip test tasks

### Implementation for User Story 3

- [x] T053 [US3] Extend bitable API to support score submission in src/services/feishu/bitable.ts
- [x] T054 [US3] Implement score validators for all 5 score items in src/utils/validators.ts
- [x] T055 [US3] Build ScoreInput component with range validation and descriptions
- [x] T056 [US3] Build ReviewForm component with submit/cancel functionality
- [x] T057 [US3] Add action buttons to TaskItem for initiating review
- [x] T058 [US3] Implement useReview hook for form state and submission
- [x] T059 [US3] Build ReviewForm page with modal-style presentation
- [x] T060 [US3] Add error handling and user feedback (Toast notifications)

**Checkpoint**: User Story 3 complete - users can submit new reviews successfully

---

## Phase 6: User Story 4 - 修改评议 (Priority: P1)

**Goal**: 用户能够修改已提交的评分，以便纠正错误或调整评分

**Independent Test**: 修改评议流程测试，验证数据回显和更新功能

### Implementation for User Story 4

- [x] T061 [US4] Extend bitable API to support score update in src/services/feishu/bitable.ts
- [x] T062 [US4] Modify useReview hook to load existing scores for editing
- [x] T063 [US4] Add "修改评议" button to TaskItem for completed tasks
- [x] T064 [US4] Pre-fill ReviewForm with existing scores when modifying
- [x] T065 [US4] Reuse ReviewForm component for both create and edit modes
- [x] T066 [US4] Add success feedback and list refresh after modification

**Checkpoint**: User Story 4 complete - users can modify existing reviews

---

## Phase 7: User Story 5 - 移动端适配 (Priority: P2)

**Goal**: 用户能够在移动设备上顺畅使用所有功能

**Independent Test**: 在不同屏幕尺寸设备上验证所有功能的可用性

### Implementation for User Story 5

- [x] T067 [US5] Verify TaskList layout responsive for mobile (<768px)
- [x] T068 [US5] Verify TaskList layout for tablet (768px-1023px)
- [x] T069 [US5] Verify TaskList layout for desktop (>=1024px)
- [x] T070 [US5] Verify ReviewForm modal responsive for mobile
- [x] T071 [US5] Verify ScoreInput touch targets sufficient for mobile
- [x] T072 [US5] Verify Header and navigation responsive
- [x] T073 [US5] Add responsive breakpoints in tailwind.config.js if needed
- [x] T074 [US5] Test all user flows on actual mobile device

**Checkpoint**: User Story 5 complete - all features work on mobile devices

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T075 [P] Run ESLint and fix all linting errors
- [x] T076 [P] Run TypeScript type check and fix all type errors
- [x] T077 [P] Add loading states for all async operations
- [x] T078 [P] Add error boundary for uncaught exceptions
- [x] T079 [P] Verify all Chinese text strings are present and accurate
- [x] T080 [P] Optimize bundle size for production build
- [x] T081 [P] Test build output locally with npm run preview
- [ ] T082 [P] Update README with deployment instructions
- [ ] T083 [P] Document API integration in quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (Authorization) - Must complete first, provides auth for all others
  - US2 (Task List) - Can start after US1
  - US3 (Create Review) - Can start after US2
  - US4 (Edit Review) - Can start after US3
  - US5 (Mobile) - Can start after US3-4, can run in parallel
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Within Each User Story

- Hooks before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- US1 must complete before other user stories can work
- US2 can start immediately after US1 completes
- US3 and US4 can start after US2 completes (can work in parallel if resources allow)
- US5 can start after US3-4 completes (focused on responsive design)
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch all components for US2 together:
Task: "Create Header component in src/components/layout/Header.tsx"
Task: "Create TaskItem component in src/components/task/TaskItem.tsx"
Task: "Create TaskList component in src/components/task/TaskList.tsx"

# Launch hooks for US2 together:
Task: "Create useTasks hook in src/hooks/useTasks.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Authorization)
4. **STOP and VALIDATE**: Test authorization flow independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 → Test authorization → Deploy/Demo
3. Add US2 → Test task list → Deploy/Demo
4. Add US3 → Test create review → Deploy/Demo
5. Add US4 → Test edit review → Deploy/Demo
6. Add US5 → Test mobile → Deploy/Demo
7. Polish phase → Final release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Authorization)
   - Developer B: US2 (Task List)
   - Developer C: US3 + US4 (Review Forms)
3. Stories complete and integrate independently

---

## Notes

- **[P] tasks** = different files, no dependencies
- **[Story] label** maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Summary

| Phase | Task Count | User Story | Description |
|-------|-----------|------------|-------------|
| 1 | 7 | - | Setup |
| 2 | 19 | - | Foundational |
| 3 | 10 | US1 | Authorization |
| 4 | 11 | US2 | Task List |
| 5 | 12 | US3 | Create Review |
| 6 | 6 | US4 | Edit Review |
| 7 | 8 | US5 | Mobile Responsive |
| 8 | 9 | - | Polish |
| **Total** | **82** | | |

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (US1) = 36 tasks

**Parallel Opportunities**: 42 tasks marked [P] can run in parallel where dependencies allow
