// @ts-ignore
/* eslint-disable */
import request from '../utils/request'

/** getPointTransactionVOById GET /api/pointTransaction/get/vo */
export async function getPointTransactionVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPointTransactionVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePointTransactionVO_>('/api/pointTransaction/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listPointTransactionByPage POST /api/pointTransaction/list/page */
export async function listPointTransactionByPageUsingPost(
  body: API.PointTransactionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePointTransaction_>('/api/pointTransaction/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listPointTransactionVOByPage POST /api/pointTransaction/list/page/vo */
export async function listPointTransactionVoByPageUsingPost(
  body: API.PointTransactionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePointTransactionVO_>('/api/pointTransaction/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listMyPointTransactionVOByPage POST /api/pointTransaction/my/list/page/vo */
export async function listMyPointTransactionVoByPageUsingPost(
  body: API.PointTransactionQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePagePointTransactionVO_>('/api/pointTransaction/my/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** fetchPointsStatistics GET /api/pointTransaction/statistic */
export async function fetchPointsStatisticsUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponsePointsStatistic_>('/api/pointTransaction/statistic', {
    method: 'GET',
    ...(options || {}),
  })
}
