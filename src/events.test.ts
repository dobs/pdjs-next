import * as moxios from 'moxios';
import {spy} from 'sinon';
import {event} from './index';

beforeEach(() => {
  moxios.install();
});

afterEach(() => {
  moxios.uninstall();
});

test('Events API properly passes Events V1 requests', async done => {
  let onFulfilled = spy();

  event({
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
    expect(response.request.url).toEqual(
      'https://events.pagerduty.com/generic/2010-04-15/create_event.json'
    );
    expect(response.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(response.data).toEqual(data);

    done();
  });
});

test('Events API properly passes Events V2 requests', async done => {
  let onFulfilled = spy();

  event({
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
    expect(response.request.url).toEqual(
      'https://events.pagerduty.com/v2/enqueue'
    );
    expect(response.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(response.data).toEqual(data);

    done();
  });
});

test('Events API properly passes Events V2 requests with images/links/details', async done => {
  let onFulfilled = spy();

  event({
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
    expect(response.request.url).toEqual(
      'https://events.pagerduty.com/v2/enqueue'
    );
    expect(response.request.headers['User-Agent']).toMatch(/^pdjs-next.*/);
    expect(response.data).toEqual(data);

    done();
  });
});