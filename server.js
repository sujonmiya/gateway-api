require('dotenv').config()

const DatabaseService = require('./service/DatabaseService')

const app = require('./app')
const databaseService = new DatabaseService()

const {
    PORT,
    DB_HOST,
    DB_NAME
} = process.env

try {
    databaseService.connect(DB_HOST, DB_NAME)
        .then(() => {
            console.log(`successfully connected to database: ${DB_NAME}`)
        })
} catch (err) {
    console.log(`could not establish a connection to db server`, err)
    throw err
}

app.listen(PORT || 5000, () => {
    console.log(`app listening on ${PORT}`)
})
