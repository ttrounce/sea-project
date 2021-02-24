export default async (req, res) => {
    const validationError = validateInput(
        req.body.title,
        req.body.content,
        req.body.user,
        req.body.group
    )
    if (validationError) {
        res.status(400).json({ message: validationError })
    } else {
        submitPost(
            req.body.title,
            req.body.content,
            req.body.user,
            req.body.group
        )
            .then((post_id) =>
                res
                    .status(200)
                    .json({ message: 'Successfully submitted post', post_id })
            )
            .catch((e) => res.status(501).json({ message: e }))
    }
}

const submitPost = async (title, content, user, group) => {
    const { getDatabasePool } = require('../../database/db-connect')
    const pool = getDatabasePool()
    await pool.query(
        'INSERT INTO posts (posttitle, postcontent, userid, groupid) VALUES ($1, $2, $3, $4) RETURNING id;',
        [title, content, user, group]
    )
}

const validateInput = (title, content, user, group) => {
    if (!title) return 'title missing'
    if (!content) return 'content missing'
    if (!user) return 'user id missing'
    if (!group) return 'group missing'
    return false
}
