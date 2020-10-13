import { AxiosRequestConfig, AxiosResponse } from 'axios';
export declare type APIPromise = Promise<AxiosResponse<any>>;
export interface CommonParams extends AxiosRequestConfig {
    server?: string;
}
export declare function request(config: AxiosRequestConfig): Promise<AxiosResponse<any>>;
