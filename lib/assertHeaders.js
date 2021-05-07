const { HeaderAssertionError } = require('./errors')

const ERROR_TYPES = {
  FOUND_DISALLOWED: 'found disallowed',
  INVALID_VALUE: 'has invalid value for',
  MISSING_REQUIRED: 'missing required',
  SCHEMA_ERROR: 'invalid schema'
}

module.exports = function assertHeaders (headers, schema) {
  const errors = []

  Object.entries(schema).forEach(([schemaHeader, schemaValue]) => {
    if (schemaValue === false) {
      if (schemaHeader in headers) {
        errors.push({
          type: ERROR_TYPES.FOUND_DISALLOWED,
          headerName: schemaHeader,
          headerValue: headers[schemaHeader],
          message: `"${schemaHeader}" is disallowed but was found`
        })
      }
    } else if (schemaValue === true) {
      if (!(schemaHeader in headers)) {
        errors.push({
          type: ERROR_TYPES.MISSING_REQUIRED,
          headerName: schemaHeader,
          message: `"${schemaHeader}" is required but was missing`
        })
      }
    } else if (typeof schemaValue === 'string') {
      if (headers[schemaHeader] !== schemaValue) {
        errors.push({
          type: ERROR_TYPES.INVALID_VALUE,
          headerName: schemaHeader,
          message: `"${schemaHeader}" expected value "${schemaValue}" but found "${headers[schemaHeader]}"`
        })
      }
    } else if (typeof schemaValue === 'object') {
      // if any are true, the header value must match a true schema value
      // if none are true, the header must NOT match a false schema value
      if (Object.values(schemaValue).find(valueKey => valueKey === true)) {
        const allowedValues = Object.entries(schemaValue)
          .filter(([_, isAllowed]) => isAllowed === true)
          .map(([allowedValue]) => allowedValue)
        if (!allowedValues.includes(headers[schemaHeader])) {
          errors.push({
            type: ERROR_TYPES.INVALID_VALUE,
            headerName: schemaHeader,
            headerValue: headers[schemaHeader],
            message: `"${headers[schemaHeader]}" is not an allowed value for "${schemaHeader}"`
          })
        }
      } else {
        const disallowedValues = Object.keys(schemaValue)
        if (disallowedValues.includes(headers[schemaHeader])) {
          errors.push({
            type: ERROR_TYPES.INVALID_VALUE,
            headerName: schemaHeader,
            headerValue: headers[schemaHeader],
            message: `"${headers[schemaHeader]}" is not an allowed value for "${schemaHeader}"`
          })
        }
      }
    } else {
      errors.push({
        type: ERROR_TYPES.SCHEMA_ERROR,
        headerName: schemaHeader,
        message: `the schema for "${schemaHeader}" is invalid`
      })
    }
  })

  if (errors.length) {
    throw new HeaderAssertionError(errors)
  }

  return true
}
