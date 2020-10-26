const chai = require('chai')
const {MongoMemoryServer} = require('mongodb-memory-server')
const {Error} = require('mongoose')

const {expect} = chai
const {ValidationError} = Error

const DatabaseService = require('../service/DatabaseService')
const GatewayService = require('../service/GatewayService')
const NotFoundError = require('../model/NotFoundError')

let mongod
let databaseService
let uri
let gatewayService

const {NODE_ENV} = process.env

before(async () => {
    process.env.NODE_ENV = 'test'
    mongod = new MongoMemoryServer()
    uri = await mongod.getUri()
    databaseService = new DatabaseService()
    await databaseService.connect(uri)
    gatewayService = new GatewayService()
})

const gateway = { name: "bar", address: "127.0.0.2"}

describe('GatewayService', () => {
    describe('#save', () => {
        it('should create a new gateway', async () => {
            const newGateway = await gatewayService.save(gateway)

            expect(newGateway.id).to.not.be.empty
            expect(newGateway.name).to.equal(gateway.name)
            expect(newGateway.address).to.equal(gateway.address)
        })
    })

    describe('#save', () => {
        it('should throw validation error', async () => {
            await gatewayService.save({})
                .catch(err => {
                    expect(err).to.be.an.instanceof(ValidationError)
                })
        })
    })

    describe('#find', () => {
        it('should find all gateways', async () => {
            await gatewayService.save(gateway)
            const gateways = await gatewayService.find()

            expect(gateways).to.be.an('array')
        })
    })

    describe('#findById', () => {
        it('should find the gateway by Id', async () => {
            const newGateway = await gatewayService.save(gateway)
            const _gateway = await gatewayService.findById(newGateway.id)

            expect(_gateway.id).to.equal(newGateway.id)
        })
    })

    describe('#findById', () => {
        it('should throw NotFoundError error', async () => {
            await gatewayService.findById('foo')
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