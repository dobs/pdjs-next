import * as moxios from 'moxios';
import {spy} from 'sinon';
import {api, event} from './index';

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

test('API calls return JSON for basic API calls', async done => {
  let onFulfilled = spy();

  api({token: 'someToken1234567890', res: '/incidents'}).then(onFulfilled);

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
    expect(response.request.config.baseURL).toEqual(
      'https://api.pagerduty.com/'
    );
    expect(response.request.headers['Authorization']).toEqual(
      'Token token=someToken1234567890'
    );
    expect(response.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(response.data).toEqual(data);

    done();
  });
});

test('API calls use data in place of params when provided on GET requests', async done => {
  let onFulfilled = spy();

  api({
    token: 'someToken1234567890',
    res: '/incidents',
    data: {sort_by: 'created_at', total: true},
  }).then(onFulfilled);

  moxios.wait(async () => {
    let request = moxios.requests.mostRecent();

    const data = {data: {}};

    await request.respondWith({
      status: 200,
      response: data,
    });

    expect(onFulfilled.called).toBeTruthy();
    expect(onFulfilled.getCall(0).args[0].request.url).toEqual(
      '/incidents?sort_by=created_at&total=true'
    );

    done();
  });
});
