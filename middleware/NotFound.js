const {
  ERROR_TYPE_NOTFOUND_ERROR,
} = require('../common/consts')

function errorHandler(err, req, res, next) {
  if (!err) {
    next()

    return
  }

  // err instanceof ValidationError
  switch (err.name) {
    case ERROR_TYPE_NOTFOUND_ERROR: {
      const {message} = err
      res.status(404).json({message})
    }
    break
  }

  next()
}

module.exports = errorHandler