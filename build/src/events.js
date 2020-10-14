"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = exports.acknowledge = exports.trigger = exports.change = exports.event = void 0;
const immer_1 = require("immer");
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
const shorthand = (action) => (params) => event(immer_1.default(params, draft => {
    if ('event_type' in draft.data) {
        draft.data.event_type = action;
    }
    else if ('event_action' in draft.data) {
        draft.data.event_action = action;
    }
}));
exports.trigger = shorthand('trigger');
exports.acknowledge = shorthand('acknowledge');
exports.resolve = shorthand('resolve');
//# sourceMappingURL=events.js.map