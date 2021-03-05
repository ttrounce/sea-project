export default async (req, res) => {
    console.log("Test" + req.params)
    if (!req.params) {
        res.status(400).json({message: "No params passed"})
        return
    }
    if (!req.params.post_id) {
        res.status(400).json({message: "No post id passed"})
        return
    }

    const { getDatabasePool } = require('../../../database/db-connect')
    const pool = getDatabasePool()

    const {rows} = 
    await pool.query("SELECT * FROM posts WHERE id = $1", [req.params.post_id])
    console.log(rows)
    if (rows.length !== 1) {
        res.status(404).json({message: "No post found with id " 
        + req.params.post_id})
        return
    }

    res.status(200).json(rows[0])

}