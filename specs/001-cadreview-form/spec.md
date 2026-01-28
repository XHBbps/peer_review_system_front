# Feature Specification: 干部述职评议表单

**Feature Branch**: `001-cadreview-form`
**Created**: 2026-01-28
**Status**: Draft
**Input**: 年终干部考核场景，需要现场评议人对待评议人依次打分。飞书现有表单不支持历史记录展示和修改，故需独立应用。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 飞书授权登录 (Priority: P1)

作为评议人，我首次打开应用时能够跳转到飞书授权页面完成授权，以便后续获取我的用户信息和评议任务。

**Why this priority**: 这是使用应用的前提条件，未经授权无法进行任何评议操作。

**Independent Test**: 通过模拟授权码重定向，验证应用能正确解析授权码并获取用户信息。

**Acceptance Scenarios**:

1. **Given** 用户首次访问应用，**When** 应用检测无有效授权，**Then** 自动跳转到飞书授权页面，URL 为 `https://accounts.feishu.cn/open-apis/authen/v1/authorize`，包含参数 client_id、response_type、redirect_uri、scope（包含 offline_access）、state
2. **Given** 用户在飞书授权页面完成授权，**When** 重定向回应用并携带授权码，**Then** 应用解析授权码并调用 `https://open.feishu.cn/open-apis/authen/v2/oauth/token` 获取 user_access_token
3. **Given** 获取到 user_access_token，**When** 调用飞书用户信息接口 `https://open.feishu.cn/open-apis/authen/v1/user_info`（Authorization: Bearer {token}），**Then** 正确获取并保存 user_id（data.user_id）、姓名（data.name）、头像（data.avatar_url）
4. **Given** user_access_token 即将过期，**When** 应用检测到过期时间临近，**Then** 自动使用 refresh_token 刷新获取新的 access_token

---

### User Story 2 - 任务列表展示 (Priority: P1)

作为已授权的评议人，我能够查看我的评议任务列表，了解待评议和已评议的对象，以便有序开展评议工作。

**Why this priority**: 任务列表是核心导航页面，用户需要快速定位需要评议的对象。

**Independent Test**: 验证任务列表正确展示所有评议任务，状态筛选功能正常工作。

**Acceptance Scenarios**:

1. **Given** 用户已完成授权，**When** 进入功能页面，**Then** 调用飞书多维表格接口获取两个评议记录表的数据
2. **Given** 用户已完成授权，**When** 进入功能页面，**Then** 保存每条记录的 record_id（用于后续提交评议，不在前端展示）
3. **Given** 用户已完成授权，**When** 进入功能页面，**Then** 显示该用户的任务列表
4. **Given** 任务列表包含多个评议对象，**When** 查看任务项，**Then** 正确显示评议状态、被评议主体类型（仅"生产保障"或"服务保障"）、姓名、头像、总分
5. **Given** `fields.总分.value[0] === 0`，**When** 查看任务项，**Then** 评议状态为"待评议"，总分显示为"-"
6. **Given** `fields.总分.value[0] !== 0`，**When** 查看任务项，**Then** 评议状态为"已评议"，总分显示为具体分数值
7. **Given** table_id 为 `tblScQ1wC10F9Gts`，**When** 查看任务项，**Then** 被评议主体类型为"生产保障"
8. **Given** table_id 为 `tbl0PbpUS5H3dhil`，**When** 查看任务项，**Then** 被评议主体类型为"服务保障"
9. **Given** 任务列表数据加载中，**When** 查看页面，**Then** 显示加载状态动画

---

### User Story 3 - 发起评议 (Priority: P1)

作为评议人，我能够对待评议对象发起评议，填写评分项并提交，以便完成年终考核评分。

**Why this priority**: 发起评议是应用的核心业务功能，必须稳定可靠。

**Independent Test**: 完整流程测试 - 从点击发起评议到数据提交成功。

**Acceptance Scenarios**:

1. **Given** 任务列表中某项状态为"待评议"，**When** 用户点击"发起评议"按钮，**Then** 弹出评议表单，预填被评议主体类型和被评议主体信息
2. **Given** 评议表单已打开，**When** 用户未填写任何评分项，**Then** 提交按钮禁用或点击后提示"评分项不能为空"
3. **Given** 评议表单填写中，**When** 某评分项超出允许范围，**Then** 实时提示错误并限制提交
4. **Given** 所有评分项填写完成且有效，**When** 点击"提交"按钮，**Then** 调用飞书接口推送数据，成功后刷新任务列表
5. **Given** 评议表单填写中，**When** 点击"取消"按钮，**Then** 关闭表单，不保存任何数据

---

### User Story 4 - 修改评议 (Priority: P1)

作为已提交评议的评议人，我能够修改已填写的评分，以便纠正错误或调整评分。

**Why this priority**: 评议数据可能需要修正，支持修改是必要的业务需求。

**Independent Test**: 修改评议流程测试，验证数据回显和更新功能。

**Acceptance Scenarios**:

1. **Given** 任务列表中某项状态为"已评议"，**When** 用户点击"修改评议"按钮，**Then** 弹出评议表单，带出该任务已有的评分数据
2. **Given** 修改表单已打开并显示已有数据，**When** 用户修改评分项，**Then** 数据变更正常反映在表单中
3. **Given** 修改完成并提交，**Then** 调用飞书接口更新数据，成功后刷新任务列表和表单数据

---

### User Story 5 - 移动端适配 (Priority: P2)

作为使用移动设备参与考核的评议人，我能够在手机上顺畅使用所有功能，确保在考核现场能够正常操作。

**Why this priority**: 考核现场可能使用移动设备，便捷的移动端体验提升工作效率。

**Independent Test**: 在不同屏幕尺寸设备上验证所有功能的可用性。

**Acceptance Scenarios**:

1. **Given** 用户在移动设备（<768px）上访问，**Then** 页面布局自适应，核心功能正常可用
2. **Given** 用户在平板设备（768px-1023px）上访问，**Then** 页面布局适配，显示内容完整
3. **Given** 用户在桌面设备（>=1024px）上访问，**Then** 页面布局优化，显示内容丰富
4. **Given** 评议表单在移动端打开，**Then** 表单不遮挡重要信息，操作区域足够大

---

### Edge Cases

- 授权码过期或无效时的处理流程
- 网络异常导致的数据获取/提交失败
- 飞书接口返回异常数据时的容错处理
- 并发评议提交时的数据一致性
- 任务列表为空时的空白状态展示
- 长时间停留在页面导致 token 过期
- 快速连续点击按钮导致的重复提交

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST 实现飞书授权码获取页面，应用启动时检测授权状态，无效则跳转授权页面。授权页面 URL 为 `https://accounts.feishu.cn/open-apis/authen/v1/authorize`，查询参数包括：
  - `client_id`: 应用 app_id，值为 `cli_a9f2a57b5338dcbb`
  - `response_type`: 固定值为 `code`
  - `redirect_uri`: 经过 URL 编码的重定向地址（即应用首页地址）
  - `scope`: 权限范围，多个权限用空格分隔，值为 `contact:user.employee_id:readonly contact:user.base:readonly directory:employee.base.avatar:read offline_access`
  - `state` (可选): 用于防止 CSRF 攻击的状态字符串，授权回调时会原样回传
- **FR-002**: System MUST 支持授权码解析，通过授权码换取 user_access_token。接口地址为 `https://open.feishu.cn/open-apis/authen/v2/oauth/token`。
  - 请求头: `Content-Type: application/json; charset=utf-8`
  - 请求体:
    - `grant_type`: 固定值 `authorization_code`
    - `client_id`: 应用 app_id，`cli_a9f2a57b5338dcbb`
    - `client_secret`: 应用密钥，`xy3hn1WUb1YQ72G5NrqrEhyfxFPLsuI1`
    - `code`: 授权回调获取的授权码
    - `redirect_uri`: 应用回调地址（与授权页面一致）
    - `scope`: 权限范围（与授权页面一致）
  - 响应体:
    - `code`: 0 表示成功
    - `access_token`: user_access_token，用于后续接口调用
    - `expires_in`: token 有效期（秒），需根据实际值确定过期时间
    - `refresh_token`: 用于刷新 access_token
    - `refresh_token_expires_in`: refresh_token 有效期（秒）
  - System MUST 处理 token 过期逻辑，支持使用 refresh_token 刷新。刷新 token 接口与获取 token 接口相同，地址为 `https://open.feishu.cn/open-apis/authen/v2/oauth/token`。
    - 请求体:
      - `grant_type`: 固定值 `refresh_token`
      - `client_id`: 应用 app_id，`cli_a9f2a57b5338dcbb`
      - `client_secret`: 应用密钥，`xy3hn1WUb1YQ72G5NrqrEhyfxFPLsuI1`
      - `refresh_token`: 获取 token 时返回的 refresh_token
    - 响应体: 与获取 token 接口相同，返回新的 access_token、expires_in、refresh_token 等
- **FR-003**: System MUST 通过 user_access_token 调用飞书接口获取用户信息（user_id、姓名、头像）。接口地址为 `https://open.feishu.cn/open-apis/authen/v1/user_info`。
  - 请求头:
    - `Authorization`: `Bearer {access_token}`
    - `Content-Type`: `application/json; charset=utf-8`
  - 响应体:
    - `code`: 0 表示成功
    - `data.name`: 用户姓名
    - `data.avatar_url`: 用户头像 URL
    - `data.user_id`: 用户 ID
- **FR-004**: System MUST 将用户信息和 token 安全存储。采用混合存储方案：
  - access_token: 内存存储（页面刷新需重新获取，降低泄露风险）
  - refresh_token: localStorage 存储（有效期 7 天，用于自动刷新 token）
  - 用户信息（user_id、name、avatar_url）: 内存存储
  - System MUST 支持自动使用 refresh_token 刷新 access_token
  - System MUST 在 refresh_token 过期时引导用户重新授权
- **FR-005**: System MUST 正确展示任务列表，包括：评议状态、被评议主体类型、被评议主体（姓名、user_id、头像）、评分项、总分。任务列表通过飞书多维表格查询记录接口获取：
  - 接口地址: `https://.cn/open-apisopen.feishu/bitable/v1/apps/:app_token/tables/:table_id/records/search`
  - app_token: `F8fVbiNk5anBFCsjeazcap1dnAg`
  - table_id: `tbl0PbpUS5H3dhil`（服务保障）、`tblScQ1wC10F9Gts`（生产保障）
  - 请求头: `Authorization: Bearer {access_token}`, `Content-Type: application/json; charset=utf-8`
  - 查询参数: `user_id_type=user_id`, `page_size=500`
  - 请求体 filter: 按"工号"字段筛选，值为当前用户 user_id 的数组
  - 响应处理:
    - `fields.总分.value[0] === 0` → 待评议
    - `fields.总分.value[0] !== 0` → 已评议
    - table_id 判断类型: `tblScQ1wC10F9Gts` → 生产保障，其他 → 服务保障
    - 被评议主体信息: 从 `fields.被评议主体[0]` 直接获取
      - `id`: user_id
      - `name`: 姓名
      - `avatar_url`: 头像
  - System MUST 合并两个表的任务列表，先展示服务保障表（tbl0PbpUS5H3dhil），后展示生产保障表（tblScQ1wC10F9Gts），各表内按飞书接口返回的 items 数组顺序排列
- **FR-006**: System MUST 实现"发起评议"功能，弹出表单并带出待评议主体信息
- **FR-007**: System MUST 实现"修改评议"功能，弹出表单并带出已有评分数据
- **FR-008**: System MUST 在表单提交前进行数据校验：评分项必填、评分范围校验
- **FR-009**: System MUST 调用飞书接口推送评议数据。接口地址为 `https://open.feishu.cn/open-apis/bitable/v1/apps/:app_token/tables/:table_id/records/:record_id`（PUT 方法）。
  - 请求头: `Authorization: Bearer {access_token}`, `Content-Type: application/json; charset=utf-8`
  - 路径参数:
    - `app_token`: `F8fVbiNk5anBFCsjeazcap1dnAg`
    - `table_id`: 根据被评议主体类型判断 - 生产保障用 `tblScQ1wC10F9Gts`，服务保障用 `tbl0PbpUS5H3dhil`
    - `record_id`: 任务列表的 `task_id`（即 record_id）
  - 查询参数: `user_id_type=user_id`
  - 请求体（提交时将前端英文 key 转换为飞书字段名）:
    ```json
    {
      "fields": {
        "上年度总结": <last_year_summary 的分数>,
        "工作亮点": <work_highlight 的分数>,
        "不足之处": <weakness 的分数>,
        "明年工作计划": <next_year_plan 的分数>,
        "述职报告合格性": <report_compliance 的分数>
      }
    }
    ```
  - 响应: `code === 0` 且 `msg === "success"` 表示成功
- **FR-010**: System MUST 适配移动端（<768px）、平板（768px-1023px）、桌面端（>=1024px）
- **FR-012**: System MUST 提供加载状态、错误提示等用户反馈

*待确认项：*
- **FR-013**: System MUST 通过飞书接口获取任务列表数据（已确认 - 被评议主体信息从响应直接获取）
- **FR-014**: System MUST 评议打分项的具体内容（已确认）
- ~~FR-015~~ ~~提交数据到飞书的具体接口和字段（已确认）~~
- ~~FR-016~~ ~~飞书授权页面 URL 和所需字段（已确认）~~
- ~~FR-017~~ ~~获取 user_access_token 的接口（已确认）~~
- ~~FR-018~~ ~~刷新 token 的接口（已确认）~~
- ~~FR-019~~ ~~获取用户信息的接口（已确认）~~
- ~~FR-020~~ ~~获取任务列表的接口（已确认）~~
- ~~FR-021~~ ~~评分项内容和评分标准（已确认）~~
- ~~FR-022~~ ~~提交评议数据的接口（已确认）~~
- ~~scope 已更新~~ ~~添加 offline_access（已确认）~~

### Key Entities

- **User**: 已授权的评议人
  - user_id: 飞书用户 ID
  - name: 用户姓名
  - avatar_url: 用户头像 URL
  - access_token: 用户访问令牌

- **ReviewTask**: 评议任务
  - task_id: 多维表格记录 ID（即 record_id，作为任务唯一标识）
  - status: 评议状态（pending/completed）
  - subject_type: 被评议主体类型（service_support/production_support）
  - subject_user_id: 被评议人 user_id
  - subject_name: 被评议人姓名
  - subject_avatar_url: 被评议人头像 URL
  - score_items: 评分项列表
  - total_score: 总分（未评议时为 null）

- **ScoreItem**: 评分项（前端英文 key 与飞书多维表格字段映射）
  - key: 前端使用的英文 key
  - field_name: 飞书多维表格字段名称（提交/读取数据时转换使用）
  - item_name: 评分项显示名称
  - max_score: 最高分值
  - min_score: 最低分值
  - description: 评分标准描述
  - score: 当前评分（未评分为 null）
  - 评分标准:
    | key | field_name | item_name | 分值范围 | 评分标准 |
    |-----|------------|-----------|----------|----------|
    | last_year_summary | 上年度总结 | 上年度总结 | 1-15分 | 11-15分: 工作成果符合期望；6-10分: 工作成果勉强符合期望；1-5分: 工作成果都达不到期望 |
    | work_highlight | 工作亮点 | 工作亮点 | 1-5分 | 1-5分: 工作成果超出预期程度 |
    | weakness | 不足之处 | 不足之处 | 1-10分 | 8-10分: 总结全面，分析研究比较客观；4-7分: 总结基本符合实际，分析基本客观；1-3分: 无不足之处总结或总结不全面，分析偏主观 |
    | next_year_plan | 明年工作计划 | 明年工作计划 | 1-15分 | 11-15分: 内容全面，目标明确，措施具体，安排合理；6-10分: 内容基本全面，有措施，目标不够明确；1-5分: 喊口号为主，内容不全面，措施不具体，可验证性不强 |
    | report_compliance | 述职报告合格性 | 述职报告合格性 | 1-5分 | 报告内容(3分): 包含上一年总结、不足之处、下一年计划各1分；汇报时长(2分): 6-8分钟得2分，低于6分钟或超过10分钟得1分，15分钟以上得0分 |
  - total_score: 总分（自动计算 = 各评分项之和，不可编辑）

- **ReviewFormData**: 评议表单数据
  - task_id: 关联任务 ID
  - subject_user_id: 被评议人 ID
  - scores: 评分项分值映射
  - submitted_at: 提交时间

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 用户能在 3 次点击内完成授权并进入功能页面
- **SC-002**: 任务列表加载时间不超过 2 秒
- **SC-003**: 评议表单提交成功率不低于 99%
- **SC-004**: 移动端所有功能可用，无布局错乱
- **SC-005**: 评分项校验准确，错误提示清晰
- **SC-006**: 数据提交后任务列表能在 1 秒内刷新

## Clarifications

### Session 2026-01-28

- Q: 数据存储方案选择 → A: 采用混合存储方案 - access_token 内存存储，refresh_token localStorage 存储
- Q: 是否需要本地持久化存储 → A: 不需要，所有数据从飞书接口实时获取
- Q: 是否需要评语/备注字段 → A: 不需要，保持表单简洁
- Q: 任务列表排序规则 → A: 先服务保障，后生产保障，各表内按飞书接口返回的 items 数组顺序排列

---

## 待与用户确认事项

### 飞书集成相关

1. ~~飞书授权页面 URL 和所需参数（已确认）~~
2. ~~获取 user_access_token 的接口地址和字段（已确认）~~
3. ~~获取用户信息（user_id、姓名、头像）的接口和返回字段（已确认）~~
4. ~~获取任务列表的接口地址、参数和返回数据格式（已确认 - 被评议主体信息从响应直接获取）~~
5. ~~提交评议数据的接口地址、请求字段和返回格式（已确认）~~

### 评分相关

1. ~~评分项的具体内容（有几项、每项的名称、分值范围）（已确认）~~
2. ~~评分标准描述（已确认）~~
3. ~~总分计算方式（求和，已确认）~~
4. ~~是否需要评语/备注字段（已确认 - 不需要，保持表单简洁）~~

### 待确认

1. ~~被评议主体详细信息的获取方式（已确认 - 从 fields.被评议主体[0] 直接获取）~~

### 数据存储相关

1. ~~评议数据是否需要本地持久化存储（已确认 - 不需要，所有数据从飞书接口实时获取）~~
2. 是否需要支持离线查看（已确认 - 不需要）
