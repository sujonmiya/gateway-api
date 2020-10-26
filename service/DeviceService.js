const Device = require('../model/Device')
const NotFoundError = require('../model/NotFoundError')
const GatewayError = require('../model/GatewayError')
const {isObjectId} = require('../common/helpers')
const {
  ERROR_MSG_NOT_FOUND
} = require('../common/consts')

class DeviceService {

  constructor(maxAllowed) {
    this.maxAllowed = maxAllowed
  }

  findByGateway(gateway) {
    return Device.find({gateway}).limit(10)
  }

  async findByIdAndGateway(id, gateway) {
    const msg = `Device "${id}" ${ERROR_MSG_NOT_FOUND}`

    if (!isObjectId(id)) {
      throw new NotFoundError(msg)
    }

    const device = await Device.findOne({_id: id, gateway})
    if (!device) {
      throw new NotFoundError(msg)
    }

    return device
  }

  async save(data) {
    const device = new Device(data)

    const errors = device.validateSync()
    if (errors) {
      throw errors
    }

    const {gateway} = data

    const total = await Device.countDocuments({gateway})

    if (total === this.maxAllowed) {
      throw new GatewayError(`maximum ${this.maxAllowed} peripheral devices are allowed`)
    }

    await device.save()
    return device
  }

  deleteById(id) {
    const msg = `Device "${id}" ${ERROR_MSG_NOT_FOUND}`

    if (!isObjectId(id)) {
      throw new NotFoundError(msg)
    }

    return Device.deleteOne({_id: id})
  }
}

module.exports = DeviceService