import {AxiosResponse} from 'axios';
import produce from 'immer';
import {request, CommonParams} from './common';

export type Action = 'trigger' | 'acknowledge' | 'resolve';

export type EventPromise = Promise<AxiosResponse<any>>;

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

export function event(params: EventParams): EventPromise {
  const {server = 'events.pagerduty.com', ...config} = params;

  return request({
    method: 'POST',
    url: isEventsV1(config)
      ? `https://${server}/generic/2010-04-15/create_event.json`
      : `https://${server}/v2/enqueue`,
    ...config,
  });
}

export function change(params: ChangeParams): EventPromise {
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

const shorthand = (action: Action) => (params: EventParams): EventPromise =>
  event(
    produce(params, draft => {
      if ('event_type' in draft.data) {
        draft.data.event_type = action;
      } else if ('event_action' in draft.data) {
        draft.data.event_action = action;
      }
    })
  );

export const trigger = shorthand('trigger');
export const acknowledge = shorthand('acknowledge');
export const resolve = shorthand('resolve');
