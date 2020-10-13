import {request, CommonParams, APIPromise} from './common';

export type Action = 'trigger' | 'acknowledge' | 'resolve';

export interface EventPayloadV1 {
  service_key: string;
  incident_key: string;
  event_type?: Action;
  client?: string;
  client_url?: string;
  description?: string;
  details?: object;
  contexts?: object;
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
    custom_details?: object;
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
    custom_details: object;
  };
  links: Array<Link>;
}
export interface ChangeParams extends CommonParams {
  data: ChangePayload;
}

// async function api_all(params: APIParams) {
// }

export function event(params: EventParams): APIPromise {
  const {server = 'events.pagerduty.com', ...config} = params;

  return request({
    method: 'POST',
    url: isEventsV1(config)
      ? `https://${server}/generic/2010-04-15/create_event.json`
      : `https://${server}/v2/enqueue`,
    ...config,
  });
}

export function change(params: ChangeParams): APIPromise {
  const {server = 'events.pagerduty.com', ...config} = params;

  return request({
    method: 'POST',
    url: `https://${server}/v2/change/enqueue`,
    ...config,
  });
}

function isEventsV1(params: EventParams): boolean {
  return (params.data as EventPayloadV1).service_key !== undefined;
}
