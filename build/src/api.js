"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const common_1 = require("./common");
function api(params) {
    var _a, _b, _c;
    if (!params.res && !params.url) {
        const partialParams = params;
        const partial = ((params) => api({ ...partialParams, ...params }));
        const shorthand = (method) => (res, params) => api({ res, method, ...partialParams, ...params });
        partial.get = shorthand('get');
        partial.post = shorthand('post');
        partial.put = shorthand('put');
        partial.patch = shorthand('patch');
        partial.delete = shorthand('delete');
        return partial;
    }
    let { res, server = 'api.pagerduty.com', token, version = 2, ...config } = params;
    config = {
        method: 'GET',
        url: config.url ? config.url : res,
        baseURL: config.url ? undefined : `https://${server}/`,
        ...config,
    };
    config.headers = {
        Accept: `application/vnd.pagerduty+json;version=${version}`,
        Authorization: `Token token=${token}`,
        ...config.headers,
    };
    // Allow `data` for `params` for requests without bodies.
    if (!['PUT', 'POST', 'DELETE', 'PATCH'].includes((_b = (_a = config.method) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : 'GET')) {
        config.params = (_c = config.params) !== null && _c !== void 0 ? _c : config.data;
        delete config.data;
    }
    return common_1.request(config);
}
exports.api = api;
//# sourceMappingURL=api.js.map