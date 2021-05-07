/* global describe, expect, test */

const nock = require('nock')

const fromUrl = require('./fromUrl')

describe('fromUrl', () => {
  test('rejects if request fails header assertion', async () => {
    const url = 'https://example.com'
    const config = {
      schema: {
        'x-content-type-options': 'nosniff',
      }
    }

    nock('https://example.com')
      .get('/')
      .reply(200, 'Hello World!', {
        'content-type': 'text/html'
      })

    try {
      await expect(fromUrl(url, config)).rejects.toThrow()
    } finally {
      nock.cleanAll()
    }
  })

  test('resolves headers on valid http response headers', async () => {
    const url = 'https://example.com'
    const config = {
      schema: {
        'x-content-type-options': 'nosniff',
      }
    }

    nock('https://example.com')
      .get('/')
      .reply(200, 'Hello World!', {
        'content-type': 'text/html',
        'x-content-type-options': 'nosniff'
      })

    try {
      await expect(fromUrl(url, config)).resolves.toBeInstanceOf(Object)
    } finally {
      nock.cleanAll()
    }
  })

  test('resolves headers on valid https response headers', async () => {
    const url = 'https://example.com'
    const config = {
      schema: {
        'x-content-type-options': 'nosniff',
      }
    }

    nock('https://example.com')
      .get('/')
      .reply(200, 'Hello World!', {
        'content-type': 'text/html',
        'x-content-type-options': 'nosniff'
      })

    try {
      await expect(fromUrl(url, config)).resolves.toBeInstanceOf(Object)
    } finally {
      nock.cleanAll()
    }
  })
})