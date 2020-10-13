import { AxiosRequestConfig, AxiosResponse } from 'axios';
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
export declare type Action = 'trigger' | 'acknowledge' | 'resolve';
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
    params: PagerDutyParams;
    constructor(params: PagerDutyParams);
    api(params: PagerDutyAPIParams): Promise<AxiosResponse<any>>;
    event(params: EventParams): Promise<AxiosResponse<any>>;
}
export declare function api(params: APIParams): Promise<AxiosResponse<any>>;
export declare function event(params: EventParams): Promise<AxiosResponse<any>>;
export declare function change(params: ChangeParams): Promise<AxiosResponse<any>>;
