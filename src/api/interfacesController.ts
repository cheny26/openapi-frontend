// @ts-ignore
/* eslint-disable */
import request from '../utils/request'

/** addInterfaces POST /api/interfaces/add */
export async function addInterfacesUsingPost(
  body: API.InterfacesAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/interfaces/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteInterfaces POST /api/interfaces/delete */
export async function deleteInterfacesUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/interfaces/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editInterfaces POST /api/interfaces/edit */
export async function editInterfacesUsingPost(
  body: API.InterfacesEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/interfaces/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getInterfacesVOById GET /api/interfaces/get */
export async function getInterfacesVoByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInterfacesVOByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseInterfacesVO_>('/api/interfaces/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** invokeInterfacesById POST /api/interfaces/invokeById */
export async function invokeInterfacesByIdUsingPost(
  body: API.InterfacesInvokeRequest,
  options?: { [key: string]: any }
) {
  return request<Record<string, any>>('/api/interfaces/invokeById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** invokeInterfacesByURL POST /api/interfaces/invokeByURL */
export async function invokeInterfacesByUrlUsingPost(
  body: API.InterfacesInvokeRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseObject_>('/api/interfaces/invokeByURL', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listInterfacesByPage GET /api/interfaces/list/page */
export async function listInterfacesByPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listInterfacesByPageUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterfacesVO_>('/api/interfaces/list/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listInterfacesVOByPage GET /api/interfaces/list/page/vo */
export async function listInterfacesVoByPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listInterfacesVOByPageUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterfacesVO_>('/api/interfaces/list/page/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** listMyInterfacesVOByPage GET /api/interfaces/my/list/page/vo */
export async function listMyInterfacesVoByPageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMyInterfacesVOByPageUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageInterfacesVO_>('/api/interfaces/my/list/page/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** offlineInterfaces POST /api/interfaces/offline */
export async function offlineInterfacesUsingPost(
  body: API.IdRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/interfaces/offline', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** onlineInterfaces POST /api/interfaces/online */
export async function onlineInterfacesUsingPost(
  body: API.IdRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/interfaces/online', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateInterfaces POST /api/interfaces/update */
export async function updateInterfacesUsingPost(
  body: API.InterfacesUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/interfaces/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
