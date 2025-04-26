// @ts-ignore
/* eslint-disable */
import request from '../utils/request'

/** sign POST /api/sign/${param0} */
export async function signUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.signUsingPOSTParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params
  return request<API.BaseResponseBoolean_>(`/api/sign/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** getMonthSignInfo GET /api/sign/month/${param0} */
export async function getMonthSignInfoUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMonthSignInfoUsingGETParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params
  return request<API.BaseResponseSignInfoVO_>(`/api/sign/month/${param0}`, {
    method: 'GET',
    params: {
      ...queryParams,
    },
    ...(options || {}),
  })
}

/** getUserPoints GET /api/sign/points/${param0} */
export async function getUserPointsUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserPointsUsingGETParams,
  options?: { [key: string]: any }
) {
  const { userId: param0, ...queryParams } = params
  return request<API.BaseResponseInt_>(`/api/sign/points/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}
