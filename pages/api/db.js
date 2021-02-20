const pgp = require('pg-promise')({
    noWarnings: true
});

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
        const test = await db.one('SELECT * from test_table');
        res.status(200).json(test)
    } catch (error) {
        res.status(500).send({message: ["Error creating on the server"], error: error})
    }
}