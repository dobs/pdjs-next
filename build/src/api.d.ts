import { CustomInit } from './common';
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
export declare type APIParams = APIPartialParams & ({
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
export declare function api(params: APIPartialParams): PartialCall;
export declare function all(params: APIParams): Promise<APIResponse[]>;
