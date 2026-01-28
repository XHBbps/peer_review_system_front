// 授权状态管理 Hook

import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../stores/auth.tsx';
import { User, AuthState } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { exchangeCodeForToken, refreshAccessToken } from '../services/feishu/auth';
import { getUserInfo } from '../services/feishu/user';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useAuthCallback() {
  const { refreshToken, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = sessionStorage.getItem('oauth_state');

      if (!code) {
        setError('授权回调缺少 code 参数');
        setLoading(false);
        return;
      }

      if (state !== storedState) {
        setError('CSRF 验证失败');
        setLoading(false);
        return;
      }

      try {
        const redirectUri = `${window.location.origin}/auth/callback`;
        const tokenResponse = await exchangeCodeForToken(code, redirectUri);
        const userInfo = await getUserInfo(tokenResponse.access_token);

        localStorage.setItem(STORAGE_KEYS.refresh_token, tokenResponse.refresh_token);

        updateUser({
          user_id: userInfo.user_id,
          name: userInfo.name,
          avatar_url: userInfo.avatar_url,
        });

        sessionStorage.removeItem('oauth_state');
        window.location.href = '/';
      } catch (err) {
        setError(err instanceof Error ? err.message : '授权失败');
      } finally {
        setLoading(false);
      }
    }

    handleCallback();
  }, [refreshToken, updateUser]);

  return { loading, error };
}

// 检查是否已授权的 hook
export function useIsAuthenticated() {
  const { isAuthenticated, refreshToken } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && refreshToken) {
      // 有 refresh_token 但没有 access_token，尝试刷新
      // 实际刷新逻辑在需要时调用
    }
  }, [isAuthenticated, refreshToken]);

  return isAuthenticated;
}
