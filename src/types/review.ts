// 评议业务类型定义

// 评分项配置
export const SCORE_ITEMS: ScoreItemConfig[] = [
  {
    key: 'last_year_summary',
    field_name: '上年度总结',
    item_name: '上年度总结',
    max_score: 15,
    min_score: 1,
    description: '工作成果符合期望（11-15分）、基本符合（6-10分）、不符合（1-5分）',
  },
  {
    key: 'work_highlight',
    field_name: '工作亮点',
    item_name: '工作亮点',
    max_score: 5,
    min_score: 1,
    description: '工作成果超出预期程度（1-5分）',
  },
  {
    key: 'weakness',
    field_name: '不足之处',
    item_name: '不足之处',
    max_score: 10,
    min_score: 1,
    description: '总结全面，分析研究比较客观（8-10分）、基本客观（4-7分）、不客观（1-3分）',
  },
  {
    key: 'next_year_plan',
    field_name: '明年工作计划',
    item_name: '明年工作计划',
    max_score: 15,
    min_score: 1,
    description: '内容全面，目标明确，措施具体（11-15分）、基本明确（6-10分）、不明确（1-5分）',
  },
  {
    key: 'report_compliance',
    field_name: '述职报告合格性',
    item_name: '述职报告合格性',
    max_score: 5,
    min_score: 1,
    description: '报告内容（3分）+ 汇报时长（2分）',
  },
];

export interface ScoreItemConfig {
  key: string;
  field_name: string;
  item_name: string;
  max_score: number;
  min_score: number;
  description: string;
}

// 字段映射：前端 key -> 飞书字段名
export const SCORE_FIELD_MAP: Record<string, string> = {
  last_year_summary: '上年度总结',
  work_highlight: '工作亮点',
  weakness: '不足之处',
  next_year_plan: '明年工作计划',
  report_compliance: '述职报告合格性',
};

// 被评议主体类型
export const SUBJECT_TYPES = {
  service_support: '服务保障',
  production_support: '生产保障',
} as const;

export type SubjectType = keyof typeof SUBJECT_TYPES;
