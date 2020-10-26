const {
  ERROR_MSG_INTERNAL_SERVER_ERROR
} = require('../common/consts')

function errorHandler(err, req, res, next) {
  if (!err) {
    next()

    return
  }

  res.status(500).json({message: ERROR_MSG_INTERNAL_SERVER_ERROR})
  next()
}

module.exports = errorHandler