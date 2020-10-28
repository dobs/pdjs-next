import {request, CustomInit} from './common';

export type Action = 'trigger' | 'acknowledge' | 'resolve';

export type EventPromise = Promise<EventResponse>;

export interface EventResponse extends Response {
  data: any;
}

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

export interface EventParams extends CustomInit {
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
export interface ChangeParams extends CustomInit {
  data: ChangePayload;
}

export function event(params: EventParams): EventPromise {
  const {server = 'events.pagerduty.com', data, ...config} = params;

  return eventFetch(
    isEventsV1(params)
      ? `https://${server}/generic/2010-04-15/create_event.json`
      : `https://${server}/v2/enqueue`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      ...config,
    }
  );
}

export function change(params: ChangeParams): EventPromise {
  const {server = 'events.pagerduty.com', data, ...config} = params;

  return eventFetch(`https://${server}/v2/change/enqueue`, {
    method: 'POST',
    body: JSON.stringify(data),
    ...config,
  });
}

function isEventsV1(params: EventParams): boolean {
  return (params.data as EventPayloadV1).service_key !== undefined;
}

function isEventsV2(params: EventParams): boolean {
  return (params.data as EventPayloadV2).routing_key !== undefined;
}

const shorthand = (action: Action) => (
  params: EventParams
): EventPromise | Promise<any> => {
  let typeField;

  if (isEventsV1(params)) {
    typeField = 'event_type';
  } else if (isEventsV2(params)) {
    typeField = 'event_action';
  } else {
    return Promise.reject('Unrecognized event type.');
  }

  return event({
    ...params,
    data: {
      ...params.data,
      [typeField]: action,
    },
  });
};

export const trigger = shorthand('trigger');
export const acknowledge = shorthand('acknowledge');
export const resolve = shorthand('resolve');

async function eventFetch(url: string, options: CustomInit): EventPromise {
  const resp = (await request(url, options)) as EventResponse;
  resp.data = await resp.json();
  return resp;
}
