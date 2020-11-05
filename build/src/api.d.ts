import { RequestOptions } from './common';
export interface ShorthandCall {
    (res: string, params?: Partial<APIParams>): APIPromise;
}
export interface PartialCall {
    (params: APIParams): APIPromise;
    (params: Partial<APIParams>): PartialCall;
    get: ShorthandCall;
    post: ShorthandCall;
    put: ShorthandCall;
    patch: ShorthandCall;
    delete: ShorthandCall;
    all: (params: APIParams) => Promise<APIResponse[]>;
}
export declare type APIParams = RequestOptions & {
    res?: string;
    url?: string;
    data?: object;
    token?: string;
    server?: string;
    version?: number;
} & ({
    res: string;
} | {
    url: string;
});
export declare type APIPromise = Promise<APIResponse>;
export interface APIResponse extends Response {
    data: any;
    next?: () => APIPromise;
}
export declare function api(params: APIParams): APIPromise;
export declare function api(params: Partial<APIParams>): PartialCall;
export declare function all(params: APIParams): Promise<APIResponse[]>;
