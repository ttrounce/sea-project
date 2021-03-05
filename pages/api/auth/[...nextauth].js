import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const pgp = require('pg-promise')({ noWarnings: true })
const { PreparedStatement } = require('pg-promise')
const bcrypt = require('bcrypt')

import validation from '../modules/validation'

const connectionObject = {
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

/**
 * Returns the user credentials, and returns the information for the session
 * @param {Object} credentials 
 */
async function checkCredentials(credentials)
{
    const db = pgp(connectionObject)
    const username = credentials.username
    const password = credentials.password

    // Validates that the username and password are of correct length
    if (!validation.validateUsername(username)) {
        return
    }
    if (!validation.validatePassword(password)) {
        return
    }

    // Login statement to select password and email.
    const loginStatement = new PreparedStatement({
        name: 'login-user',
        text: 'SELECT pass, email FROM Users WHERE username = $1',
        values: [username]
    })

    // Send the statement off,
    return await db.one(loginStatement)
        .then((result) => {
            // If the hash matches, send back a success.
            if (bcrypt.compareSync(password, result.pass)) {
                // Return the session user object
                return {name: username, email: result.email}
            } else {
                // Login rejected.
                return null
            }
        })
        .catch((reason) => {
            // Login rejected.
            return null
        })
}

export default NextAuth({
    providers: [
        Providers.Credentials({
            id: 'username-login',
            name: '',
            credentials: {
                username: {
                    label: 'Username', type: 'text', placeholder: 'Username'
                },
                password: {
                    label: 'Password', type: 'password'
                }
            },
            pages: {
                signIn: '/login'
            },
            authorize: async (credentials) => {
                return checkCredentials(credentials);
            }
        })
    ]
})