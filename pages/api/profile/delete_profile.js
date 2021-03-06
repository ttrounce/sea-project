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
    if (req.method === 'POST') {
        const validationError = validateInput(req.body.user_id)
        if (validationError) {
            res.status(400).json({ message: validationError })
        } else {
            deleteUser(req.body.userid)
        }
    }
}

const deleteUser = async (post_id) => {
    try {
        var userid = req.body.userid
        
        const delUserStatement = new PreparedStatement ({
            name: 'del-user',
            text: `WITH deleted AS (DELETE FROM Users u WHERE u.id = $1 RETURNING *) 
                    SELECT COUNT(*) FROM deleted;`,
            values: [userid]
        })

        const result = await db
            .one(delUserStatement)
            .then((count) => {
                if (count === 0) {
                    return res.status(400).json({ message: 'Could not delete user' })
                } else {
                    return res.status(200).json({ message: 'Successfully deleted user'})
                }
            })
            .catch((err) =>
            res.status(500).json({ message: 'Server Error: ' + err.code })
            )
    } catch (error) {
        return res.status(500).send({
            message: 'Unknown server error, please contact administrator',
            error: error
        })
    }
}

const validateInput = (userid) => {
    if (!userid) return 'User ID Missing'
    return false
}