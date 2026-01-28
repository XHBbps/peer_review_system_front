// TaskList 组件

import { useState } from 'react';
import { ReviewTask } from '../../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: ReviewTask[];
  loading: boolean;
  error: string | null;
  onReview: (task: ReviewTask) => void;
}

type FilterStatus = 'all' | 'pending' | 'completed';

export default function TaskList({ tasks, loading, error, onReview }: TaskListProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');

  // 筛选任务
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // 统计
  const stats = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="mt-4 text-gray-500">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <svg className="h-12 w-12 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg className="h-16 w-16 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="mt-4 text-gray-500">暂无评议任务</p>
      </div>
    );
  }

  return (
    <div>
      {/* 筛选标签 */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {[
          { key: 'all', label: '全部', count: stats.all },
          { key: 'pending', label: '待评议', count: stats.pending },
          { key: 'completed', label: '已评议', count: stats.completed },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as FilterStatus)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === item.key
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <TaskItem key={task.task_id} task={task} onReview={onReview} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="py-8 text-center text-gray-500">
          没有符合条件的任务
        </div>
      )}
    </div>
  );
}
