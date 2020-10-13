"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.change = exports.event = void 0;
const common_1 = require("./common");
// async function api_all(params: APIParams) {
// }
function event(params) {
    const { server = 'events.pagerduty.com', ...config } = params;
    return common_1.request({
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
    return common_1.request({
        method: 'POST',
        url: `https://${server}/v2/change/enqueue`,
        ...config,
    });
}
exports.change = change;
function isEventsV1(params) {
    return params.data.service_key !== undefined;
}
//# sourceMappingURL=events.js.map