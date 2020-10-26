const mongoose = require('mongoose')

const {isObjectId} = require('../common/helpers')
const {
  GATEWAY_STATUS_ONLINE,
  GATEWAY_STATUS_OFFLINE
} = require('../common/consts')

const { Schema } = mongoose

const schema = new Schema({
  uid: Number,
  vendor: {String},
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    required: [true],
    enum: {
      values: [
          GATEWAY_STATUS_ONLINE,
          GATEWAY_STATUS_OFFLINE
      ],
      message: ({path, value}) => `'${value}' is not a valid ${path}`
    },
  },
  gateway: {
    type: String,
    required: true,
    index: true,
  validator(value) {
      return isObjectId(value);
    },
    message: ({value}) => `'${value}' is not a valid gateway`
  }
})

const Device = mongoose.model('Device', schema)

schema.pre('save', async (next) => {
  if (this.isNew) {
      const total = await Device.count()
      this.uid = total + 1
      next()
  } else {
      next()
  }
})

module.exports = Device