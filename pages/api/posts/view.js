export default async (req, res) => {
    console.log(
        'Request received for post view',
        req.body,
        req.params,
        req.query
    )
    const validationError = validateRequest(
        req.body.post_id,
        req.body.username,
        req.body.timestamp
    )
    if (validationError) res.status(404).json({ message: validationError })
    else {
        viewPost(req.body.post_id, req.body.username, req.body.timestamp)
            .then((view_id) => {
                console.log('View ID:', view_id)
                if (view_id)
                    res.status(200).json({
                        view_id,
                        message: 'Successfully viewed post'
                    })
                else
                    res.status(500).json({
                        message: 'Error inserting post view'
                    })
            })
            .catch((error) =>
                res.status(500).json({
                    message: 'Error inserting post view: ' + error.code
                })
            )
    }
}

const viewPost = async (post_id, username, timestamp) => {
    const { getDatabasePool } = require('../../../database/db-connect')
    const pool = getDatabasePool()

    const { rows } = await pool.query(
        `
            INSERT INTO post_views (username, timestamp, post_id)
            VALUES ($1, $2, $3)
            RETURNING view_id`,
        [username, new Date(timestamp), post_id]
    )
    console.log('Rows', rows)
    await pool.end()
    if (rows.length !== 1) return
    return rows[0].view_id
}

const validateRequest = (post_id, username, timestamp) => {
    //username is allowed to be null
    if (!post_id) return 'Post ID missing'
    if (!timestamp) return 'Timestamp missing'
    return false
}
