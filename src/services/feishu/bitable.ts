// 飞书多维表格 API

import axios from 'axios';
import { API_ENDPOINTS, FEISHU_CONFIG, BITABLE_TABLES } from '../../utils/constants';
import type {
  BitableSearchRequest,
  BitableSearchResponse,
  BitableUpdateRequest,
  BitableUpdateResponse,
} from '../../types/feishu';

// 获取所有多维表格配置
export function getBitableTables() {
  return BITABLE_TABLES;
}

// 搜索任务记录
export async function searchTaskRecords(
  accessToken: string,
  tableId: string,
  employeeId?: string
): Promise<BitableSearchResponse> {
  const requestBody: BitableSearchRequest = {
    page_size: 500,
  };

  // 如果提供了工号，添加过滤条件
  if (employeeId) {
    requestBody.filter = {
      conjunction: 'and',
      conditions: [
        {
          field_name: '工号',
          operator: 'is',
          value: [employeeId],
        },
      ],
    };
  }

  const response = await axios.post<{ code: number; msg: string; data: BitableSearchResponse }>(
    API_ENDPOINTS.bitable_record_search(FEISHU_CONFIG.bitable_app_token, tableId),
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      params: {
        user_id_type: 'user_id',
      },
    }
  );

  if (response.data.code !== 0) {
    throw new Error(`搜索任务记录失败: ${response.data.msg}`);
  }

  return response.data.data;
}

// 获取所有表的任务记录
export async function getAllTaskRecords(
  accessToken: string,
  employeeId?: string
): Promise<Record<string, BitableSearchResponse>> {
  const results: Record<string, BitableSearchResponse> = {};

  const tables = getBitableTables();

  for (const table of tables) {
    try {
      const response = await searchTaskRecords(accessToken, table.table_id, employeeId);
      results[table.table_id] = response;
    } catch (error) {
      console.error(`获取表 ${table.table_name} 数据失败:`, error);
    }
  }

  return results;
}

// 更新评分
export async function updateScore(
  accessToken: string,
  tableId: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<BitableUpdateResponse> {
  const requestBody: BitableUpdateRequest = { fields };

  const response = await axios.put<{ code: number; msg: string; data: BitableUpdateResponse }>(
    API_ENDPOINTS.bitable_record_update(FEISHU_CONFIG.bitable_app_token, tableId, recordId),
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      params: {
        user_id_type: 'user_id',
      },
    }
  );

  if (response.data.code !== 0) {
    throw new Error(`更新评分失败: ${response.data.msg}`);
  }

  return response.data.data;
}
