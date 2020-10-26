const express = require('express');
require('dotenv').config()

const GatewayService = require('../service/GatewayService')
const DeviceService = require('../service/DeviceService')
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT
} = require('../common/consts')

const {MAX_ALLOWED_DEVICES} = process.env
const maxAllowed = parseInt(MAX_ALLOWED_DEVICES, 10)

const router = express.Router()
const gatewayService = new GatewayService()
const deviceService = new DeviceService(maxAllowed)

router.route('/')
    .get(async (req, res, next) => {
        try {
          const gateways = await gatewayService.find()

          res.status(HTTP_STATUS_OK).json(gateways)
        } catch (err) {
          next(err)
        }
    })
    .post(async (req, res, next) => {
        try {
          const gateway = await gatewayService.save(req.body)

          res.status(HTTP_STATUS_CREATED).json(gateway)
        } catch (err) {
          next(err)
        }
    })

router.route('/:id')
    .get(async (req, res, next) => {
        const {id} = req.params

        try {
          const gateway = await gatewayService.findById(id)

          res.status(HTTP_STATUS_OK).json(gateway)
        } catch (err) {
          next(err)
        }
    })

router.route('/:id/devices')
    .get(async (req, res, next) => {
        const {id} = req.params

        try {
          const devices = await deviceService.findByGateway(id)

          res.status(HTTP_STATUS_OK).json(devices)
        } catch (err) {
          next(err)
        }
    })
    .post(async (req, res, next) => {
        const {id} = req.params

        try {
          const gateway = await gatewayService.findById(id)
          const device = await deviceService.save({...req.body, gateway: gateway.id})

          res.status(HTTP_STATUS_CREATED).json(device)
        } catch (err) {
          next(err)
        }
    })

router.route('/:id/devices/:did')
    .get(async (req, res, next) => {
        const {id, did} = req.params

        try {
          const devices = await deviceService.findByIdAndGateway(did, id)

          res.status(HTTP_STATUS_OK).json(devices)
        } catch (err) {
          next(err)
        }
    })
    .delete(async (req, res, next) => {
        const {id, did} = req.params

        try {
          const device = await deviceService.findByIdAndGateway(did, id)
          await device.delete()

          res.status(HTTP_STATUS_NO_CONTENT)
        } catch (err) {
          next(err)
        }
    })

module.exports = router