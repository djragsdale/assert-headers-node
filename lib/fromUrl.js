const http = require('http')
const https = require('https')
const { URL } = require('url')

const assertHeaders = require('./assertHeaders')
const pkg = require('../package.json')

module.exports = function fromUrl(url, configuration) {
  const {
    origin = 'http://a.com',
    schema,
    userAgent = `Assert Headers v${pkg.version} (https://github.com/djragsdale/assert-headers-node)`
  } = configuration

  const parsedUrl = new URL(url)

  const options = {
    headers: {
      origin,
      'user-agent': userAgent
    }
  }

  return new Promise((resolve, reject) => {
    function executeRequest (lib) {
      lib.get(parsedUrl, options, (res) => {
        try {
          assertHeaders(res.headers, schema)
          resolve(res.headers)
        } catch (err) {
          reject(err)
        }
      }).on('error', (err) => {
        reject(err)
      })
    }

    if (parsedUrl.protocol === 'http:') {
      executeRequest(http)
    } else {
      executeRequest(https)
    }
  })
}
