// 授权回调页面

import React from 'react';
import { useAuthCallback } from '../../hooks/useAuth.tsx';
import { FullScreenLoading } from '../../components/common/Loading';

export default function AuthCallback() {
  const { loading, error } = useAuthCallback();

  if (loading) {
    return <FullScreenLoading text="授权中，请稍候..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="h-16 w-16 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">授权失败</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <a
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            返回首页
          </a>
        </div>
      </div>
    );
  }

  return null;
}
