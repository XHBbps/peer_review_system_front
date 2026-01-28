// 全局类型定义

export interface User {
  user_id: string;
  name: string;
  avatar_url: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export type ReviewStatus = 'pending' | 'completed';

export interface ReviewTask {
  task_id: string;
  status: ReviewStatus;
  subject_type: string;
  subject_user_id: string;
  subject_name: string;
  subject_avatar_url: string;
  total_score: number | null;
}

export interface ScoreItem {
  key: string;
  field_name: string;
  item_name: string;
  max_score: number;
  min_score: number;
  description: string;
  score?: number | null;
}

export interface ReviewFormData {
  task_id: string;
  subject_user_id: string;
  scores: Record<string, number>;
  submitted_at: string;
}

// API 响应类型
export interface FeishuResponse<T> {
  code: number;
  msg: string;
  data: T;
}

export interface FeishuUserInfo {
  user_id: string;
  name: string;
  avatar_url: string;
}

export interface FeishuRecord {
  record_id: string;
  fields: Record<string, unknown>;
}

export interface FeishuTaskListResponse {
  has_more: boolean;
  items: FeishuRecord[];
  page_token: string;
  total: number;
}
