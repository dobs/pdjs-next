import {triggerAsyncId} from 'async_hooks';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

const VERSION = '0.0.1';

export interface CommonParams extends AxiosRequestConfig {
  server?: string;
}

export interface PagerDutyParams extends CommonParams {
  token?: string;
  server?: string;
}

export interface PagerDutyAPIParams extends CommonParams {
  data?: Object;
  res?: string;
  version?: number;
}

export interface APIParams extends PagerDutyAPIParams {
  token: string;
}

export type Action = 'trigger' | 'acknowledge' | 'resolve';

export interface EventPayloadV1 {
  service_key: string;
  incident_key: string;
  event_type?: Action;
  client?: string;
  client_url?: string;
  description?: string;
  details?: Object;
  contexts?: Object;
}

export type Severity = 'critical' | 'error' | 'warning' | 'info';

export interface Image {
  src: string;
  href?: string;
  alt?: string;
}

export interface Link {
  href: string;
  text?: string;
}

export interface EventPayloadV2 {
  routing_key: string;
  event_action: Action;
  dedup_key?: string;
  payload: {
    summary: string;
    source: string;
    severity: Severity;
    timestamp?: string;
    component?: string;
    group?: string;
    class?: string;
    custom_details?: Object;
  };
  images?: Array<Image>;
  links?: Array<Link>;
}

export interface EventParams extends CommonParams {
  data: EventPayloadV1 | EventPayloadV2;
}

export interface ChangePayload {
  routing_key: string;
  payload: {
    summary: string;
    source?: string;
    timestamp: string;
    custom_details: Object;
  };
  links: Array<Link>;
}
export interface ChangeParams extends CommonParams {
  data: ChangePayload;
}

export default class PagerDuty {
  constructor(public params: PagerDutyParams) {}

  api(params: PagerDutyAPIParams): Promise<AxiosResponse<any>> {
    const {token, ...rest} = this.params;
    return api({token: token!, ...rest, ...params});
  }

  event(params: EventParams): Promise<AxiosResponse<any>> {
    return event(params);
  }
}

export function api(params: APIParams): Promise<AxiosResponse<any>> {
  let {res, server = 'api.pagerduty.com', token, version, ...config} = params;

  config = {
    method: 'GET',
    url: config.url ? config.url : res,
    baseURL: config.url ? undefined : `https://${server}/`,
    ...config,
  };

  config.headers = {
    Accept: `application/vnd.pagerduty+json;version=${version ?? 2}`,
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

// async function api_all(params: APIParams) {
// }

export function event(params: EventParams): Promise<AxiosResponse<any>> {
  const {server = 'events.pagerduty.com', ...config} = params;

  return request({
    method: 'POST',
    url: isEventsV1(config)
      ? `https://${server}/generic/2010-04-15/create_event.json`
      : `https://${server}/v2/enqueue`,
    ...config,
  });
}

export function change(params: ChangeParams): Promise<AxiosResponse<any>> {
  const {server = 'events.pagerduty.com', ...config} = params;

  return request({
    method: 'POST',
    url: `https://${server}/v2/change/enqueue`,
    ...config,
  });
}

function request(config: AxiosRequestConfig): Promise<AxiosResponse<any>> {
  config = {
    timeout: 30_000,
    ...config,
  };

  config.headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent':
      typeof window === 'undefined'
        ? `pdjs-next/${VERSION} (${process.version}/${process.platform})`
        : undefined,
    ...config.headers,
  };

  return axios.request(config);
}

function isEventsV1(params: EventParams): boolean {
  return (params.data as EventPayloadV1).service_key !== undefined;
}
