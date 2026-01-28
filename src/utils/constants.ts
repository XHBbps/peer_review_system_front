// 常量定义 (API URLs, table IDs, scope strings)

const FEISHU_ACCOUNTS_URL = import.meta.env.VITE_FEISHU_ACCOUNTS_URL || 'https://accounts.feishu.cn/open-apis';
const FEISHU_API_URL = import.meta.env.VITE_FEISHU_API_URL || 'https://open.feishu.cn/open-apis';

// 飞书应用配置
export const FEISHU_CONFIG = {
  app_id: import.meta.env.VITE_FEISHU_APP_ID || '',
  app_secret: import.meta.env.VITE_FEISHU_APP_SECRET || '',
  auth_scope: import.meta.env.VITE_FEISHU_AUTH_SCOPE || '',
  bitable_app_token: import.meta.env.VITE_FEISHU_BITABLE_APP_TOKEN || '',
};

// API 端点
export const API_ENDPOINTS = {
  // 授权相关
  authorize: `${FEISHU_ACCOUNTS_URL}/authen/v1/authorize`,
  oauth_token: `${FEISHU_API_URL}/authen/v2/oauth/token`,
  user_info: `${FEISHU_API_URL}/authen/v1/user_info`,

  // 多维表格相关
  bitable_record_search: (app_token: string, table_id: string) =>
    `${FEISHU_API_URL}/bitable/v1/apps/${app_token}/tables/${table_id}/records/search`,
  bitable_record_update: (app_token: string, table_id: string, record_id: string) =>
    `${FEISHU_API_URL}/bitable/v1/apps/${app_token}/tables/${table_id}/records/${record_id}`,
};

// 多维表格表配置
export const BITABLE_TABLES = (() => {
  const tablesStr = import.meta.env.VITE_FEISHU_BITABLE_TABLES || '';
  if (!tablesStr) return [];

  return tablesStr.split(',').map((table) => {
    const [table_id, table_name] = table.split(':');
    return { table_id: table_id.trim(), table_name: table_name.trim() };
  });
})();

// 本地存储 key
export const STORAGE_KEYS = {
  refresh_token: 'feishu_refresh_token',
  user_info: 'feishu_user_info',
};

// 评分项
export const SCORE_ITEMS = [
  {
    key: 'last_year_summary',
    field_name: '上年度总结',
    item_name: '上年度总结',
    max_score: 15,
    min_score: 1,
    description: '工作成果符合期望（11-15分）、基本符合（6-10分）、不符合（1-5分）',
  },
  {
    key: 'work_highlight',
    field_name: '工作亮点',
    item_name: '工作亮点',
    max_score: 5,
    min_score: 1,
    description: '工作成果超出预期程度（1-5分）',
  },
  {
    key: 'weakness',
    field_name: '不足之处',
    item_name: '不足之处',
    max_score: 10,
    min_score: 1,
    description: '总结全面，分析研究比较客观（8-10分）、基本客观（4-7分）、不客观（1-3分）',
  },
  {
    key: 'next_year_plan',
    field_name: '明年工作计划',
    item_name: '明年工作计划',
    max_score: 15,
    min_score: 1,
    description: '内容全面，目标明确，措施具体（11-15分）、基本明确（6-10分）、不明确（1-5分）',
  },
  {
    key: 'report_compliance',
    field_name: '述职报告合格性',
    item_name: '述职报告合格性',
    max_score: 5,
    min_score: 1,
    description: '报告内容（3分）+ 汇报时长（2分）',
  },
];
