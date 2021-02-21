
const Client = require('pg')
const connectionString = 'postgresql://sea-db:xla7pncr7gt470ni@app-fe19e617-4264-45cc-85ce-dbdfa6eb2ffb-do-user-663470-0.b.db.ondigitalocean.com:25060/sea-db?sslmode=require'

const client = new Client({
    connectionString,
})
client.connect()

client.query('SELECT NOW()', (err, res) => {
    console.log(err, res)
    client.end()
}) 