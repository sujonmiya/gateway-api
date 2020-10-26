const Gateway = require('../model/Gateway')
const NotFoundError = require('../model/NotFoundError')
const {isObjectId} = require('../common/helpers')
const {
  ERROR_MSG_NOT_FOUND
} = require('../common/consts')

class GatewayService {

  find() {
    return Gateway.find({}).limit(10)
  }

  async findById(id) {
    const msg = `Gateway "${id}" ${ERROR_MSG_NOT_FOUND}`

    if (!isObjectId(id)) {
      throw new NotFoundError(msg)
    }

    const gateway = await Gateway.findById(id)
    if (!gateway) {
      throw new NotFoundError(msg)
    }

    return gateway
  }

  async save(data) {
    const gateway = new Gateway(data)

    const errors = gateway.validateSync()
    if (errors) {
      throw errors
    }

    await gateway.save()
    return gateway
  }
}

module.exports = GatewayService