import { CommonParams, APIPromise } from './common';
export interface ShorthandFunc {
    (res: string, params?: APIParams): any;
}
export interface Partial {
    (params: APIParams): any;
    get: ShorthandFunc;
    post: ShorthandFunc;
    put: ShorthandFunc;
    patch: ShorthandFunc;
    delete: ShorthandFunc;
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
export declare function api(params: ResourceParams | URLParams): APIPromise;
export declare function api(params: BaseParams): Partial;
