const mongoose = require('mongoose')
const {IPv4} = require('ipaddr.js')

const { Schema } = mongoose

const schema = new Schema({
  name: {type: String, required: true, maxlength: 64},
  address: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return IPv4.isValid(value);
      },
      message: ({value}) => `'${value}' is not a valid ipv4 address`
    },
  }
}, {
  versionKey: false
})

const Gateway = mongoose.model('Gateway', schema)

module.exports = Gateway