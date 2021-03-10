export default async (req, res) => {
    const post_id = req?.query?.post_id
    if (!post_id) res.status(400).json({ message: 'Did not specify post id' })
    else {
        const { getDatabasePool } = require('../../../database/db-connect')
        const pool = getDatabasePool()

        const { rows: totalViews } = await pool.query(
            `
                SELECT COUNT(*)
                FROM post_views
                WHERE post_id = $1
            `,
            [post_id]
        )

        const { rows: uniqueViews } = await pool.query(
            `
                SELECT COUNT(distinct username)
                FROM post_views
                WHERE post_id = $1
            `,
            [post_id]
        )
        await pool.end()
        res.status(200).json({
            views: totalViews[0].count,
            uniqueViews: uniqueViews[0].count,
            message: 'Successfully retried views'
        })
    }
}
