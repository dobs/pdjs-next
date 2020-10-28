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
function isEventsV2(params) {
    return params.data.routing_key !== undefined;
}
const shorthand = (action) => (params) => {
    let typeField;
    if (isEventsV1(params)) {
        typeField = 'event_type';
    }
    else if (isEventsV2(params)) {
        typeField = 'event_action';
    }
    else {
        return Promise.reject('Unrecognized event type.');
    }
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