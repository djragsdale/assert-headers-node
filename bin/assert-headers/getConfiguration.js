const { readFile } = require('fs')

module.exports = function getConfiguration (configurationPath) {
  return new Promise((resolve, reject) => {
    try {
      readFile(configurationPath, 'utf-8', (err, data) => {
        if (err) return reject(err)

        try {
          const config = JSON.parse((data || '').toString())
          resolve(config)
        } catch (parseError) {
          reject(parseError)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}
