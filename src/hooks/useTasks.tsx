// 任务列表 Hook

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getAllTaskRecords } from '../services/feishu/bitable';
import { ReviewTask } from '../types';
import { SCORE_FIELD_MAP } from '../types/review';

interface UseTasksReturn {
  tasks: ReviewTask[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useTasks(): UseTasksReturn {
  const { accessToken, user } = useAuth();
  const [tasks, setTasks] = useState<ReviewTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!accessToken) {
      setError('未授权');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allRecords = await getAllTaskRecords(accessToken, user?.user_id);
      const mergedTasks: ReviewTask[] = [];

      for (const [tableId, response] of Object.entries(allRecords)) {
        for (const record of response.items) {
          const fields = record.fields;
          const subject = (fields['被评议主体'] as Array<{ id: string; name: string; avatar_url: string }>)?.[0];

          // 计算总分
          let totalScore: number | null = null;
          const totalScoreField = fields['总分'];
          if (totalScoreField && typeof totalScoreField === 'object' && 'value' in totalScoreField) {
            const value = (totalScoreField as { value: number[] }).value;
            if (Array.isArray(value) && value.length > 0) {
              totalScore = value[0];
            }
          }

          // 检查是否已评议 (有评议人)
          const reviewer = fields['评议人'] as Array<{ id: string }> | undefined;
          const status = reviewer && reviewer.length > 0 ? 'completed' : 'pending';

          if (subject) {
            mergedTasks.push({
              task_id: record.record_id,
              status,
              subject_type: tableId,
              subject_user_id: subject.id,
              subject_name: subject.name,
              subject_avatar_url: subject.avatar_url || '',
              total_score: totalScore,
            });
          }
        }
      }

      setTasks(mergedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取任务列表失败');
    } finally {
      setLoading(false);
    }
  }, [accessToken, user?.user_id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refresh: fetchTasks };
}
