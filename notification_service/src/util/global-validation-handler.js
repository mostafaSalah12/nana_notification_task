const Boom = require('@hapi/boom')

const handleValidationError = function (request, h, error) {
  request.log(['error'], { error })
  if (error.isBoom) {
    throw error
  }
  return h.response(Boom.internal('Could not validate the request'))
}

module.exports = handleValidationError
