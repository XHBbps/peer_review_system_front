// TaskItem 组件

import React from 'react';
import { ReviewTask } from '../../types';
import { BITABLE_TABLES } from '../../utils/constants';

interface TaskItemProps {
  task: ReviewTask;
  onReview: (task: ReviewTask) => void;
}

export default function TaskItem({ task, onReview }: TaskItemProps) {
  // 获取表名
  const tableName = BITABLE_TABLES.find((t) => t.table_id === task.subject_type)?.table_name || '';

  // 状态标签样式
  const statusBadge = task.status === 'completed' ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      已评议
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      待评议
    </span>
  );

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* 被评议人头像 */}
        <img
          src={task.subject_avatar_url || '/default-avatar.png'}
          alt={task.subject_name}
          className="w-12 h-12 rounded-full flex-shrink-0 bg-gray-200"
        />

        {/* 任务信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-900 truncate">
              {task.subject_name}
            </h3>
            {statusBadge}
          </div>

          <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
              {tableName}
            </span>
            {task.total_score !== null && task.total_score !== undefined && (
              <span className="font-medium text-primary-600">
                总分: {task.total_score}
              </span>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <button
          onClick={() => onReview(task)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            task.status === 'completed'
              ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {task.status === 'completed' ? '修改评议' : '发起评议'}
        </button>
      </div>
    </div>
  );
}
