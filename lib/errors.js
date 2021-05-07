function AssertHeadersConfigurationError (message) {

}

function HeaderAssertionError (errors) {
  const errorInstance = new Error('The following header errors occurred:\n- ' + errors.map(err => err.message).join('\n- '))
  Object.setPrototypeOf(errorInstance, Object.getPrototypeOf(this))
  errorInstance.errors = errors
  return errorInstance
}
HeaderAssertionError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true
  }
})
Reflect.setPrototypeOf(HeaderAssertionError, Error)

module.exports = {
  AssertHeadersConfigurationError,
  HeaderAssertionError
}
