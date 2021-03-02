export default async (req, res) => {
    console.log(req.body)
    if (req.body.id) {
        await deletePost(req.body.id)
        res.status(200).json({ message: 'successfully deleted' })
    } else res.status(400).json({ message: 'Post id not specified' })
}

const deletePost = async (post_id) => {
    const { getDatabasePool } = require('../../database/db-connect')
    const pool = getDatabasePool()
    await pool.query('DELETE FROM posts WHERE id=$1;', [post_id])
}
