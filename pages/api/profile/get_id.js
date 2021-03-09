const pgp = require('pg-promise')({ noWarnings: true })
const { PreparedStatement } = require('pg-promise')

require('dotenv').config()
var connectionObject = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
        requestCert: false
    }
}

const db = pgp(connectionObject)

export default async (req, res) => {
    try {
        if (req.method === 'POST') {
            var username = req.body.username
            var email = req.body.email
            
            const getIdStatement = new PreparedStatement ({
                name: 'get-user-id',
                text: `SELECT u.id
                       FROM Users u
                       WHERE u.username = $1 AND u.email = $2`,
                values: [username, email]
            })

            const result = await db
                .one(getIdStatement)
                .then((result) => {
                    res.status(200).json(result)
                })
                .catch((err) => {
                    console.log(err)
                    if (err.code == pgp.errors.queryResultErrorCode.noData) {
                        res.status(404).json({
                            message: 'Could not find requested user'
                        })
                    } else {
                        res.status(500).json({
                            message: 'Unknown server error'
                        })
                    }
                })
        }
    }
    catch (error) {
        res.status(500).send({
            message: 'Unknown server error, please contact an administrator',
            error: error
        })
    }
}