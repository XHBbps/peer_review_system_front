// 校验函数

import { SCORE_ITEMS } from './constants';
import { ScoreItemConfig } from '../types/review';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateScore(key: string, score: number): ValidationResult {
  const errors: string[] = [];
  const item = SCORE_ITEMS.find((i) => i.key === key);

  if (!item) {
    errors.push(`未知的评分项: ${key}`);
    return { isValid: false, errors };
  }

  if (typeof score !== 'number' || Number.isNaN(score)) {
    errors.push(`${item.field_name}必须是一个有效的数字`);
    return { isValid: false, errors };
  }

  if (score < item.min_score) {
    errors.push(`${item.field_name}不能小于${item.min_score}分`);
  }

  if (score > item.max_score) {
    errors.push(`${item.field_name}不能大于${item.max_score}分`);
  }

  return { isValid: errors.length === 0, errors };
}

export function validateAllScores(scores: Record<string, number>): ValidationResult {
  const errors: string[] = [];

  for (const item of SCORE_ITEMS) {
    const score = scores[item.key];
    if (typeof score === 'number') {
      const result = validateScore(item.key, score);
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function validateEmployeeId(employeeId: string): ValidationResult {
  const errors: string[] = [];

  if (!employeeId || employeeId.trim() === '') {
    errors.push('工号不能为空');
  } else if (!/^\d+$/.test(employeeId)) {
    errors.push('工号必须为数字');
  }

  return { isValid: errors.length === 0, errors };
}

export function validateAuthCallback(): ValidationResult {
  const errors: string[] = [];
  const code = new URLSearchParams(window.location.search).get('code');

  if (!code) {
    errors.push('授权回调缺少 code 参数');
  }

  return { isValid: errors.length === 0, errors };
}

export function getScoreItemConfig(key: string): ScoreItemConfig | undefined {
  return SCORE_ITEMS.find((item) => item.key === key);
}
