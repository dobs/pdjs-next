import { AxiosRequestConfig, AxiosResponse } from 'axios';
export interface CommonParams extends AxiosRequestConfig {
    server?: string;
}
export declare function request(config: AxiosRequestConfig): Promise<AxiosResponse<any>>;
