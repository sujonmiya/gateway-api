const {isValidObjectId} = require('mongoose')

const isObjectId = value => isValidObjectId(value)

module.exports = {
    isObjectId
}