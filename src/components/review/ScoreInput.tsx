// ScoreInput 组件

import { ScoreItemConfig } from '../../types/review';

interface ScoreInputProps {
  item: ScoreItemConfig;
  value: number | null | undefined;
  onChange: (score: number) => void;
  disabled?: boolean;
}

export default function ScoreInput({ item, value, onChange, disabled }: ScoreInputProps) {
  // 生成评分选项
  const scoreOptions = Array.from(
    { length: item.max_score - item.min_score + 1 },
    (_, i) => item.min_score + i
  );

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-900">
          {item.item_name}
        </label>
        <span className="text-sm text-gray-500">
          {item.min_score} - {item.max_score} 分
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{item.description}</p>

      {/* 评分按钮 */}
      <div className="flex flex-wrap gap-2">
        {scoreOptions.map((score) => (
          <button
            key={score}
            onClick={() => onChange(score)}
            disabled={disabled}
            className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
              value === score
                ? 'bg-primary-600 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {score}
          </button>
        ))}
      </div>

      {/* 当前分数显示 */}
      {value !== null && value !== undefined && (
        <div className="mt-3 text-right">
          <span className="text-sm font-medium text-primary-600">
            当前分数: {value} 分
          </span>
        </div>
      )}
    </div>
  );
}
