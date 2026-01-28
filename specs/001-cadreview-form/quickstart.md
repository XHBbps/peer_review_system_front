# Quickstart: 干部述职评议表单

## Prerequisites

- Node.js 18+
- npm 或 yarn
- 飞书应用 credentials (已配置)

## Installation

```bash
# 克隆项目
git clone <repo-url>
cd peer_review_system_front

# 安装依赖
npm install

# 或使用 pnpm
pnpm install
```

## Configuration

创建 `.env` 文件：

```env
# 飞书应用配置
VITE_FEISHU_APP_ID=cli_a9f2a57b5338dcbb
VITE_FEISHU_APP_SECRET=xy3hn1WUb1YQ72G5NrqrEhyfxFPLsuI1

# 飞书多维表格配置
VITE_FEISHU_APP_TOKEN=F8fVbiNk5anBFCsjeazcap1dnAg
VITE_FEISHU_TABLE_SERVICE_ID=tbl0PbpUS5H3dhil
VITE_FEISHU_TABLE_PRODUCTION_ID=tblScQ1wC10F9Gts

# 应用配置
VITE_APP_TITLE=干部述职评议
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
```

## Development

```bash
# 启动开发服务器
npm run dev

# 运行类型检查
npm run type-check

# 运行 ESLint
npm run lint

# 运行测试
npm run test
```

## Build

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## Project Structure

```
src/
├── components/     # React 组件
│   ├── common/     # 通用组件
│   ├── layout/     # 布局组件
│   ├── task/       # 任务列表组件
│   └── review/     # 评议表单组件
├── pages/          # 页面组件
│   ├── AuthCallback/
│   ├── TaskList/
│   └── ReviewForm/
├── services/       # API 服务
│   └── feishu/     # 飞书 API
├── hooks/          # 自定义 Hooks
├── stores/         # 状态管理
├── utils/          # 工具函数
├── types/          # 类型定义
├── styles/         # 样式文件
├── App.tsx         # 应用入口
└── main.tsx        # 渲染入口
```

## Key Flows

### 1. 授权流程

```
用户访问 → 检查 localStorage refresh_token
  ↓ 无 refresh_token
重定向到飞书授权页
  ↓ 用户授权
回调到 /auth/callback?code=xxx
  ↓
POST /authen/v2/oauth/token 获取 access_token
  ↓
GET /authen/v1/user_info 获取用户信息
  ↓
进入任务列表页面
```

### 2. 任务列表流程

```
进入任务列表页
  ↓
查询服务保障表 (tbl0PbpUS5H3dhil)
  ↓
查询生产保障表 (tblScQ1wC10F9Gts)
  ↓
合并结果，按表顺序排列
  ↓
渲染任务列表
```

### 3. 评议提交流程

```
用户点击"发起评议"
  ↓
弹出评议表单
  ↓
用户填写评分（5 项）
  ↓
前端校验：范围检查 + 必填检查
  ↓
点击提交
  ↓
PUT /bitable/v1/apps/{app_token}/tables/{table_id}/records/{record_id}
  ↓
成功：刷新任务列表
失败：显示错误提示
```

## Testing

```bash
# 单元测试
npm run test:unit

# 集成测试
npm run test:integration

# 测试覆盖率
npm run test:coverage
```

## Deployment

### 构建产物

```bash
npm run build
# 输出到 dist/ 目录
```

### 部署到飞书工作台

1. 构建产物上传到服务器
2. 配置飞书应用的重定向 URL
3. 在飞书管理后台添加应用入口

## Troubleshooting

### 授权失败

- 检查 `VITE_FEISHU_APP_ID` 和 `VITE_FEISHU_APP_SECRET` 是否正确
- 检查 `VITE_REDIRECT_URI` 是否与应用配置一致

### 任务列表为空

- 确认用户工号在飞书多维表格的"工号"字段中
- 检查用户是否有访问多维表格的权限

### 提交失败

- 检查网络连接
- 确认 token 未过期
- 查看浏览器控制台错误信息
