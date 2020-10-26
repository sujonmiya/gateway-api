const {ERROR_TYPE_GATEWAY_ERROR} = require('../common/consts')

class NotFoundError extends Error {
    constructor(message) {
        super(message)

        this.name = ERROR_TYPE_GATEWAY_ERROR
    }
}

module.exports = NotFoundError