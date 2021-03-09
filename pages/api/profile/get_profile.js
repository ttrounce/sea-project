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
                text: `SELECT Users.username, Users.firstname, Users.surname, Users.email, Users.signup_date, Roles.rolename, COUNT(Posts.id) AS noofposts
                       FROM Users
                       LEFT JOIN Posts ON Users.id = Posts.userid
                       LEFT JOIN Roles ON Roles.roleid = Users.roleid
                       WHERE Users.id = $1
                       GROUP BY Users.username, Users.firstname, Users.surname, Users.email, Users.signup_date, Roles.rolename;`,
                values: [userid]
            })

            const result = await db
                .one(getUserStatement)
                .then((result) => {
                    // If a result is found, send status 200 with relevant info in payload
                    res.status(200).json(result)
                })
                .catch((err) => {
                    // If userID cannot be found, status 404
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
    } catch (error) {
        res.status(500).send({
            message: 'Unknown server error, please contact an administrator',
            error: error
        })
    }
}
