export default async (req, res) => {
    const validationError = validateInput(req.body.post_id)
    if (validationError) {
        res.status(400).json({ message: validationError })
    } else {
        deletePost(req.body.post_id)
            .then((count) => {
                if (count === 0) {
                    res.status(400).json({ message: 'Could not delete post' })
                } else {
                    res.status(200).json({
                        message: 'Successfully deleted post'
                    })
                }
            })
            .catch((e) =>
                res.status(500).json({ message: 'Server Error: ' + e.code })
            )
    }
}

const deletePost = async (post_id) => {
    const { getDatabasePool } = require('../../../database/db-connect')
    const pool = getDatabasePool()
    const {
        rows
    } = await pool.query(
        'WITH deleted AS (DELETE FROM posts WHERE id = $1 RETURNING *) SELECT COUNT(*) FROM deleted;',
        [post_id]
    )
    return Number(rows[0].count)
}

const validateInput = (post_id) => {
    if (!post_id) return 'post id missing'
    return false
}
