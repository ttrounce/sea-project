export default async (req, res) => {
    const validationError = validateInput(
        req.body.title,
        req.body.content,
        req.body.user,
        req.body.group,
        req.body.post_id
    )
    if (validationError) {
        res.status(400).json({ message: validationError })
    } else {
        submitPost(
            req.body.title,
            req.body.content,
            req.body.user,
            req.body.group,
            req.body.post_id
        )
            .then((post_id) =>
                res
                    .status(200)
                    .json({ message: 'Successfully edited post', post_id })
            )
            .catch((e) =>
                res.status(500).json({ message: 'Postgres error ' + e.code })
            )
    }
}

const submitPost = async (title, content, user, group, post_id) => {
    const { getDatabasePool } = require('../../../database/db-connect')
    const pool = getDatabasePool()
    // console.log('Editing:', post_id, title, content, user, group)
    const { rows } = await pool.query(
        `UPDATE posts
         SET posttitle=$1,
             postcontent=$2,
             groupid=$3
         WHERE id = $4
         RETURNING id;`,
        [title, content, group, post_id]
    )
    // console.log(rows)
    await pool.end()
    if (rows.length === 1) return rows[0].id
}

const validateInput = (title, content, user, group, post_id) => {
    if (!title) return 'title missing'
    if (!content) return 'content missing'
    if (!user) return 'user id missing'
    if (!group) return 'group missing'
    if (!post_id) return 'post id missing'
    return false
}
