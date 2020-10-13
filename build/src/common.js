"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const axios_1 = require("axios");
const VERSION = '0.0.1';
// TODO Retry and error handling.
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
exports.request = request;
//# sourceMappingURL=common.js.map