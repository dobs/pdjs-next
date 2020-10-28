# README

An updated version of PagerDuty's [pdjs](https://github.com/PagerDuty/pdjs), with the motivation of:

- Adding support for more recent PagerDuty features, such as the Events API V2 and Change Events
- Supporting best practices, like handling retries and backoff.
- Improving support for modern JavaScript tooling.
- Removing CoffeeScript!

## Installation

**Note:** Proper NPM support still TODO.

For the time being:

```bash
npm install --save dobs/pdjs-next#main
```

## Usage

### REST API

REST API calls currently expect a `token` and normally a `res` or `url`. All other attributes are optional:

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

REST API calls also support partial application when neither `res` nor `url` are provided, and exposes some convenience methods when partially applied. All other attributes (including `token`) will be passed along to subsequent calls.

```javascript
import {api} from 'pdjs-next';

const pd = api({token: 'someToken1234567890'})

pd.get('/incidents')
  .then(response => console.log(response.data))
  .catch(console.error);

// Similarly, for `post`, `put`, `patch` and `delete`.
pd.post('/incidents', { data: { ... } }).then(...)

// Calling the returned function with a `res` or `url` will also send it.
pd({
  method: 'post',
  res: '/incidents',
  data: {
    ...
  }
}).then(...)
```

There's also an async `all` that attempts to fetch all pages for a given endpoint and set of parameters.

```javascript
import {all} from 'pdjs-next';

// List every API-accessible incident.
const responses = await all({
  token: 'someToken1234567890',
  res: '/incidents',
});

for (response of responses) {
  console.log(response.data);
}
```

### Events API

Both V1 and V2 of the Events API are supported, with the version to used being based on the payload. For example, the Events API V2:

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

And the Events V1 API:

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

### Browser

A single browser-ready script file is available in [dist/pdjs.js](dist/pdjs.js). By copying that file to your project and referencing it by, for example:

```html
<script src="pdjs.js"></script>
```

You'll then be able to access all functionality under the `PagerDuty` object:

```html
<script>
  PagerDuty.api({token: 'someToken1234567890', res: '/incidents'})
    .then(response => console.log(response.data))
    .catch(console.error);
</script>
```

### Advanced

`pdjs-next` leverages `axios` for HTTP handling.

For more complex usage REST and Events API calls accept and merge in all of `AxiosRequestConfig`'s attributes. They also return `AxiosResponse`s wrapped in `Promises`. For more details on using `axios`, see its documentation: https://github.com/axios/axios
