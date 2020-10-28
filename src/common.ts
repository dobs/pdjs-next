/* NODE-ONLY-START */
import fetch, {Headers} from 'cross-fetch';
/* NODE-ONLY-END */
import {isBrowser} from 'browser-or-node';

const VERSION = '0.0.1';

export interface CustomInit extends RequestInit {
  params?: Record<string, string>;
  server?: string;
  timeout?: number;
}

// TODO: Retries.
// TODO: Backoff.
export function request(
  url: string | URL,
  init: CustomInit = {}
): Promise<Response> {
  const {params, timeout, ...initRest} = init;

  url = new URL(url.toString());

  url = applyParams(url, params);
  init = applyTimeout(init, timeout);

  return fetch(url.toString(), {
    ...initRest,
    headers: new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      ...userAgentHeader(),
      ...initRest.headers,
    }),
  });
}

function userAgentHeader(): object {
  if (isBrowser) return {};

  return {
    'User-Agent': `pdjs-next/${VERSION} (${process.version}/${process.platform})`,
  };
}

function applyParams(url: URL, params?: Record<string, string>): URL {
  if (!params) return url;

  const combinedParams = url.searchParams;

  for (const key of Object.keys(params)) {
    combinedParams.append(key, params[key]);
  }

  url.search = combinedParams.toString();
  return url;
}

function applyTimeout(init: CustomInit, timeout?: number): CustomInit {
  if (!timeout) return init;

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);

  return {
    ...init,
    signal: controller.signal,
  };
}
