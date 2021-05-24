const { readFile } = require('fs')
const yaml = require('js-yaml')

module.exports = function getConfiguration (configurationPath) {
  return new Promise((resolve, reject) => {
    try {
      readFile(configurationPath, 'utf-8', (err, data) => {
        if (err) return reject(err)

        try {
          if (configurationPath.endsWith('.yml') || configurationPath.endsWith('.yaml')) {
            const config = yaml.load((data || '').toString())
            return resolve(config)
          }

          const config = JSON.parse((data || '').toString())
          return resolve(config)
        } catch (parseError) {
          return reject(parseError)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
