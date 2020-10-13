import {request, CommonParams, APIPromise} from './common';

export interface ShorthandFunc {
  (res: string, params?: APIParams): any;
}

export interface Partial {
  (params: APIParams): any;
  get: ShorthandFunc;
  post: ShorthandFunc;
  put: ShorthandFunc;
  patch: ShorthandFunc;
  delete: ShorthandFunc;
}

export interface BaseParams extends CommonParams {
  token?: string;
  data?: object;
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

export function api(params: ResourceParams | URLParams): APIPromise;
export function api(params: BaseParams): Partial;
export function api(params: any): any {
  if (!params.res && !params.url) {
    const partialParams = params;
    const partial = ((params: APIParams) =>
      api({...partialParams, ...params})) as Partial;

    const shorthand = (method: string) => (res: string, params?: APIParams) =>
      api({res, method, ...partialParams, ...params});

    partial.get = shorthand('get');
    partial.post = shorthand('post');
    partial.put = shorthand('put');
    partial.patch = shorthand('patch');
    partial.delete = shorthand('delete');

    return partial;
  }

  let {
    res,
    server = 'api.pagerduty.com',
    token,
    version = 2,
    ...config
  } = params;

  config = {
    method: 'GET',
    url: config.url ? config.url : res,
    baseURL: config.url ? undefined : `https://${server}/`,
    ...config,
    headers: {
      Accept: `application/vnd.pagerduty+json;version=${version}`,
      Authorization: `Token token=${token!}`,
      ...config.headers,
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

  return request(config);
}
