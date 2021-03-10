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
            var userid = req.body.userid

            // Prepared statement to get user details
            const getUserStatement = new PreparedStatement({
                name: 'get-user-details',
                text: `SELECT Posts.posttitle, Posts.postcontent, Posts.timestamp, posts.id
                       FROM Posts
                                LEFT JOIN Users ON Users.id = Posts.userid
                       WHERE Users.id = $1;`,
                values: [userid]
            })

            const result = await db
                .any(getUserStatement)
                .then((result) => {
                    pgp.end()
                    // If a result is found, send status 200 with relevant info in payload
                    res.status(200).json(result)
                })
                .catch((err) => {
                    // If userID cannot be found, status 404
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
    } catch (error) {
        res.status(500).send({
            message: 'Unknown server error, please contact an administrator',
            error: error
        })
    }
}
