// 评议表单页面

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useReview } from '../../hooks/useReview.tsx';
import ReviewForm from '../../components/review/ReviewForm';
import Button from '../../components/common/Button';
import { FullScreenLoading } from '../../components/common/Loading';
import { BITABLE_TABLES } from '../../utils/constants';

export default function ReviewFormPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get('tableId') || '';
  const { isAuthenticated, login } = useAuth();

  const {
    scores,
    setScore,
    submitReview,
    totalScore,
    isValid,
    errors,
    isSubmitting,
  } = useReview(taskId || '', tableId);

  // 获取表名
  const tableName = BITABLE_TABLES.find((t) => t.table_id === tableId)?.table_name || '';

  // 未授权时重定向到登录
  useEffect(() => {
    if (!isAuthenticated) {
      login();
    }
  }, [isAuthenticated, login]);

  if (!isAuthenticated) {
    return <FullScreenLoading text="检查授权状态..." />;
  }

  if (!taskId || !tableId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">参数错误</h2>
          <p className="mt-2 text-gray-600">缺少必要的任务参数</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    const success = await submitReview();
    if (success) {
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 返回按钮 */}
      <button
        onClick={handleCancel}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回列表
      </button>

      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">评议评分</h2>
        <p className="text-gray-600 mt-1">
          {tableName}
        </p>
      </div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      {/* 评分表单 */}
      <ReviewForm
        subjectName=""
        scores={scores}
        onScoreChange={setScore}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        isValid={isValid}
        errors={errors}
      />
    </div>
  );
}
