// 授权状态管理 (使用 React Context)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { exchangeCodeForToken, refreshAccessToken } from '../services/feishu/auth';
import { getUserInfo } from '../services/feishu/user';

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  });

  // 初始化时检查 localStorage 中的 refresh_token
  useEffect(() => {
    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.refresh_token);
    const storedUserInfo = localStorage.getItem(STORAGE_KEYS.user_info);

    if (storedRefreshToken && storedUserInfo) {
      try {
        const user = JSON.parse(storedUserInfo);
        setState({
          isAuthenticated: true,
          user,
          accessToken: null, // access_token 不持久化
          refreshToken: storedRefreshToken,
          expiresAt: null,
        });
      } catch {
        // 用户信息解析失败，清除存储
        localStorage.removeItem(STORAGE_KEYS.refresh_token);
        localStorage.removeItem(STORAGE_KEYS.user_info);
      }
    }
  }, []);

  // 登录 - 跳转到授权页
  const login = useCallback(() => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const stateParam = Math.random().toString(36).substring(2);
    sessionStorage.setItem('oauth_state', stateParam);

    const authUrl = `https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=cli_a9f2a57b5338dcbb&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=contact:user.employee_id:readonly%20contact:user.base:readonly%20directory:employee.base.avatar:read%20offline_access&state=${stateParam}`;

    window.location.href = authUrl;
  }, []);

  // 登出
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.refresh_token);
    localStorage.removeItem(STORAGE_KEYS.user_info);
    setState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    });
  }, []);

  // 刷新 token
  const refreshToken = useCallback(async () => {
    if (!state.refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenResponse = await refreshAccessToken(state.refreshToken);

    setState((prev) => ({
      ...prev,
      accessToken: tokenResponse.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + tokenResponse.expires_in,
    }));

    return tokenResponse.access_token;
  }, [state.refreshToken]);

  // 更新用户信息
  const updateUser = useCallback((user: User) => {
    localStorage.setItem(STORAGE_KEYS.user_info, JSON.stringify(user));
    setState((prev) => ({ ...prev, user }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshToken, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 处理授权回调的 hook
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
        // 交换 code 获取 token
        const redirectUri = `${window.location.origin}/auth/callback`;
        const tokenResponse = await exchangeCodeForToken(code, redirectUri);

        // 获取用户信息
        const userInfo = await getUserInfo(tokenResponse.access_token);

        // 存储 refresh_token
        localStorage.setItem(STORAGE_KEYS.refresh_token, tokenResponse.refresh_token);

        // 更新状态
        updateUser({
          user_id: userInfo.user_id,
          name: userInfo.name,
          avatar_url: userInfo.avatar_url,
        });

        // 清除 state
        sessionStorage.removeItem('oauth_state');

        // 跳转到首页
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
