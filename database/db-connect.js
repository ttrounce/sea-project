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
