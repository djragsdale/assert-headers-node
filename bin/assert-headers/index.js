#!/usr/bin/env node

const path = require('path')

const { fromUrl } = require('../../lib')
const HeaderAssertionError = require('../../lib/HeaderAssertionError')
const getConfiguration = require('./getConfiguration')
const pkg = require('../../package.json')

const EXIT_CODES = {
  ASSERTION_FAILED: 2,
  CONFIGURATION_ERROR: 3,
  SUCCESS: 0,
  UNCAUGHT_ERROR: 1
}

if (process.argv.includes('--version')) {
  process.stdout.write(`assert-headers-node v${pkg.version}`)
  process.exit(EXIT_CODES.SUCCESS)
}

const opts = {
  configurationPath: path.join(process.cwd(), './headersSchema.json'),
  silentMode: false,
  url: undefined
}

if (process.argv.includes('--silent')) {
  opts.silentMode = true
}

const configIdx = process.argv.findIndex(arg => arg === '--config')
if (configIdx > -1 && process.argv.length > (configIdx + 1)) {
  opts.configurationPath = path.join(process.cwd(), process.argv[configIdx + 1])
}

opts.url = process.argv[process.argv.length - 1]

getConfiguration(opts.configurationPath).then((config) => {
  fromUrl(opts.url, config).then((headers) => {
    if (!opts.silentMode) {
      process.stdout.write('assert-headers success\n\n')
      process.stdout.write(JSON.stringify(headers, null, 2))
    }

    process.exit(EXIT_CODES.SUCCESS)
  }).catch((err) => {
    if (!opts.silentMode) {
      process.stderr.write(err.message)
    }

    if (err instanceof HeaderAssertionError) {
      process.exit(EXIT_CODES.ASSERTION_FAILED)
    }

    process.exit(EXIT_CODES.UNCAUGHT_ERROR)
  })
}).catch((err) => {
  if (!opts.silentMode) {
    process.stderr.write(err.message)
  }

  process.exit(EXIT_CODES.CONFIGURATION_ERROR)
})
