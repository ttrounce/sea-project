const pgp = require('pg-promise')({ noWarnings: true })
const { PreparedStatement } = require('pg-promise')
const bcrypt = require('bcrypt')
const validation = require('./modules/validation.js')

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

            // validate username, email and password.
            if (!validation.validateUsername(username)) {
                res.status(422).json({ type: 'validation', field: 'username' })
                return
            }
            if (!validation.validateEmail(email)) {
                res.status(422).json({ type: 'validation', field: 'email' })
                return
            }
            if (!validation.validatePassword(req.body.pass)) {
                res.status(422).json({ type: 'validation', field: 'password' })
                return
            }

            // hash the password with bcrypt using 10 rounds
            var passwordHash = bcrypt.hashSync(req.body.pass, 10)

            // prepared statement to input to PostgreSQL
            const registerStatement = new PreparedStatement({
                name: 'register-user',
                text:
                    'INSERT INTO Users (username, pass, email) values ($1, $2, $3)',
                values: [username, passwordHash, email]
            })

            const result = await db
                .none(registerStatement)
                .then((reason) => {
                    // registered
                    res.status(200).json({ message: 'Successfully registered' })
                })
                .catch((err) => {
                    // Error code for when field values are already taken.
                    if (err.code == 23505) {
                        res.status(422).json({
                            type: 'preexisting',
                            message: 'Username or email is already registered'
                        })
                    } else {
                        res.status(500).json({
                            message: 'Unknown server error'
                        })
                    }
                })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Unknown server error', error: error })
    }
}
