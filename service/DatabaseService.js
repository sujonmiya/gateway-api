const mongoose = require('mongoose')

const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}

class DatabaseService {
    connect(host, database = '', user = '', password = '') {
        const uri = [host, database].filter(Boolean).join('/')
        return mongoose.connect(uri, opts)
    }

    disconnect() {
        return mongoose.disconnect()
    }
}

module.exports = DatabaseService