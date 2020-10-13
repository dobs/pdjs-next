# README

An updated version of PagerDuty's [pdjs](https://github.com/PagerDuty/pdjs), with the motivation of:

- Adding support for more recent PagerDuty features, such as the Events API V2 and Change Events
- Supporting best practices, like handling retries and providing a custom User-Agent when possible.
- Improving support for modern JavaScript tooling.
- Removing CoffeeScript!

## Installation

**Note:** Proper NPM support still TODO.

For the time being:

```bash
npm install --save dobs/pdjs-next#main
```

## Usage

`pdjs-next` leverages `axios` and returns `AxiosResponse`s wrapped in `Promises`. See below for examples of how to interact with return values, or refer to the `axios` documentation: https://github.com/axios/axios

For PagerDuty API calls:

```javascript
import {api} from 'pdjs-next';

api({token: 'someToken1234567890', res: '/incidents'})
  .then(response => console.log(response.data))
  .catch(console.error);

// ... or ...

api({token: 'someToken1234567890', url: 'https://api.pagerduty.com/incidents'})
  .then(response => console.log(response.data))
  .catch(console.error);
```

For the Events V2 API:

```javascript
import {event} from 'pdjs-next';

event({
  data: {
    routing_key: '791695b5cdea40bfa2a710673888f520',
    event_action: 'trigger',
    dedup_key: 'test_incident_2_88f520',
    payload: {
      summary: 'Test Event V2',
      source: 'test-source',
      severity: 'error',
    },
  },
})
  .then(console.log)
  .catch(console.error);
```

And for the Events V1 API (determined by the payload):

```javascript
import {event} from 'pdjs-next';

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
})
  .then(console.log)
  .catch(console.error);
```

For convenience each function accepts and passes through all `AxiosRequestConfig` attributes.

API calls also support partial application, which exposes some convenience methods:

```javascript
import {api} from 'pdjs-next';

const pd = api({token: 'someToken1234567890'})

pd.get('/incidents')
  .then(response => console.log(response.data))
  .catch(console.error);

// Similarly, for `post`, `put`, `patch` and `delete`.
pd.post('/incidents', data: { ... }).then(...)

// Calling the returned function with a `res` or `url` will also send it.
pd({
  method: 'post',
  res: '/incidents',
  data: {
    ...
  }
}).then(...)
```
