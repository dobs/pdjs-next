"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moxios = require("moxios");
const index_1 = require("./index");
beforeEach(() => {
    moxios.install();
});
afterEach(() => {
    moxios.uninstall();
});
test('API calls return JSON for basic API calls with res', async (done) => {
    const data = {
        incidents: [],
        limit: 25,
        offset: 0,
        total: null,
        more: false,
    };
    moxios.stubRequest('/incidents', {
        status: 200,
        response: data,
    });
    const resp = await index_1.api({ token: 'someToken1234567890', res: '/incidents' });
    expect(resp.config.url).toEqual('/incidents');
    expect(resp.request.config.baseURL).toEqual('https://api.pagerduty.com/');
    expect(resp.request.headers['Authorization']).toEqual('Token token=someToken1234567890');
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual(data);
    done();
});
test('API calls return JSON for basic API calls with URL', async (done) => {
    moxios.stubRequest('https://api.pagerduty.com/incidents', {
        status: 200,
        response: {},
    });
    const resp = await index_1.api({
        token: 'someToken1234567890',
        url: 'https://api.pagerduty.com/incidents',
    });
    expect(resp.config.url).toEqual('https://api.pagerduty.com/incidents');
    expect(resp.request.headers['Authorization']).toEqual('Token token=someToken1234567890');
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual({});
    done();
});
test('API calls support partial application with res', async (done) => {
    const data = {
        incidents: [],
        limit: 25,
        offset: 0,
        total: null,
        more: false,
    };
    moxios.stubRequest('/incidents', {
        status: 200,
        response: data,
    });
    const pd = index_1.api({ token: 'someToken1234567890' });
    const resp = await pd({ res: '/incidents' });
    expect(resp.config.url).toEqual('/incidents');
    expect(resp.request.config.baseURL).toEqual('https://api.pagerduty.com/');
    expect(resp.request.headers['Authorization']).toEqual('Token token=someToken1234567890');
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual(data);
    done();
});
test('API calls support partial application with url', async (done) => {
    const data = {
        incidents: [],
        limit: 25,
        offset: 0,
        total: null,
        more: false,
    };
    moxios.stubRequest('https://api.pagerduty.com/incidents', {
        status: 200,
        response: data,
    });
    const pd = index_1.api({ token: 'someToken1234567890' });
    const resp = await pd({
        url: 'https://api.pagerduty.com/incidents',
    });
    expect(resp.config.url).toEqual('https://api.pagerduty.com/incidents');
    expect(resp.request.headers['Authorization']).toEqual('Token token=someToken1234567890');
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual(data);
    done();
});
test('API calls support partial application with convenience methods', async (done) => {
    const data = {
        incidents: [],
        limit: 25,
        offset: 0,
        total: null,
        more: false,
    };
    moxios.stubRequest('/incidents', {
        status: 200,
        response: data,
    });
    const resp = await index_1.api({ token: 'someToken1234567890' }).get('/incidents');
    expect(resp.config.url).toEqual('/incidents');
    expect(resp.request.config.baseURL).toEqual('https://api.pagerduty.com/');
    expect(resp.request.headers['Authorization']).toEqual('Token token=someToken1234567890');
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual(data);
    done();
});
test('API calls use data in place of params when provided on GET requests', async (done) => {
    const data = {
        incidents: [],
        limit: 25,
        offset: 0,
        total: null,
        more: false,
    };
    moxios.stubRequest('/incidents?sort_by=created_at&total=true', {
        status: 200,
        response: data,
    });
    const resp = await index_1.api({
        token: 'someToken1234567890',
        res: '/incidents',
        data: { sort_by: 'created_at', total: true },
    });
    expect(resp.request.url).toEqual('/incidents?sort_by=created_at&total=true');
    done();
});
test('API `all` calls should generate requests until no more results', async (done) => {
    const data = {
        incidents: [],
        limit: 1,
        offset: 0,
        total: null,
        more: true,
    };
    moxios.stubRequest('/incidents?limit=1', {
        status: 200,
        response: data,
    });
    moxios.stubRequest('/incidents?limit=1&offset=1', {
        status: 200,
        response: {
            ...data,
            offset: 1,
        },
    });
    moxios.stubRequest('/incidents?limit=1&offset=2', {
        status: 200,
        response: {
            ...data,
            offset: 2,
            more: false,
        },
    });
    const resps = await index_1.all({
        token: 'someToken1234567890',
        res: '/incidents',
        data: { limit: 1 },
    });
    expect(resps.length).toEqual(3);
    expect(resps[0].data.offset).toEqual(0);
    expect(resps[1].data.offset).toEqual(1);
    expect(resps[2].data.offset).toEqual(2);
    done();
});
test('API `all` calls on partials should generate requests until no more results', async (done) => {
    const data = {
        incidents: [],
        limit: 1,
        offset: 0,
        total: null,
        more: true,
    };
    moxios.stubRequest('/incidents?limit=1', {
        status: 200,
        response: data,
    });
    moxios.stubRequest('/incidents?limit=1&offset=1', {
        status: 200,
        response: {
            ...data,
            offset: 1,
        },
    });
    moxios.stubRequest('/incidents?limit=1&offset=2', {
        status: 200,
        response: {
            ...data,
            offset: 2,
            more: false,
        },
    });
    const pd = index_1.api({ token: 'someToken1234567890' });
    const resps = await pd.all({
        res: '/incidents',
        data: { limit: 1 },
    });
    expect(resps.length).toEqual(3);
    expect(resps[0].data.offset).toEqual(0);
    expect(resps[1].data.offset).toEqual(1);
    expect(resps[2].data.offset).toEqual(2);
    done();
});
//# sourceMappingURL=api.test.js.map