/* global describe, expect, test */

const path = require('path')

const getConfiguration = require('./getConfiguration')

describe('bin/assert-headers/getConfiguration', () => {
  test('rejects if the file is missing', async () => {
    await expect(getConfiguration(path.join(__dirname, './__fixtures__/nonexistent.json')))
      .rejects.toThrow()
  })

  test('rejects if the file can not be parsed', async () => {
    await expect(getConfiguration(path.join(__dirname, './__fixtures__/badConfiguration.json')))
      .rejects.toThrow()
  })

  test('resolves json configuration from absolute path', async () => {
    await expect(getConfiguration(path.join(__dirname, './__fixtures__/exampleConfiguration.json')))
      .resolves.toBeInstanceOf(Object)
  })

  test('resolves json configuration from absolute path', async () => {
    await expect(getConfiguration(path.join(__dirname, './__fixtures__/exampleConfiguration.yml')))
      .resolves.toBeInstanceOf(Object)
  })
})
