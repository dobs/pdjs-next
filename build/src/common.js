"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
/* NODE-ONLY-START */
const cross_fetch_1 = require("cross-fetch");
const browser_or_node_1 = require("browser-or-node");
/* NODE-ONLY-END */
const VERSION = '0.0.1';
// TODO: Retries.
// TODO: Backoff.
function request(url, options = {}) {
    const { params, timeout, ...rest } = options;
    url = new URL(url.toString());
    url = applyParams(url, params);
    options = applyTimeout(options, timeout);
    return cross_fetch_1.default(url.toString(), {
        ...rest,
        headers: new cross_fetch_1.Headers({
            'Content-Type': 'application/json; charset=utf-8',
            /* NODE-ONLY-START */
            ...userAgentHeader(),
            /* NODE-ONLY-END */
            ...rest.headers,
        }),
    });
}
exports.request = request;
function userAgentHeader() {
    if (browser_or_node_1.isBrowser)
        return {};
    return {
        'User-Agent': `pdjs-next/${VERSION} (${process.version}/${process.platform})`,
    };
}
function applyParams(url, params) {
    if (!params)
        return url;
    const combinedParams = url.searchParams;
    for (const key of Object.keys(params)) {
        combinedParams.append(key, params[key]);
    }
    url.search = combinedParams.toString();
    return url;
}
function applyTimeout(init, timeout) {
    if (!timeout)
        return init;
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return {
        ...init,
        signal: controller.signal,
    };
}
//# sourceMappingURL=common.js.map