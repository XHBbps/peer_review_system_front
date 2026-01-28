// 飞书用户 API

import axios from 'axios';
import { API_ENDPOINTS } from '../../utils/constants';
import type { UserInfoResponse } from '../../types/feishu';

// 获取用户信息
export async function getUserInfo(accessToken: string): Promise<UserInfoResponse> {
  const response = await axios.get<{ code: number; msg: string; data: UserInfoResponse }>(
    API_ENDPOINTS.user_info,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );

  if (response.data.code !== 0) {
    throw new Error(`获取用户信息失败: ${response.data.msg}`);
  }

  return response.data.data;
}
