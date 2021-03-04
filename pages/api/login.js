const pgp = require('pg-promise')({ noWarnings: true })
const { PreparedStatement } = require('pg-promise')
const bcrypt = require('bcrypt')
const validation = require('./modules/validation.js')

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
            var password = req.body.pass

            // validate username and password
            if (!validation.validateUsername(username)) {
                res.status(422).json({ type: 'validation', field: 'username' })
                return
            }
            if (!validation.validatePassword(password)) {
                res.status(422).json({ type: 'validation', field: 'password' })
                return
            }

            // prepared statement to input to PostgreSQL
            const loginStatement = new PreparedStatement({
                name: 'login-user',
                text: 'SELECT pass FROM Users WHERE username = $1',
                values: [username]
            })

            const result = await db
                .one(loginStatement)
                .then((result) => {
                    var hash = result.pass
                    // If the hash matches, send back a success.
                    if (bcrypt.compareSync(password, hash)) {
                        res.status(200).json({
                            message: 'Successfully logged in'
                        })
                    } else {
                        res.status(401).json({
                            message: 'Incorrect username or password'
                        })
                    }
                })
                .catch((err) => {
                    if (err.received == 0) {
                        res.status(401).json({
                            message: 'Incorrect username or password'
                        })
                    } else {
                        res.status(500).json({
                            message:
                                'Unknown server error, please contact an administrator'
                        })
                    }
                })
        }
    } catch (error) {
        res.status(500).send({
            message: 'Unknown server error, please contact an administrator',
            error: error
        })
    }
}
