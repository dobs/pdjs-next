import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';
import {isBrowser} from 'browser-or-node';

const VERSION = '0.0.1';

export interface CommonParams extends AxiosRequestConfig {
  server?: string;
}

// TODO Retry and error handling.
export function request(
  config: AxiosRequestConfig
): Promise<AxiosResponse<any>> {
  return axios.request({
    timeout: 30_000,
    ...config,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...userAgentHeader(),
      ...config.headers,
    },
  });
}

function userAgentHeader() {
  return isBrowser
    ? {}
    : {
        'User-Agent': `pdjs-next/${VERSION} (${process.version}/${process.platform})`,
      };
}
