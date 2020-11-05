"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = exports.acknowledge = exports.trigger = exports.change = exports.event = void 0;
const common_1 = require("./common");
function event(params) {
    const { server = 'events.pagerduty.com', data, ...config } = params;
    return eventFetch(isEventsV1(params)
        ? `https://${server}/generic/2010-04-15/create_event.json`
        : `https://${server}/v2/enqueue`, {
        method: 'POST',
        body: JSON.stringify(data),
        ...config,
    });
}
exports.event = event;
function change(params) {
    const { server = 'events.pagerduty.com', data, ...config } = params;
    return eventFetch(`https://${server}/v2/change/enqueue`, {
        method: 'POST',
        body: JSON.stringify(data),
        ...config,
    });
}
exports.change = change;
function isEventsV1(params) {
    return params.data.service_key !== undefined;
}
const shorthand = (action) => (params) => {
    const typeField = isEventsV1(params) ? 'event_type' : 'event_action';
    return event({
        ...params,
        data: {
            ...params.data,
            [typeField]: action,
        },
    });
};
exports.trigger = shorthand('trigger');
exports.acknowledge = shorthand('acknowledge');
exports.resolve = shorthand('resolve');
async function eventFetch(url, options) {
    const resp = (await common_1.request(url, options));
    resp.data = await resp.json();
    return resp;
}
//# sourceMappingURL=events.js.map