import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import postStyles from '../../styles/post.module.css'
import groupStyles from '../../styles/groups.module.css'
import Navbar from "../components/Navbar/Navbar"

export default function Posts({ posts, group }) {
    return (
        <>
            <div className={styles.imageBackground} />
            <div className={styles.container}>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar />
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        <a href={'/'}>Campus Connect</a>
                    </h1>

                    <p className={styles.description}>
                        View posts in {group?.name}
                    </p>
                    <div className={groupStyles.groupInfoCard}>
                        <a
                            href={'/posts/newpost?group=' + group?.id}
                            className={postStyles.newpostlink}>
                            New post
                        </a>
                        <p>{group?.description}</p>
                        <p>{group?.num_posts || 'No'} posts in this group</p>
                    </div>

                    <div className={postStyles.postsContainer}>
                        {posts?.map((post) => (
                            <a
                                key={post.post_id}
                                href={'/posts/' + post.post_id}
                                className={postStyles.post}>
                                <h3>{post.post_title}</h3>
                                <p>
                                    Written by {post.author} on{' '}
                                    {new Date(post.timestamp).toDateString()}
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
    const { getDatabasePool } = require('../../database/db-connect')
    const pool = getDatabasePool()
    const { rows: posts, rowCount: postCount } = await pool.query(
        `
            SELECT p.id                            AS post_id,
                   p.posttitle                     AS post_title,
                   u.firstname || ' ' || u.surname AS author,
                   p.timestamp::text
            FROM posts p,
                 users u
            WHERE p.userid = u.id
              AND p.groupid = $1
              AND LENGTH(p.postcontent) > 250
            ORDER BY timestamp DESC
            LIMIT 8;
        `,
        [params.id]
    )
    const { rows: groups, rowCount: groupCount } = await pool.query(
        `
            SELECT groupname as name, groupdesc as description, id
            FROM groups
            WHERE id = $1
        `,
        [params.id]
    )
    if (groupCount === 0) return { notFound: true }
    const group = { ...groups[0], num_posts: postCount }
    return {
        props: {
            posts,
            group
        }
    }
}

export async function getStaticPaths() {
    const { getDatabasePool } = require('../../database/db-connect')
    const pool = getDatabasePool()
    const { rows } = await pool.query('SELECT id::text FROM groups')
    return {
        paths: rows.map((row) => ({ params: row })),
        fallback: true
    }
}
