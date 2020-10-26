import {AxiosRequestConfig, AxiosResponse, Method} from 'axios';
import produce from 'immer';
import {request, CommonParams} from './common';

export interface ShorthandFunc {
  (res: string, params?: APIParams): APIPromise;
}

export interface Partial {
  (params: ResourceParams | URLParams): APIPromise;
  (params: BaseParams): Partial;
  (params: APIParams): APIPromise | Partial;
  get: ShorthandFunc;
  post: ShorthandFunc;
  put: ShorthandFunc;
  patch: ShorthandFunc;
  delete: ShorthandFunc;
  all: (params: ResourceParams | URLParams) => any;
}

export interface BaseParams extends CommonParams {
  token?: string;
  server?: string;
  version?: number;
}

export interface ResourceParams extends BaseParams {
  res: string;
}

export interface URLParams extends BaseParams {
  url: string;
}

export type APIParams = BaseParams | ResourceParams | URLParams;

export type APIPromise = Promise<APIResponse>;

export interface APIResponse extends AxiosResponse<any> {
  next?: () => APIPromise;
}

export function api(params: ResourceParams | URLParams): APIPromise;
export function api(params: BaseParams): Partial;
export function api(params: any): APIPromise | Partial {
  // If the params don't include `res` or `url` treat it as a partial
  // application.
  if (!params.res && !params.url) {
    const partialParams = params;
    const partial = ((params: APIParams) =>
      api({...partialParams, ...params})) as Partial;

    const shorthand = (method: Method) => (res: string, params?: APIParams) =>
      api({res, method, ...partialParams, ...params});

    partial.get = shorthand('get');
    partial.post = shorthand('post');
    partial.put = shorthand('put');
    partial.patch = shorthand('patch');
    partial.delete = shorthand('delete');

    partial.all = (params: ResourceParams | URLParams) => all(params);

    return partial;
  }

  const {
    res,
    server = 'api.pagerduty.com',
    token,
    version = 2,
    ...rest
  } = params;

  const config = {
    method: 'GET',
    url: rest.url ? rest.url : res,
    baseURL: rest.url ? undefined : `https://${server}/`,
    ...rest,
    headers: {
      Accept: `application/vnd.pagerduty+json;version=${version}`,
      Authorization: `Token token=${token!}`,
      ...rest.headers,
    },
  };

  // Allow `data` for `params` for requests without bodies.
  if (
    !['PUT', 'POST', 'DELETE', 'PATCH'].includes(
      config.method?.toUpperCase() ?? 'GET'
    )
  ) {
    config.params = config.params ?? config.data;
    delete config.data;
  }

  return apiRequest(config);
}

export async function all(
  params: ResourceParams | URLParams
): Promise<APIResponse[]> {
  let resp: APIResponse = await api(params);

  const resps = [await resp];

  while (resp.next) {
    resp = await resp.next();
    resps.push(resp);
  }

  return resps;
}

async function apiRequest(config: AxiosRequestConfig): APIPromise {
  const resp = (await request(config)) as APIResponse;
  const data = resp.data;

  if (data?.more && typeof data.offset !== undefined && data.limit) {
    // TODO: Support cursor-based pagination.
    const nextConfig = produce(config, draft => {
      draft.params.limit = data.limit;
      draft.params.offset = data.limit + data.offset;
    });

    resp.next = () => apiRequest(nextConfig);
  }

  return resp;
}
