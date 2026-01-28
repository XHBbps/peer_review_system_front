// 飞书认证 API

import axios from 'axios';
import { API_ENDPOINTS, FEISHU_CONFIG } from '../../utils/constants';
import type { OAuthTokenResponse } from '../../types/feishu';

// 授权 URL 生成
export function getAuthorizationUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: FEISHU_CONFIG.app_id,
    response_type: 'code',
    redirect_uri: encodeURIComponent(redirectUri),
    scope: FEISHU_CONFIG.auth_scope,
    state,
  });

  return `${API_ENDPOINTS.authorize}?${params.toString()}`;
}

// 交换授权码获取 token
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<OAuthTokenResponse> {
  const response = await axios.post<{ code: number; msg: string; data: OAuthTokenResponse }>(
    API_ENDPOINTS.oauth_token,
    {
      grant_type: 'authorization_code',
      client_id: FEISHU_CONFIG.app_id,
      client_secret: FEISHU_CONFIG.app_secret,
      code,
      redirect_uri: redirectUri,
      scope: FEISHU_CONFIG.auth_scope,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );

  if (response.data.code !== 0) {
    throw new Error(`获取 token 失败: ${response.data.msg}`);
  }

  return response.data.data;
}

// 刷新 token
export async function refreshAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
  const response = await axios.post<{ code: number; msg: string; data: OAuthTokenResponse }>(
    API_ENDPOINTS.oauth_token,
    {
      grant_type: 'refresh_token',
      client_id: FEISHU_CONFIG.app_id,
      client_secret: FEISHU_CONFIG.app_secret,
      refresh_token: refreshToken,
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );

  if (response.data.code !== 0) {
    throw new Error(`刷新 token 失败: ${response.data.msg}`);
  }

  return response.data.data;
}
