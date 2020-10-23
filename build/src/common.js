"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
const axios_1 = require("axios");
const browser_or_node_1 = require("browser-or-node");
const VERSION = '0.0.1';
// TODO Retry and error handling.
function request(config) {
    return axios_1.default.request({
        timeout: 30000,
        ...config,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...userAgentHeader(),
            ...config.headers,
        },
    });
}
exports.request = request;
function userAgentHeader() {
    return browser_or_node_1.isBrowser
        ? {}
        : {
            'User-Agent': `pdjs-next/${VERSION} (${process.version}/${process.platform})`,
        };
}
//# sourceMappingURL=common.js.map