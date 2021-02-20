const pgp = require('pg-promise')({
    noWarnings: true
});
const {PreparedStatement} = require('pg-promise');


const dotenv = require("dotenv").config();

var connectionObject = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        "rejectUnauthorized": false,
        "requestCert": false
    },
};

const db = pgp(connectionObject);

export default async (req, res) => {
    try {
        if(req.method === 'POST')
        {
            var username = req.body.username;
            var password = req.body.pass;

            // prepared statement to input to PostgreSQL
            const loginStatement = new PreparedStatement({
                name: 'login-user',
                text: 'SELECT username FROM Users WHERE username = $1 AND pass = $2',
                values: [username, password]
            });

            const result = await db.one(loginStatement).then(result => {
                // On success, send back { success:true }.
                res.status(200).json({success: true});
            }).catch(err => {
                // On error or failure, send back { success:false }.
                res.status(200).json({success: false});
            });
        }
    } catch (error) {
        res.status(500).send({message: ["Error creating on the server"], error: error})
    }
}