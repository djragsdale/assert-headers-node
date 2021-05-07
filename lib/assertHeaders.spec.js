/* global describe, expect, test */

const assertHeaders = require('./assertHeaders')
const HeaderAssertionError = require('./HeaderAssertionError')

const baseSchema = {
  'cache-control': false,
  'strict-transport-security': true,
  'x-content-type-options': 'nosniff',
  'x-frame-options': {
    // if any are true, the header value must match a true schema value
    DENY: true,
    // if none are true, the header must NOT match a false schema value
    SAMEORIGIN: false
  }
}

const baseHeaders = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY'
}

describe('assertHeaders', () => {
  test('errors on missing required header', () => {
    const headers = {
      ...baseHeaders
    }
    delete headers['strict-transport-security']
    const schema = {
      ...baseSchema
    }

    expect(() => assertHeaders(headers, schema)).toThrow()
  })

  test('passes on presence of required header', () => {
    const headers = {
      ...baseHeaders,
      'strict-transport-security': 'abcd'
    }
    const schema = {
      ...baseSchema
    }

    expect(() => assertHeaders(headers, schema)).not.toThrow()
  })

  test('errs on presence of excluded header', () => {
    const headers = {
      ...baseHeaders,
      'cache-control': 'abcd'
    }
    const schema = {
      ...baseSchema
    }

    expect(() => assertHeaders(headers, schema)).toThrow()
  })

  test('passes on missing excluded header', () => {
    const headers = {
      ...baseHeaders
    }
    delete headers['cache-control']
    const schema = {
      ...baseSchema
    }

    expect(() => assertHeaders(headers, schema)).not.toThrow()
  })

  test('errs for presence of disallowed header value', () => {
    const headers = {
      ...baseHeaders,
      'x-frame-options': 'SAMEORIGIN'
    }
    const schema = {
      ...baseSchema
    }

    expect(() => assertHeaders(headers, schema)).toThrow()
  })

  test('errs for presence of missing header value', () => {
    const headers = {
      ...baseHeaders,
      'x-frame-options': 'ALLOW-FROM example.com'
    }
    const schema = {
      ...baseSchema
    }

    expect(() => assertHeaders(headers, schema)).toThrow()
  })

  test('passes for allowed header value', () => {
    const headers = {
      ...baseHeaders,
      'x-frame-options': 'DENY'
    }
    const schema = {
      ...baseSchema
    }

    expect(() => assertHeaders(headers, schema)).not.toThrow()
  })

  test('reports multiple errors', () => {
    const headers = {
      ...baseHeaders,
      'cache-control': 'abcd',
      'x-content-type-options': 'abcd',
      'x-frame-options': 'SAMEORIGIN'
    }
    delete headers['strict-transport-security']
    const schema = {
      ...baseSchema
    }

    try {
      assertHeaders(headers, schema)
      expect('this line').toBe('unreached')
    } catch (err) {
      expect(err).toBeInstanceOf(HeaderAssertionError)
      expect(err.errors).toHaveLength(4)
      err.errors.forEach((error) => {
        expect(error).toHaveProperty('type')
        expect(error).toHaveProperty('headerName')
        expect(error).toHaveProperty('message')
      })
    }
  })
})
