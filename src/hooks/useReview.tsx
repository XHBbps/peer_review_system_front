// 评议表单 Hook

import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { updateScore } from '../services/feishu/bitable';
import { SCORE_FIELD_MAP } from '../types/review';
import { validateAllScores } from '../utils/validators';

interface UseReviewReturn {
  scores: Record<string, number>;
  setScore: (key: string, score: number) => void;
  submitReview: () => Promise<boolean>;
  totalScore: number;
  isValid: boolean;
  errors: string[];
  isSubmitting: boolean;
}

export function useReview(taskId: string, tableId: string, initialScores?: Record<string, number>): UseReviewReturn {
  const { accessToken } = useAuth();
  const [scores, setScores] = useState<Record<string, number>>(initialScores || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const setScore = useCallback((key: string, score: number) => {
    setScores((prev) => ({ ...prev, [key]: score }));
  }, []);

  const validation = validateAllScores(scores);
  const isValid = validation.isValid;
  const totalScore = Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);

  const submitReview = useCallback(async () => {
    if (!accessToken) {
      setErrors(['未授权']);
      return false;
    }

    const validation = validateAllScores(scores);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const fields: Record<string, unknown> = {};
      for (const [key, score] of Object.entries(scores)) {
        const fieldName = SCORE_FIELD_MAP[key];
        if (fieldName) {
          fields[fieldName] = score;
        }
      }

      await updateScore(accessToken, tableId, taskId, fields);
      return true;
    } catch (err) {
      setErrors([err instanceof Error ? err.message : '提交失败']);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [accessToken, taskId, tableId, scores]);

  return {
    scores,
    setScore,
    submitReview,
    totalScore,
    isValid,
    errors,
    isSubmitting,
  };
}
