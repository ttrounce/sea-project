const { Client } = require('pg')
const connectionString =
    'postgresql://sea-db:xla7pncr7gt470ni@app-fe19e617-4264-45cc-85ce-dbdfa6eb2ffb-do-user-663470-0.b.db.ondigitalocean.com:25060/sea-db?sslmode=require'
const { Pool } = require('pg')

export const getDatabasePool = () => {
    return new Pool({
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false,
            requestCert: false
        }
    })
}

// const client = new Client({
//     connectionString,
// })
// client.connect()
//
// client.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     client.end()
// })
