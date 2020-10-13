"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.change = exports.event = exports.api = void 0;
const axios_1 = require("axios");
const VERSION = '0.0.1';
class PagerDuty {
    constructor(params) {
        this.params = params;
    }
    api(params) {
        const { token, ...rest } = this.params;
        return api({ token: token, ...rest, ...params });
    }
    event(params) {
        const { token, ...rest } = this.params;
        return event({ ...rest, ...params });
    }
}
exports.default = PagerDuty;
function api(params) {
    var _a, _b, _c;
    let { res, server = 'api.pagerduty.com', token, version, ...config } = params;
    config = {
        method: 'GET',
        url: config.url ? config.url : res,
        baseURL: config.url ? undefined : `https://${server}/`,
        ...config,
    };
    config.headers = {
        Accept: `application/vnd.pagerduty+json;version=${version !== null && version !== void 0 ? version : 2}`,
        Authorization: `Token token=${token}`,
        ...config.headers,
    };
    // Allow `data` for `params` for requests without bodies.
    if (!['PUT', 'POST', 'DELETE', 'PATCH'].includes((_b = (_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'GET')) {
        config.params = (_c = config.params) !== null && _c !== void 0 ? _c : config.data;
        delete config.data;
    }
    return request(config);
}
exports.api = api;
// async function api_all(params: APIParams) {
// }
function event(params) {
    const { server = 'events.pagerduty.com', ...config } = params;
    return request({
        method: 'POST',
        url: isEventsV1(config)
            ? `https://${server}/generic/2010-04-15/create_event.json`
            : `https://${server}/v2/enqueue`,
        ...config,
    });
}
exports.event = event;
function change(params) {
    const { server = 'events.pagerduty.com', ...config } = params;
    return request({
        method: 'POST',
        url: `https://${server}/v2/change/enqueue`,
        ...config,
    });
}
exports.change = change;
function request(config) {
    config = {
        timeout: 30000,
        ...config,
    };
    config.headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': typeof window === 'undefined'
            ? `pdjs-next/${VERSION} (${process.version}/${process.platform})`
            : undefined,
        ...config.headers,
    };
    return axios_1.default.request(config);
}
function isEventsV1(params) {
    return params.data.service_key !== undefined;
}
//# sourceMappingURL=index.js.map