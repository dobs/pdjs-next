import nock = require('nock');
import {all, api} from './index';

const EMPTY_BODY = {
  incidents: [],
  limit: 25,
  offset: 0,
  total: null,
  more: false,
};

test('API calls return JSON for basic API calls with res', async done => {
  nock('https://api.pagerduty.com', {
    reqheaders: {
      Authorization: 'Token token=someToken1234567890',
      'User-Agent': header => header.startsWith('pdjs-next'),
    },
  })
    .get('/incidents')
    .reply(200, EMPTY_BODY);

  const resp = await api({token: 'someToken1234567890', res: '/incidents'});

  expect(resp.url).toEqual('https://api.pagerduty.com/incidents');
  expect(resp.data).toEqual(EMPTY_BODY);
  done();
});

test('API calls return JSON for basic API calls with URL', async done => {
  nock('https://api.pagerduty.com', {
    reqheaders: {
      Authorization: 'Token token=someToken1234567890',
      'User-Agent': header => header.startsWith('pdjs-next'),
    },
  })
    .get('/incidents')
    .reply(200, {});

  const resp = await api({
    token: 'someToken1234567890',
    url: 'https://api.pagerduty.com/incidents',
  });

  expect(resp.url).toEqual('https://api.pagerduty.com/incidents');
  expect(resp.data).toEqual({});
  done();
});

test('API calls support partial application with res', async done => {
  nock('https://api.pagerduty.com').get('/incidents').reply(200, EMPTY_BODY);

  const pd = api({token: 'someToken1234567890'});
  const resp = await pd({res: '/incidents'});

  expect(resp.url).toEqual('https://api.pagerduty.com/incidents');
  expect(resp.data).toEqual(EMPTY_BODY);
  done();
});

test('API calls support partial application with url', async done => {
  nock('https://api.pagerduty.com').get('/incidents').reply(200, EMPTY_BODY);

  const pd = api({token: 'someToken1234567890'});
  const resp = await pd({
    url: 'https://api.pagerduty.com/incidents',
  });

  expect(resp.url).toEqual('https://api.pagerduty.com/incidents');
  expect(resp.data).toEqual(EMPTY_BODY);
  done();
});

test('API calls support partial application with convenience methods', async done => {
  nock('https://api.pagerduty.com').get('/incidents').reply(200, EMPTY_BODY);

  const resp = await api({token: 'someToken1234567890'}).get('/incidents');

  expect(resp.url).toEqual('https://api.pagerduty.com/incidents');
  expect(resp.data).toEqual(EMPTY_BODY);
  done();
});

test('API calls use data in place of params when provided on GET requests', async done => {
  nock('https://api.pagerduty.com')
    .get('/incidents?sort_by=created_at&total=true')
    .reply(200, EMPTY_BODY);

  const resp = await api({
    token: 'someToken1234567890',
    res: '/incidents',
    data: {sort_by: 'created_at', total: true},
  });

  expect(resp.url).toEqual(
    'https://api.pagerduty.com/incidents?sort_by=created_at&total=true'
  );
  expect(resp.data).toEqual(EMPTY_BODY);
  done();
});

test('API `all` calls should generate requests until no more results', async done => {
  const body = {
    incidents: [],
    limit: 1,
    offset: 0,
    total: null,
    more: true,
  };

  nock('https://api.pagerduty.com').get('/incidents?limit=1').reply(200, body);

  nock('https://api.pagerduty.com')
    .get('/incidents?limit=1&offset=1')
    .reply(200, {
      ...body,
      offset: 1,
    });

  nock('https://api.pagerduty.com')
    .get('/incidents?limit=1&offset=2')
    .reply(200, {
      ...body,
      offset: 2,
      more: false,
    });

  const resps = await all({
    token: 'someToken1234567890',
    res: '/incidents',
    data: {limit: 1},
  });

  expect(resps.length).toEqual(3);
  expect(resps[0].data.offset).toEqual(0);
  expect(resps[1].data.offset).toEqual(1);
  expect(resps[2].data.offset).toEqual(2);
  done();
});

test('API `all` calls on partials should generate requests until no more results', async done => {
  const body = {
    incidents: [],
    limit: 1,
    offset: 0,
    total: null,
    more: true,
  };

  nock('https://api.pagerduty.com').get('/incidents?limit=1').reply(200, body);

  nock('https://api.pagerduty.com')
    .get('/incidents?limit=1&offset=1')
    .reply(200, {
      ...body,
      offset: 1,
    });

  nock('https://api.pagerduty.com')
    .get('/incidents?limit=1&offset=2')
    .reply(200, {
      ...body,
      offset: 2,
      more: false,
    });

  const pd = api({token: 'someToken1234567890'});

  const resps = await pd.all({
    res: '/incidents',
    data: {limit: 1},
  });

  expect(resps.length).toEqual(3);
  expect(resps[0].data.offset).toEqual(0);
  expect(resps[1].data.offset).toEqual(1);
  expect(resps[2].data.offset).toEqual(2);
  done();
});
