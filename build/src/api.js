"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = exports.api = void 0;
const common_1 = require("./common");
function api(params) {
    var _a, _b, _c;
    // If the params don't include `res` or `url` treat it as a partial
    // application.
    if (!params.res && !params.url) {
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
    const { res, server = 'api.pagerduty.com', token, url, version = 2, data, ...rest } = params;
    // TODO: url vs. res + baseurl handling.
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
    if (!['PUT', 'POST', 'DELETE', 'PATCH'].includes((_b = (_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'GET')) {
        config.params = (_c = config.params) !== null && _c !== void 0 ? _c : data;
    }
    else {
        config.body = JSON.stringify(data);
    }
    return apiRequest(url !== null && url !== void 0 ? url : `https://${server}/${res.replace(/\/+/, '')}`, config);
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
            if ((data === null || data === void 0 ? void 0 : data.more) && typeof data.offset !== undefined && data.limit) {
                // TODO: Support cursor-based pagination.
                apiResp.next = () => apiRequest(url, {
                    ...options,
                    params: {
                        ...options.params,
                        limit: data.limit,
                        offset: data.limit + data.offset,
                    },
                });
            }
            apiResp.data = data;
            return apiResp;
        });
    });
}
//# sourceMappingURL=api.js.map