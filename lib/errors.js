function AssertHeadersConfigurationError(message) {

}

function HeaderAssertionError(errors) {
  const errorInstance = new Error(errors.join('\n'))
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
});
if (Object.setPrototypeOf){
    Object.setPrototypeOf(HeaderAssertionError, Error);
} else {
    HeaderAssertionError.__proto__ = Error;
}

module.exports = {
  AssertHeadersConfigurationError,
  HeaderAssertionError
}
