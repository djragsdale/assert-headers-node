/* global describe, expect, test */

const index = require('./')

describe('package root', () => {
  test('exports a function', () => {
    expect(typeof index).toBe('function')
  })

  test('exports a fromUrl method', () => {
    expect(typeof index.fromUrl).toBe('function')
  })
})
