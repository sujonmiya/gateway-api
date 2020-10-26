const chai = require('chai')
const chaiHttp = require('chai-http')
const {MongoMemoryServer} = require('mongodb-memory-server')

chai.use(chaiHttp)
const {expect} = chai

const DatabaseService = require('../service/DatabaseService')
const app = require('../app')

let mongod
let databaseService
let uri

const {NODE_ENV} = process.env

before(async () => {
    process.env.NODE_ENV = 'test'
    mongod = new MongoMemoryServer()
    uri = await mongod.getUri()
    databaseService = new DatabaseService()
    await databaseService.connect(uri)
})

const gateway = { name: "bar", address: "127.0.0.2"}
const device = {vendor: "foo", status: "online"}

describe('/api/gateways', () => {
    it('GET should return 200', (done) => {
        chai.request(app)
            .get('/api/gateways')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done()
            })
    });

    it('POST should return 201', (done) => {
        chai.request(app)
            .post('/api/gateways')
            .send(gateway)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)

                const {_id, name, address} = res.body

                expect(_id).to.not.be.empty
                expect(name).to.equal(gateway.name)
                expect(address).to.equal(gateway.address)
                done()
            })
    });

    it('POST should return 400', (done) => {
        chai.request(app)
            .post('/api/gateways')
            .send({address: "invalid"})
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                expect(res.body.errors).to.be.an('array')
                done()
            })
    });
});

describe('/api/gateways/:id', () => {
    it('GET should return 404', (done) => {
        chai.request(app)
            .get('/api/gateways/foobarbaz')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(404)
                done()
            })
    });
});

describe('/api/gateways/:id', () => {
    const requester = chai.request(app).keepOpen()

    it('GET should return 200', (done) => {
        requester.post('/api/gateways')
            .send(gateway)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)

                const {_id} = res.body

                requester.get(`/api/gateways/${_id}`)
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                    })

                requester.close(done)
            })
    });
});

describe('/api/gateways/:id/devices', () => {
    it('GET should return 200', (done) => {
        const requester = chai.request(app).keepOpen()

        requester.post('/api/gateways')
            .send(gateway)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)

                const {_id} = res.body

                requester.get(`/api/gateways/${_id}/devices`)
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(200)
                    })

                requester.close(done)
            })
    });

    it('POST should return 201', (done) => {
        const requester = chai.request(app).keepOpen()

        requester.post('/api/gateways')
            .send(gateway)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)

                const {_id} = res.body

                requester.post(`/api/gateways/${_id}/devices`)
                    .send(device)
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(201)

                        const {_id, vendor, status} = res.body

                        expect(_id).to.not.be.empty
                        expect(vendor).to.equal(device.vendor)
                        expect(status).to.equal(device.status)
                    })

                requester.close(done)
            })
    });

    it('POST should return 400', (done) => {
        const requester = chai.request(app).keepOpen()

        requester.post('/api/gateways')
            .send(gateway)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)

                const {_id} = res.body

                requester.post(`/api/gateways/${_id}/devices`)
                    .send({status: "none"})
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(400)
                        expect(res.body.errors).to.be.an('array')
                    })

                requester.close(done)
            })
    });
});

describe('/api/gateways/:id/devices/:did', () => {
    it('GET should return 200', (done) => {
        const requester = chai.request(app).keepOpen()

        requester.post('/api/gateways')
            .send(gateway)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)

                const {_id} = res.body

                requester.post(`/api/gateways/${_id}/devices`)
                    .send(device)
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(201)

                        requester.get(`/api/gateways/${_id}/devices/${res.body._id}`)
                            .end((err, res) => {
                                expect(err).to.be.null
                                expect(res).to.have.status(200)

                                requester.close(done)
                            })
                    })
            })
    });

    it('DELETE should return 204', (done) => {
        const requester = chai.request(app).keepOpen()

        requester.post('/api/gateways')
            .send(gateway)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)

                const {_id} = res.body

                requester.post(`/api/gateways/${_id}/devices`)
                    .send(device)
                    .end((err, res) => {
                        expect(err).to.be.null
                        expect(res).to.have.status(201)

                        requester.delete(`/api/gateways/${_id}/devices/${res.body._id}`)
                            .end((err, res) => {
                                expect(err).to.be.null
                                expect(res).to.have.status(204)

                                requester.close(done)
                            })
                    })
            })
    });
})

after(async () => {
    process.env.NODE_ENV = NODE_ENV
    await databaseService.disconnect()
    await mongod.stop()
    console.log('after')
})