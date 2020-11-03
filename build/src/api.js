"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = exports.api = void 0;
const common_1 = require("./common");
function api(params) {
    var _a;
    // If the params don't include `res` or `url` treat it as a partial
    // application.
    if (!params.res && !params.url) {
        return partialCall(params);
    }
    const { res, server = 'api.pagerduty.com', token, url, version = 2, data, ...rest } = params;
    const config = {
        method: 'GET',
        ...rest,
        headers: {
            Accept: `application/vnd.pagerduty+json;version=${version}`,
            Authorization: `Token token=${token}`,
            ...rest.headers,
        },
    };
    // Allow `data` for `params` for requests without bodies.
    if (isReadonlyRequest(config.method)) {
        config.params = (_a = config.params) !== null && _a !== void 0 ? _a : data;
    }
    else {
        config.body = JSON.stringify(data);
    }
    return apiRequest(url !== null && url !== void 0 ? url : `https://${server}/${res.replace(/^\/+/, '')}`, config);
}
exports.api = api;
function all(params) {
    return api(params).then(resp => allInner([resp]));
}
exports.all = all;
function allInner(resps) {
    const resp = resps[resps.length - 1];
    if (!resp.next) {
        return Promise.resolve(resps);
    }
    return resp.next().then(resp => allInner(resps.concat([resp])));
}
function apiRequest(url, options) {
    return common_1.request(url, options).then((resp) => {
        let apiResp = resp;
        return resp.json().then((data) => {
            apiResp.next = nextFunc(url, options, data);
            apiResp.data = data;
            return apiResp;
        });
    });
}
function isReadonlyRequest(method) {
    var _a;
    return !['PUT', 'POST', 'DELETE', 'PATCH'].includes((_a = method.toUpperCase()) !== null && _a !== void 0 ? _a : 'GET');
}
// TODO: Support cursor-based pagination.
function nextFunc(url, options, data) {
    if ((data === null || data === void 0 ? void 0 : data.more) && typeof data.offset !== undefined && data.limit) {
        return () => apiRequest(url, {
            ...options,
            params: {
                ...options.params,
                limit: data.limit,
                offset: data.limit + data.offset,
            },
        });
    }
    return undefined;
}
function partialCall(params) {
    const partialParams = params;
    const partial = ((params) => api({ ...partialParams, ...params }));
    const shorthand = (method) => (res, params) => api({ res, method, ...partialParams, ...params });
    partial.get = shorthand('get');
    partial.post = shorthand('post');
    partial.put = shorthand('put');
    partial.patch = shorthand('patch');
    partial.delete = shorthand('delete');
    partial.all = (params) => all(params);
    return partial;
}
//# sourceMappingURL=api.js.map