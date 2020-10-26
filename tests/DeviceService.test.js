const chai = require('chai')
const {MongoMemoryServer} = require('mongodb-memory-server')
const {Error} = require('mongoose')

const {expect} = chai
const {ValidationError} = Error

const DatabaseService = require('../service/DatabaseService')
const DeviceService = require('../service/DeviceService')
const GatewayService = require('../service/GatewayService')
const NotFoundError = require('../model/NotFoundError')
const GatewayError = require('../model/GatewayError')

let mongod
let databaseService
let uri
let deviceService
let gatewayService

const { NODE_ENV } = process.env

before(async () => {
    process.env.NODE_ENV = 'test'
    mongod = new MongoMemoryServer()
    uri = await mongod.getUri()
    databaseService = new DatabaseService()
    await databaseService.connect(uri)
    gatewayService = new GatewayService()
    deviceService = new DeviceService(2)
})

const gateway = { name: "bar", address: "127.0.0.2"}
const device = {vendor: "foo", status: "online"}

describe('DeviceService', () => {
    describe('#save', () => {
        it('should create a new device with gateway', async () => {
            const newGateway = await gatewayService.save(gateway)

            expect(newGateway.id).to.not.be.empty
            expect(newGateway.name).to.equal(gateway.name)
            expect(newGateway.address).to.equal(gateway.address)

            const newDevice = await deviceService.save({...device, gateway: newGateway.id})
            expect(newDevice.id).to.not.be.empty
            expect(newDevice.name).to.equal(device.name)
            expect(newDevice.status).to.equal(device.status)
            expect(newDevice.gateway).to.equal(newGateway.id)
        })
    })

    describe('#save', () => {
        it('should throw validation error', async () => {
            await deviceService.save({})
                .catch(err => {
                    expect(err).to.be.an.instanceof(ValidationError)
                })
        })
    })

    describe('#save', () => {
        it('should throw GatewayError error', async () => {
            const newGateway = await gatewayService.save(gateway)

            expect(newGateway.id).to.not.be.empty
            await Promise.all(
                [device, device]
                    .map(device => deviceService.save({...device, gateway: newGateway.id}))
            )

            await deviceService.save({...device, gateway: newGateway.id})
                .catch(err => {
                    expect(err).to.be.an.instanceof(GatewayError)
                })
        })
    })

    describe('#findByGateway', () => {
        it('should find a device for the gateway', async () => {
            const newGateway = await gatewayService.save(gateway)

            expect(newGateway.id).to.not.be.empty

            const newDevice = await deviceService.save({...device, gateway: newGateway.id})
            expect(newDevice.id).to.not.be.empty

            const devices = await deviceService.findByGateway(newGateway.id)
            expect(devices).to.be.an('array')
        })
    })

    describe('#findByIdAndGateway', () => {
        it('should find the device for the gateway', async () => {
            const newGateway = await gatewayService.save(gateway)

            expect(newGateway.id).to.not.be.empty

            const newDevice = await deviceService.save({...device, gateway: newGateway.id})
            expect(newDevice.id).to.not.be.empty

            const _device = await deviceService.findByIdAndGateway(newDevice.id, newGateway.id)
            expect(_device.id).to.equal(newDevice.id)
        })
    })

    describe('#findByIdAndGateway', () => {
        it('should throw NotFoundError', async () => {
            await deviceService.findByIdAndGateway('foo', 'bar')
                .catch(err => {
                    expect(err).to.be.an.instanceof(NotFoundError)
                })
        })
    })

    describe('#deleteById', () => {
        it('should delete the device', async () => {
            const newGateway = await gatewayService.save(gateway)

            expect(newGateway.id).to.not.be.empty

            const newDevice = await deviceService.save({...device, gateway: newGateway.id})
            expect(newDevice.id).to.not.be.empty

            await deviceService.deleteById(newDevice.id)
            await deviceService.findByIdAndGateway(newDevice.id, newGateway.id)
                .catch(err => {
                    expect(err).to.be.an.instanceof(NotFoundError)
                })
        })
    })
})

after(async () => {
    process.env.NODE_ENV = NODE_ENV
    await databaseService.disconnect()
    await mongod.stop()
})