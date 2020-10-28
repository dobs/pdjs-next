import { CustomInit } from './common';
export declare type Action = 'trigger' | 'acknowledge' | 'resolve';
export declare type EventPromise = Promise<EventResponse>;
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
export declare type Severity = 'critical' | 'error' | 'warning' | 'info';
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
export declare function event(params: EventParams): EventPromise;
export declare function change(params: ChangeParams): EventPromise;
export declare const trigger: (params: EventParams) => EventPromise | Promise<any>;
export declare const acknowledge: (params: EventParams) => EventPromise | Promise<any>;
export declare const resolve: (params: EventParams) => EventPromise | Promise<any>;
