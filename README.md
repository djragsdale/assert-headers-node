# assert-headers-node

Assert HTTP headers

## Usage

### CLI

#### Global usage

```bash
npm i -g assert-headers
# Assume headersSchema.json in current working directory
assert-headers https://example.com
```

or with specified configuration

```bash
assert-headers --config ./customConfiguration.json https://example.com
```

or using npx

```bash
npx assert-headers https://example.com
```

in silent mode

```bash
npx assert-headers --silent --config ./customConfiguration.json https://example.com
```

to see what version you are running

```bash
assert-headers --version
```

##### Advanced CLI Usage

TODO: Add example of how to stream a column of a .csv into the tool

TODO: Show how the exit codes can be used in smoke tests

#### CLI Configuration

`assert-headers` currently accepts configuration in JSON or YAML formats. It allows specifying a schema for the headers, but also the outgoing origin and user-agent headers for the request. Below is an example configuration:

```json
{
  "userAgent": "assert-headers-node",
  "origin": "https://example.com",
  "schema": {
    "cache-control": false,
    "strict-transport-security": true,
    "x-content-type-options": "nosniff",
    "x-frame-options": {
      "DENY": true,
      "SAMEORIGIN": false
    }
  }
}
```

```yaml
userAgent: "assert-headers-py"
origin: "https://example.com"
schema:
  cache-control: False
  strict-transport-security: True
  x-content-type-options: "nosniff"
  x-frame-options:
    DENY: True
    SAMEORIGIN: False
```

**Schema Explanation:**

1. `"disallowed-header-name": false` - It is considered an error if this header is defined
1. `"required-header-name": true` - It is considered an error if this header is missing (or `undefined`)
1. `"strict-header-name": "only good value"` - It is considered an error if this header does not have this value
1. `"enumerated-header-name": { "good header value": true, "another good value": true }` - It is considered an error if this header contains a value other than one marked `true`.
1. `"enumerated-header-name": { "bad header value": false, "another bad value": false }` - It is considered an error if this header contains a value not marked `true`
1. If no enumerated header values are marked `true`, all listed values are considered invalid values. It is highly recommended to ONLY use `true` and `false` for enumerated values

### assertHeader

```js
const assertHeader = require('assert-header')

const headers = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY'
}
const schema = {
  'cache-control': false,
  'strict-transport-security': true,
  'x-content-type-options': 'nosniff',
  'x-frame-options': {
    // if any are true, the header value must match a true schema value
    DENY: true
  }
}

try {
  assertHeaders(headers, schema)
} catch (err) {
  console.error('OOPS!', err.message)
  if (err.errors) {
    err.errors.forEach((assertionError) => {
      console.error(`The header ${assertionError.headerName} was bad!`)
    })
  }
}
```

This can also be used inside a test library for validating HTTP response headers.

### assertHeader.fromUrl

```js
const assertHeader = require('assert-header')

(async () => {
  const configuration {
    'userAgent': 'Custom User Agent name',
    origin: 'https://my-domain.com',
    schema: {
      'cache-control': false,
      'strict-transport-security': true,
      'x-content-type-options': 'nosniff',
      'x-frame-options': {
        // if any are true, the header value must match a true schema value
        DENY: true
      }
    }
  }

  await assertHeader.fromUrl('https://example.com/my-test-page', configuration)
})()
```
