// 任务列表页面

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import TaskList from '../../components/task/TaskList';
import { ReviewTask } from '../../types';
import ReviewForm from '../../components/review/ReviewForm';
import Modal from '../../components/common/Modal';
import { BITABLE_TABLES } from '../../utils/constants';

export default function TaskListPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { tasks, loading, error, refresh } = useTasks();
  const [selectedTask, setSelectedTask] = useState<ReviewTask | null>(null);

  // 处理评议按钮点击
  const handleReview = (task: ReviewTask) => {
    navigate(`/review/${task.task_id}?tableId=${task.subject_type}`);
  };

  // 未授权时显示登录按钮
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <svg className="h-20 w-20 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">需要登录</h2>
          <p className="mt-2 text-gray-600">
            请使用飞书账号登录后查看评议任务
          </p>
          <button
            onClick={login}
            className="mt-6 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            飞书登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">评议任务</h2>
        <p className="text-gray-600 mt-1">
          共 {tasks.length} 个任务
        </p>
      </div>

      {/* 任务列表 */}
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onReview={handleReview}
      />

      {/* 刷新按钮 */}
      <div className="mt-6 text-center">
        <button
          onClick={() => refresh()}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          刷新列表
        </button>
      </div>

      {/* 表单弹窗 (移动端全屏显示) */}
      {selectedTask && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          title={selectedTask.subject_name}
          size="lg"
        >
          <ReviewForm
            subjectName={selectedTask.subject_name}
            scores={{}}
            onScoreChange={() => {}}
            onSubmit={async () => true}
            onCancel={() => setSelectedTask(null)}
            isSubmitting={false}
            isValid={false}
            errors={[]}
          />
        </Modal>
      )}
    </div>
  );
}
