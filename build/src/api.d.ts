import { AxiosResponse } from 'axios';
import { CommonParams } from './common';
export interface ShorthandFunc {
    (res: string, params?: APIParams): APIPromise;
}
export interface Partial {
    (params: ResourceParams | URLParams): APIPromise;
    (params: BaseParams): Partial;
    (params: APIParams): APIPromise | Partial;
    get: ShorthandFunc;
    post: ShorthandFunc;
    put: ShorthandFunc;
    patch: ShorthandFunc;
    delete: ShorthandFunc;
    all: (params: ResourceParams | URLParams) => any;
}
export interface BaseParams extends CommonParams {
    token?: string;
    server?: string;
    version?: number;
}
export interface ResourceParams extends BaseParams {
    res: string;
}
export interface URLParams extends BaseParams {
    url: string;
}
export declare type APIParams = BaseParams | ResourceParams | URLParams;
export declare type APIPromise = Promise<APIResponse>;
export interface APIResponse extends AxiosResponse<any> {
    next?: () => APIPromise;
}
export declare function api(params: ResourceParams | URLParams): APIPromise;
export declare function api(params: BaseParams): Partial;
export declare function all(params: ResourceParams | URLParams): Promise<APIResponse[]>;
