import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

const VERSION = '0.0.1';

export type APIPromise = Promise<AxiosResponse<any>>

export interface CommonParams extends AxiosRequestConfig {
  server?: string;
}

// TODO Retry and error handling.
export function request(
  config: AxiosRequestConfig
): Promise<AxiosResponse<any>> {
  config = {
    timeout: 30_000,
    ...config,
  };

  config.headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'User-Agent':
      typeof window === 'undefined'
        ? `pdjs-next/${VERSION} (${process.version}/${process.platform})`
        : undefined,
    ...config.headers,
  };

  return axios.request(config);
}
