export default function Posts({ posts, group }) {
    return (
        <>
            <div className={styles.imageBackground} />
            <div className={styles.container}>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        <a href={'/'}>Campus Connect</a>
                    </h1>

                    <p className={styles.description}>
                        View posts in the group {group?.name}
                    </p>
                    <a
                        href={'/posts/newpost'}
                        className={postStyles.newpostlink}>
                        New post
                    </a>
                    <p>{group.description}</p>
                    <p>{group.num_posts} posts in this group</p>
                    <div className={postStyles.postsContainer}>
                        {posts.map((post) => (
                            <a
                                key={post.post_id}
                                href={'/posts/' + post.post_id}
                                className={postStyles.post}>
                                <h3>{post.post_title}</h3>
                                <p>
                                    {post.post_body.slice(0, 50)}
                                    {post.post_body.length > 50 ? '...' : ''}
                                </p>
                            </a>
                        ))}
                    </div>
                </main>

                <footer className={styles.footer}>
                    Programmed by Brian Evans, Adam Tweedie, Alex Rundle, Toby
                    Trounce and Matthew Hudson
                </footer>
            </div>
        </>
    )
}

export async function getStaticProps({ params }) {
    if (isNaN(params.id)) return { notFound: true }
    const pool = getDatabasePool()
    const { rows: posts, rowCount: postCount } = await pool.query(
        `
            SELECT p.id                            AS post_id,
                   p.posttitle                     AS post_title,
                   p.postcontent                   AS post_body,
                   u.firstname || ' ' || u.surname AS author
            FROM posts p,
                 users u
            WHERE p.userid = u.id
              AND p.groupid = $1
            ORDER BY timestamp DESC
            LIMIT 8;
        `,
        [params.id]
    )
    const { rows: groups, rowCount: groupCount } = await pool.query(
        `
            SELECT groupname as name, groupdesc as description
            FROM groups
            WHERE id = $1
        `,
        [params.id]
    )
    const group = { ...groups[0], num_posts: postCount }
    if (groupCount === 0) return { notFound: true }
    return {
        props: {
            posts,
            group
        }
    }
}

export async function getStaticPaths() {
    const pool = getDatabasePool()
    const { rows } = await pool.query('SELECT CAST(id AS text) FROM posts')
    return {
        paths: rows.map((row) => ({ params: row })),
        fallback: true
    }
}
