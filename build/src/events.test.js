"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nock = require("nock");
const events_1 = require("./events");
const index_1 = require("./index");
const eventPayloadV1 = {
    data: {
        service_key: 'someServiceKey04922192cf92f43a28',
        incident_key: 'test_incident_1_f43a28',
        event_type: 'trigger',
        description: 'Test Event V1',
        details: {
            foo: 'bar',
        },
    },
};
const eventPayloadV2 = {
    data: {
        routing_key: 'someRoutingKeybfa2a710673888f520',
        event_action: 'trigger',
        dedup_key: 'test_incident_2_88f520',
        payload: {
            summary: 'Test Event V2',
            source: 'test-source',
            severity: 'error',
        },
    },
};
test('Events API properly passes Events V1 requests', async (done) => {
    const body = {
        data: {
            status: 'success',
            message: 'Event processed',
            incident_key: 'test_incident_1_406ad6',
        },
    };
    nock('https://events.pagerduty.com', {
        reqheaders: {
            'User-Agent': header => header.startsWith('pdjs-next'),
        },
    })
        .post('/generic/2010-04-15/create_event.json')
        .reply(200, body);
    const resp = await index_1.event(eventPayloadV1);
    expect(resp.url).toEqual('https://events.pagerduty.com/generic/2010-04-15/create_event.json');
    expect(resp.data).toEqual(body);
    done();
});
test('Events API properly passes Events V2 requests', async (done) => {
    const body = {
        data: {
            status: 'success',
            message: 'Event processed',
            dedup_key: 'test_incident_2_88f520',
        },
    };
    nock('https://events.pagerduty.com', {
        reqheaders: {
            'User-Agent': header => header.startsWith('pdjs-next'),
        },
    })
        .post('/v2/enqueue')
        .reply(200, body);
    const resp = await index_1.event(eventPayloadV2);
    expect(resp.url).toEqual('https://events.pagerduty.com/v2/enqueue');
    expect(resp.data).toEqual(body);
    done();
});
test('Events API properly passes Events V2 requests with images/links/details', async (done) => {
    const body = {
        data: {
            status: 'success',
            message: 'Event processed',
            dedup_key: 'test_incident_2_88f520',
        },
    };
    nock('https://events.pagerduty.com', {
        reqheaders: {
            'User-Agent': header => header.startsWith('pdjs-next'),
        },
    })
        .post('/v2/enqueue')
        .reply(200, body);
    const resp = await index_1.event({
        data: {
            routing_key: 'someRoutingKeybfa2a710673888f520',
            event_action: 'trigger',
            dedup_key: 'test_incident_3_88f520',
            payload: {
                summary: 'Test Event V2',
                source: 'test-source',
                severity: 'error',
                custom_details: {
                    foo: 'bar',
                },
            },
            images: [
                {
                    src: 'foo.jpg',
                },
            ],
            links: [
                {
                    href: 'https://www.pagerduty.com',
                },
            ],
        },
    });
    expect(resp.url).toEqual('https://events.pagerduty.com/v2/enqueue');
    expect(resp.data).toEqual(body);
    done();
});
test('Events API shorthands should send corresponding events', async (done) => {
    const body = {
        data: {
            status: 'success',
            message: 'Event processed',
            dedup_key: 'test_incident_2_88f520',
        },
    };
    nock('https://events.pagerduty.com', {
        reqheaders: {
            'User-Agent': header => header.startsWith('pdjs-next'),
        },
    })
        .post('/v2/enqueue')
        .reply(200, body);
    const resp = await events_1.acknowledge(eventPayloadV2);
    expect(resp.url).toEqual('https://events.pagerduty.com/v2/enqueue');
    expect(resp.data).toEqual(body);
    done();
});
//# sourceMappingURL=events.test.js.map