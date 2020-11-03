import {request, CustomInit} from './common';

export interface ShorthandFunc {
  (res: string, params?: APIPartialParams): APIPromise;
}

export interface PartialCall {
  (params: APIParams): APIPromise;
  (params: APIPartialParams): PartialCall;
  get: ShorthandFunc;
  post: ShorthandFunc;
  put: ShorthandFunc;
  patch: ShorthandFunc;
  delete: ShorthandFunc;
  all: (params: APIParams) => any;
}

export interface APIPartialParams extends CustomInit {
  res?: string;
  url?: string;
  data?: object;
  token?: string;
  server?: string;
  version?: number;
}

export type APIParams = APIPartialParams & ({res: string} | {url: string});

export type APIPromise = Promise<APIResponse>;

export interface APIResponse extends Response {
  data: any;
  next?: () => APIPromise;
}

export function api(params: APIParams): APIPromise;
export function api(params: APIPartialParams): PartialCall;
export function api(params: APIPartialParams): APIPromise | PartialCall {
  // If the params don't include `res` or `url` treat it as a partial
  // application.
  if (!params.res && !params.url) {
    return partialCall(params);
  }

  const {
    res,
    server = 'api.pagerduty.com',
    token,
    url,
    version = 2,
    data,
    ...rest
  } = params as any;

  const config: CustomInit = {
    method: 'GET',
    ...rest,
    headers: {
      Accept: `application/vnd.pagerduty+json;version=${version}`,
      Authorization: `Token token=${token!}`,
      ...rest.headers,
    },
  };

  // Allow `data` for `params` for requests without bodies.
  if (isReadonlyRequest(config.method!)) {
    config.params = config.params ?? data;
  } else {
    config.body = JSON.stringify(data);
  }

  return apiRequest(
    url ?? `https://${server}/${res.replace(/^\/+/, '')}`,
    config
  );
}

export function all(params: APIParams): Promise<APIResponse[]> {
  return (api(params) as APIPromise).then(resp => allInner([resp]));
}

function allInner(resps: APIResponse[]): Promise<APIResponse[]> {
  const resp = resps[resps.length - 1];

  if (!resp.next) {
    return Promise.resolve(resps);
  }

  return resp.next().then(resp => allInner(resps.concat([resp])));
}

function apiRequest(url: string, options: CustomInit): APIPromise {
  return request(url, options).then(
    (resp: Response): APIPromise => {
      let apiResp = resp as APIResponse;

      return resp.json().then(
        (data): APIResponse => {
          apiResp.next = nextFunc(url, options, data);
          apiResp.data = data;
          return apiResp;
        }
      );
    }
  );
}

function isReadonlyRequest(method: string) {
  return !['PUT', 'POST', 'DELETE', 'PATCH'].includes(
    method.toUpperCase() ?? 'GET'
  );
}

// TODO: Support cursor-based pagination.
function nextFunc(url: string, options: CustomInit, data: any) {
  if (data?.more && typeof data.offset !== undefined && data.limit) {
    return () =>
      apiRequest(url, {
        ...options,
        params: {
          ...options.params,
          limit: data.limit,
          offset: data.limit + data.offset,
        },
      });
  }

  return undefined;
}

function partialCall(params: APIPartialParams) {
  const partialParams = params;
  const partial = ((params: APIPartialParams) =>
    api({...partialParams, ...params})) as PartialCall;

  const shorthand = (method: string) => (
    res: string,
    params?: APIPartialParams
  ): APIPromise =>
    api({res, method, ...partialParams, ...params}) as APIPromise;

  partial.get = shorthand('get');
  partial.post = shorthand('post');
  partial.put = shorthand('put');
  partial.patch = shorthand('patch');
  partial.delete = shorthand('delete');

  partial.all = (params: APIParams) => all(params);

  return partial;
}
