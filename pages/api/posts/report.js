export default async (req, res) => {
    const validationError = validateRequest(
        req.body.post_id,
        req.body.username,
    )
    const notReported = await checkReport(req.body.post_id, req.body.username)
    if (validationError) res.status(404).json({ message: validationError })
    else {
        if (notReported) {
            reportPost(req.body.post_id, req.body.username)
                .then((report_id) => {
                    if (report_id)
                        res.status(200).json({
                            report_id,
                            message: 'Successfully reported post'
                        })
                    else
                        res.status(500).json({
                            message: 'Error inserting report'
                        })
                })
            .catch((error) =>
                res.status(500).json({
                    message: 'Error reporting post: ' + error.code
                })
            )
        } else {
            res.status(400).json({
                message: 'You have already reported this post!'
            })
        }
    }
}

// Checks if the user has already
const checkReport = async (post_id, username) => {
    const { getDatabasePool } = require('../../../database/db-connect')
    const pool = getDatabasePool()

    const { rowCount } = await pool.query(
        `
            SELECT * FROM reported_posts
            WHERE username = $1
            AND post_id = $2`,
            [username, post_id]
    )
    await pool.end()
    if (rowCount === 0) {
        return true
    } else {
        return false
    }
        
}

// Inserts report into the database
const reportPost = async (post_id, username) => {
    const { getDatabasePool } = require('../../../database/db-connect')
    const pool = getDatabasePool()

    const { rows } = await pool.query(
        `
            INSERT INTO reported_posts (username, post_id)
            VALUES ($1, $2)
            RETURNING report_id`,
        [username, post_id]
    )
    await pool.end()
    if (rows.length !== 1) return
    return rows[0].report_id
}

const validateRequest = (post_id, username) => {
    //username is allowed to be null
    if (!post_id) return 'Post ID missing'
    return false
}