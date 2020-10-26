const {ERROR_TYPE_NOTFOUND_ERROR} = require('../common/consts')

class NotFoundError extends Error {
    constructor(message) {
        super(message)

        this.name = ERROR_TYPE_NOTFOUND_ERROR
    }
}

module.exports = NotFoundError