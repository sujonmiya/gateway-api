const {
  HTTP_STATUS_VALIDATION_ERROR,
  ERROR_TYPE_VALIDATION_ERROR,
  ERROR_TYPE_GATEWAY_ERROR
} = require('../common/consts')

function errorHandler(err, req, res, next) {
  if (!err) {
    next()

    return
  }

  switch (err.name) { // ?
    case ERROR_TYPE_VALIDATION_ERROR: {
      const errors = Object.keys(err.errors)
          .map(k => err.errors[k])
          .map(({path, message}) => ({
            [path]: message
          }))

      res.status(HTTP_STATUS_VALIDATION_ERROR).json({errors})
    }
    break

    case ERROR_TYPE_GATEWAY_ERROR: {
      const {message} = err
      res.status(HTTP_STATUS_VALIDATION_ERROR).json({message})
    }
    break
  }

  next()
}

module.exports = errorHandler