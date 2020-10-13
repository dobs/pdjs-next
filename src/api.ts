import {request, CommonParams, APIPromise} from './common';

export interface APIParams extends CommonParams {
  token: string;
  data?: object;
  res?: string;
  server?: string;
  version?: number;
}

export function api(params: APIParams): APIPromise {
  let {res, server = 'api.pagerduty.com', token, version = 2, ...config} = params;

  config = {
    method: 'GET',
    url: config.url ? config.url : res,
    baseURL: config.url ? undefined : `https://${server}/`,
    ...config,
  };

  config.headers = {
    Accept: `application/vnd.pagerduty+json;version=${version}`,
    Authorization: `Token token=${token}`,
    ...config.headers,
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
