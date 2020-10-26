const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config()

const gatewaysRouter = require('./routes/gateway')
const ValidationErrorHandler = require('./middleware/ValidationError')
const NotFound = require('./middleware/NotFound')
const ErrorHandler = require('./middleware/ErrorHandler')

const app = express();
const { NODE_ENV } = process.env

if (NODE_ENV === 'development') {
    app.use(logger('dev'))
}

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api/gateways', gatewaysRouter)
app.use(ValidationErrorHandler)
app.use(NotFound)
app.use(ErrorHandler)

module.exports = app