// ReviewForm 组件

import { useState } from 'react';
import { SCORE_ITEMS } from '../../types/review';
import ScoreInput from './ScoreInput';
import Button from '../common/Button';

interface ReviewFormProps {
  subjectName: string;
  scores: Record<string, number>;
  onScoreChange: (key: string, score: number) => void;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  errors: string[];
}

export default function ReviewForm({
  subjectName,
  scores,
  onScoreChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isValid,
  errors,
}: ReviewFormProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  // 计算总分
  const totalScore = Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);

  // 已填写的评分项数量
  const completedCount = Object.values(scores).filter((s) => typeof s === 'number').length;

  const handleSubmit = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    const success = await onSubmit();
    if (success) {
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 头部 */}
      <div className="bg-primary-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">评议评分</h2>
        <p className="text-primary-100 text-sm mt-1">被评议人: {subjectName}</p>
      </div>

      {/* 错误提示 */}
      {errors.length > 0 && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      {/* 评分项 */}
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        {SCORE_ITEMS.map((item) => (
          <ScoreInput
            key={item.key}
            item={item}
            value={scores[item.key]}
            onChange={(score) => onScoreChange(item.key, score)}
            disabled={isSubmitting}
          />
        ))}
      </div>

      {/* 底部 */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        {/* 总分 */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600">评分进度</p>
            <p className="text-sm text-gray-500">
              已填写 {completedCount}/{SCORE_ITEMS.length} 项
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">总分</p>
            <p className="text-2xl font-bold text-primary-600">{totalScore}</p>
          </div>
        </div>

        {/* 确认提示 */}
        {showConfirm && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              确认提交评分？提交后将无法修改。
            </p>
          </div>
        )}

        {/* 按钮组 */}
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!isValid && !showConfirm}
            className="flex-1"
          >
            {showConfirm ? '确认提交' : '提交评分'}
          </Button>
        </div>
      </div>
    </div>
  );
}
