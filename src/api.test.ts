import * as moxios from 'moxios';
import {spy} from 'sinon';
import {api, event} from './index';

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

test('API calls return JSON for basic API calls with res', async done => {
  const data = {
    data: {
      incidents: [],
      limit: 25,
      offset: 0,
      total: null,
      more: false,
    },
  };

  moxios.stubRequest('/incidents', {
    status: 200,
    response: data
  })

  api({token: 'someToken1234567890', res: '/incidents'}).then(resp => {
    expect(resp.request.url).toEqual('/incidents');
    expect(resp.request.config.baseURL).toEqual(
      'https://api.pagerduty.com/'
    );
    expect(resp.request.headers['Authorization']).toEqual(
      'Token token=someToken1234567890'
    );
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual(data);
    done()
  });
});

test('API calls return JSON for basic API calls with URL', async done => {
  moxios.stubRequest('https://api.pagerduty.com/incidents', {
    status: 200,
    response: {data: {}}
  })

  api({
    token: 'someToken1234567890',
    url: 'https://api.pagerduty.com/incidents',
  }).then(resp => {
    expect(resp.request.url).toEqual('https://api.pagerduty.com/incidents');
    expect(resp.request.headers['Authorization']).toEqual(
      'Token token=someToken1234567890'
    );
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual({data: {}});
    done();
  });
});

test('API calls support partial application with res', async done => {
  const data = {
    data: {
      incidents: [],
      limit: 25,
      offset: 0,
      total: null,
      more: false,
    },
  };

  moxios.stubRequest('/incidents', {
    status: 200,
    response: data
  })

  const pd = api({token: 'someToken1234567890'})
  
  pd({res: '/incidents'}).then(resp => {
    expect(resp.request.url).toEqual('/incidents');
    expect(resp.request.config.baseURL).toEqual(
      'https://api.pagerduty.com/'
    );
    expect(resp.request.headers['Authorization']).toEqual(
      'Token token=someToken1234567890'
    );
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual(data);
    done();
  });
});

test('API calls support partial application with url', async done => {
  const data = {
    data: {
      incidents: [],
      limit: 25,
      offset: 0,
      total: null,
      more: false,
    },
  };

  moxios.stubRequest('https://api.pagerduty.com/incidents', {
    status: 200,
    response: data
  })

  const pd = api({token: 'someToken1234567890'})

  pd({
    url: 'https://api.pagerduty.com/incidents',
  }).then(resp => {
    expect(resp.request.url).toEqual('https://api.pagerduty.com/incidents');
    expect(resp.request.headers['Authorization']).toEqual(
      'Token token=someToken1234567890'
    );
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual(data);
    done();
  });
});

test('API calls support partial application with convenience methods', async done => {
  const data = {
    data: {
      incidents: [],
      limit: 25,
      offset: 0,
      total: null,
      more: false,
    },
  };

  moxios.stubRequest('/incidents', {
    status: 200,
    response: data
  })

  api({token: 'someToken1234567890'}).get('/incidents').then(resp => {
    expect(resp.request.url).toEqual('/incidents');
    expect(resp.request.config.baseURL).toEqual(
      'https://api.pagerduty.com/'
    );
    expect(resp.request.headers['Authorization']).toEqual(
      'Token token=someToken1234567890'
    );
    expect(resp.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(resp.data).toEqual(data);
    done();
  });
});

test('API calls use data in place of params when provided on GET requests', async done => {
  const data = {
    data: {
      incidents: [],
      limit: 25,
      offset: 0,
      total: null,
      more: false,
    },
  };

  moxios.stubRequest('/incidents?sort_by=created_at&total=true', {
    status: 200,
    response: data
  })

  api({
    token: 'someToken1234567890',
    res: '/incidents',
    data: {sort_by: 'created_at', total: true},
  }).then(resp => {
    expect(resp.request.url).toEqual('/incidents?sort_by=created_at&total=true')
    done();
  });
});
