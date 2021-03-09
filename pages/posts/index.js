import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { getDatabasePool } from '../../database/db-connect'
import postStyles from '../../styles/post.module.css'
import Navbar from '../../components/Navbar/Navbar'
import { useSession } from 'next-auth/client'

export default function Posts({ posts }) {
    const [session, loading] = useSession()
    if (loading) {
        return <></>
    }
    const averageViews =
        posts.reduce(
            (previousValue, currentValue) =>
                previousValue + Number(currentValue.views),
            0
        ) / posts.length
    return (
        <>
            <div className={styles.amoryBackground} />
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
                        <a href={'/'}>Campus Connect</a>
                    </h1>

                    <p className={styles.description}>
                        View recently trending posts
                    </p>
                    {session && (
                        <a
                            href={'/posts/newpost'}
                            className={postStyles.newpostlink}>
                            New Post
                        </a>
                    )}
                    <div className={postStyles.shortPostsContainer}>
                        {posts.map((post) => (
                            <a
                                key={post.post_id}
                                className={postStyles.post}
                                href={'/posts/' + post.post_id}>
                                <a
                                    className={postStyles.groupTag}
                                    href={'/groups/' + post.group_id}>
                                    {post.group_name}
                                </a>
                                <span
                                    className={postStyles.shortViewCount}
                                    style={{
                                        color:
                                            post.views > averageViews
                                                ? 'forestgreen'
                                                : 'darkorange'
                                    }}>
                                    {post.views || 0} view
                                    {post.views != 1 ? 's' : ''} in the last
                                    hour
                                </span>
                                <h3>{post.post_title}</h3>
                                <p>{post.post_body.slice(0, 250)}</p>
                                <p>
                                    Written by {post.author} on{' '}
                                    {new Date(post.timestamp).toDateString()} at{' '}
                                    {new Date(
                                        post.timestamp
                                    ).toLocaleTimeString()}
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

export async function getServerSideProps() {
    const pool = getDatabasePool()
    const { rows: posts } = await pool.query(`
        WITH recent_posts AS (SELECT p.id                            AS post_id,
                                     p.posttitle                     AS post_title,
                                     p.postcontent                   AS post_body,
                                     u.firstname || ' ' || u.surname AS author,
                                     p.timestamp::text               AS timestamp,
                                     g.groupname                     AS group_name,
                                     g.id                            AS group_id,
                                     COUNT(distinct pv.view_id)      as views,
                                     COUNT(distinct pv.username)     as unique_views
                              FROM posts p
                                       LEFT JOIN
                                   post_views pv ON p.id = pv.post_id,
                                   users u,
                                   groups g
                              WHERE p.userid = u.id
                                AND g.id = p.groupid
                                AND pv.timestamp > NOW() - INTERVAL '60 min'
                                AND LENGTH(p.postcontent) < 250
                              GROUP BY p.id, post_title, post_body, author, p.timestamp, group_name, group_id
                              ORDER BY p.timestamp DESC
                              LIMIT 8)
        SELECT *
        FROM recent_posts
        ORDER BY views DESC;
    `)

    await pool.end()
    return {
        props: {
            posts: posts
        }
    }
}
