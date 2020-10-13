"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moxios = require("moxios");
const sinon_1 = require("sinon");
const index_1 = require("./index");
beforeEach(() => {
    moxios.install();
});
afterEach(() => {
    moxios.uninstall();
});
test('API calls return JSON for basic API calls', async (done) => {
    let onFulfilled = sinon_1.spy();
    index_1.api({ token: 'someToken1234567890', res: '/incidents' }).then(onFulfilled);
    moxios.wait(async () => {
        let request = moxios.requests.mostRecent();
        const data = {
            data: {
                incidents: [],
                limit: 25,
                offset: 0,
                total: null,
                more: false,
            },
        };
        await request.respondWith({
            status: 200,
            response: data,
        });
        expect(onFulfilled.called).toBeTruthy();
        const response = onFulfilled.getCall(0).args[0];
        expect(response.request.url).toEqual('/incidents');
        expect(response.request.config.baseURL).toEqual('https://api.pagerduty.com/');
        expect(response.request.headers['Authorization']).toEqual('Token token=someToken1234567890');
        expect(response.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
        expect(response.data).toEqual(data);
        done();
    });
});
test('API calls use data in place of params when provided on GET requests', async (done) => {
    let onFulfilled = sinon_1.spy();
    index_1.api({
        token: 'someToken1234567890',
        res: '/incidents',
        data: { sort_by: 'created_at', total: true },
    }).then(onFulfilled);
    moxios.wait(async () => {
        let request = moxios.requests.mostRecent();
        const data = { data: {} };
        await request.respondWith({
            status: 200,
            response: data,
        });
        expect(onFulfilled.called).toBeTruthy();
        expect(onFulfilled.getCall(0).args[0].request.url).toEqual('/incidents?sort_by=created_at&total=true');
        done();
    });
});
test('Events API properly passes Events V1 requests', async (done) => {
    let onFulfilled = sinon_1.spy();
    index_1.event({
        data: {
            service_key: 'someServiceKey04922192cf92f43a28',
            incident_key: 'test_incident_1_f43a28',
            event_type: 'trigger',
            description: 'Test Event V1',
            details: {
                foo: 'bar',
            },
        },
    }).then(onFulfilled);
    moxios.wait(async () => {
        let request = moxios.requests.mostRecent();
        const data = {
            data: {
                status: 'success',
                message: 'Event processed',
                incident_key: 'test_incident_1_406ad6',
            },
        };
        await request.respondWith({
            status: 200,
            response: data,
        });
        expect(onFulfilled.called).toBeTruthy();
        const response = onFulfilled.getCall(0).args[0];
        expect(response.request.url).toEqual('https://events.pagerduty.com/generic/2010-04-15/create_event.json');
        expect(response.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
        expect(response.data).toEqual(data);
        done();
    });
});
test('Events API properly passes Events V2 requests', async (done) => {
    let onFulfilled = sinon_1.spy();
    index_1.event({
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
    }).then(onFulfilled);
    moxios.wait(async () => {
        let request = moxios.requests.mostRecent();
        const data = {
            data: {
                status: 'success',
                message: 'Event processed',
                dedup_key: 'test_incident_2_88f520',
            },
        };
        await request.respondWith({
            status: 200,
            response: data,
        });
        expect(onFulfilled.called).toBeTruthy();
        const response = onFulfilled.getCall(0).args[0];
        expect(response.request.url).toEqual('https://events.pagerduty.com/v2/enqueue');
        expect(response.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
        expect(response.data).toEqual(data);
        done();
    });
});
test('Events API properly passes Events V2 requests with images/links/details', async (done) => {
    let onFulfilled = sinon_1.spy();
    index_1.event({
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
    }).then(onFulfilled);
    moxios.wait(async () => {
        let request = moxios.requests.mostRecent();
        const data = {
            data: {
                status: 'success',
                message: 'Event processed',
                dedup_key: 'test_incident_2_88f520',
            },
        };
        await request.respondWith({
            status: 200,
            response: data,
        });
        expect(onFulfilled.called).toBeTruthy();
        const response = onFulfilled.getCall(0).args[0];
        expect(response.request.url).toEqual('https://events.pagerduty.com/v2/enqueue');
        expect(response.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
        expect(response.data).toEqual(data);
        done();
    });
});
//# sourceMappingURL=index.test.js.map