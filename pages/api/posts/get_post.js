export default async (req, res) => {
    // console.log("Params:", req.params)
    // console.log("Body:", req.body)
    // console.log("Query:", req.query)
    if (!req.query) {
        res.status(400).json({ message: 'No params passed' })
        return
    }
    if (!req.query.post_id) {
        res.status(400).json({ message: 'No post id passed' })
        return
    }
    const { post_id } = req.query

    const { getDatabasePool } = require('../../../database/db-connect')
    const pool = getDatabasePool()

    const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [
        post_id
    ])
    await pool.end()
    // console.log(rows)
    if (rows.length !== 1) {
        res.status(404).json({ message: 'No post found with id ' + post_id })
        return
    }

    res.status(200).json(rows[0])
}
