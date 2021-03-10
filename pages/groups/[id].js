import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import postStyles from '../../styles/post.module.css'
import groupStyles from '../../styles/groups.module.css'
import Navbar from '../../components/Navbar/Navbar'
import { useSession } from 'next-auth/client'

export default function Posts({ posts, group }) {
    const [session, loading] = useSession()
    if (loading) {
        return <></>
    }
    return (
        <>
            <div className={styles.forumHillBackground} />
            <div className={styles.container}>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <>
                    {!session && (
                        <>
                            <Navbar
                                content={[
                                    { title: 'Posts', url: '/posts' },
                                    { title: 'Groups', url: '/groups' },
                                    { title: 'Log In', url: '/login' },
                                    { title: 'Register', url: '/register' }
                                ]}
                            />
                        </>
                    )}
                    {session && (
                        <>
                            <Navbar
                                content={[
                                    { title: 'Posts', url: '/posts' },
                                    { title: 'Groups', url: '/groups' },
                                    { title: 'My Account', url: '/profile' }
                                ]}
                            />
                        </>
                    )}
                </>
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        <a href={'/groups'}>Campus Connect Groups</a>
                    </h1>

                    <p className={styles.description}>
                        View posts in {group?.name}
                    </p>
                    <div className={groupStyles.groupInfoCard}>
                        <div>
                            <p>{group?.description}</p>
                            <p>
                                {group?.num_posts || 'No'} posts in this group
                            </p>
                        </div>
                        <a
                            href={'/posts/newpost?group=' + group?.id}
                            className={postStyles.newpostlink}>
                            New post
                        </a>
                    </div>

                    <div className={postStyles.postsContainer}>
                        {posts?.map((post) => (
                            <a
                                key={post.post_id}
                                href={'/posts/' + post.post_id}
                                className={postStyles.post}>
                                <a
                                    className={groupStyles.postTag}
                                    href={
                                        post.post_body?.length > 250
                                            ? '/articles'
                                            : '/posts'
                                    }>
                                    {post.post_body?.length > 250
                                        ? 'article'
                                        : 'post'}
                                </a>
                                <h3>{post.post_title}</h3>
                                <p>
                                    Written by {post.author} on{' '}
                                    {new Date(post.timestamp).toDateString()}
                                </p>
                                <p>
                                    Viewed a total of {post.views || 0} time
                                    {post.views != 1 ? 's' : ''} by{' '}
                                    {post.unique_views} unique user
                                    {post.unique_views != 1 ? 's' : ''}
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
            WITH recent_posts AS (
                SELECT p.id                            AS post_id,
                       p.posttitle                     AS post_title,
                       p.postcontent                   AS post_body,
                       u.firstname || ' ' || u.surname AS author,
                       p.timestamp::text               AS timestamp,
                       g.groupname                     AS group_name,
                       g.id                            AS group_id,
                       (
                           SELECT COUNT(distinct pvv.username)
                           FROM post_views pvv
                           WHERE pvv.post_id = p.id
                       )                               as unique_views,
                       (
                           SELECT COUNT(*)
                           FROM post_views pvv
                           WHERE pvv.post_id = p.id
                             AND pvv.timestamp > NOW() - INTERVAL '60 min'
                       )                               as views_last_hour,
                       (
                           SELECT COUNT(*)
                           FROM post_views pvv
                           WHERE pvv.post_id = p.id
                       )                               as views
                FROM posts p,
                     users u,
                     groups g
                WHERE p.userid = u.id
                  AND g.id = p.groupid
                  AND g.id = $1
                ORDER BY p.timestamp DESC
                LIMIT 200)
            SELECT *
            FROM recent_posts
            ORDER BY timestamp DESC;
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
        },
        revalidate: 1
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
