// 飞书 API 类型定义

// OAuth 授权请求参数
export interface OAuthAuthorizeParams {
  client_id: string;
  response_type: 'code';
  redirect_uri: string;
  scope: string;
  state?: string;
}

// OAuth token 请求体
export interface OAuthTokenRequest {
  grant_type: 'authorization_code' | 'refresh_token';
  client_id: string;
  client_secret: string;
  code?: string;
  refresh_token?: string;
  redirect_uri?: string;
  scope?: string;
}

// OAuth token 响应
export interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: 'Bearer';
}

// 用户信息响应
export interface UserInfoResponse {
  name: string;
  avatar_url: string;
  user_id: string;
}

// 多维表格记录搜索请求
export interface BitableSearchRequest {
  filter?: {
    conjunction: 'and' | 'or';
    conditions: Array<{
      field_name: string;
      operator: 'is' | 'is_not' | 'contains' | 'does_not_contain';
      value: string[];
    }>;
  };
  page_size?: number;
  page_token?: string;
}

// 多维表格记录
export interface BitableRecord {
  record_id: string;
  fields: Record<string, unknown>;
}

// 多维表格搜索响应
export interface BitableSearchResponse {
  has_more: boolean;
  items: BitableRecord[];
  page_token: string;
  total: number;
}

// 多维表格更新请求
export interface BitableUpdateRequest {
  fields: Record<string, unknown>;
}

// 多维表格更新响应
export interface BitableUpdateResponse {
  record: BitableRecord;
}

// 多维表格配置
export interface BitableTableConfig {
  table_id: string;
  table_name: string;
}
