// 工具函数

/**
 * 生成随机字符串用于 state 参数 (CSRF 防护)
 */
export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * URL 编码
 */
export function encodeURIComponent(str: string): string {
  return encodeURIComponent(str);
}

/**
 * 获取当前时间戳 (毫秒)
 */
export function getCurrentTimestamp(): number {
  return Date.now();
}

/**
 * 检查 token 是否过期
 * @param expiresAt 过期时间戳 (秒)
 */
export function isTokenExpired(expiresAt: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now >= expiresAt;
}

/**
 * 从 URL 搜索参数获取值
 */
export function getUrlParam(key: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date): string {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 计算总分
 */
export function calculateTotalScore(scores: Record<string, number>): number {
  return Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);
}

/**
 * 从飞书用户数据提取信息
 */
export function extractUserFromFeishu(data: { user_id: string; name: string; avatar_url: string }) {
  return {
    user_id: data.user_id,
    name: data.name,
    avatar_url: data.avatar_url,
  };
}
