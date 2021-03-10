import { getDatabasePool } from '../../database/db-connect'
import styles from '../../styles/Home.module.css'
import profileStyles from '../../styles/profile.module.css'
import Head from 'next/head'
import Navbar from '../../components/Navbar/Navbar'
import { useEffect, useState } from 'react'
import axios from 'axios'

const ProfilePage = ({ user, posts }) => {
    const [profilePicture, setProfilePicture] = useState()

    if (!user) {
        return <></>
    }

    useEffect(() => {
        axios
            .post('/api/proxy/profile_picture', { username: user.username })
            .then((res) => {
                setProfilePicture(res.data.results[0].picture.large)
            })
            .catch((err) => {
                console.log('error: ' + err)
            })
    }, [])
    const getMedalEmoji = (numberOfViews) => {
        if (numberOfViews === 0) return '🆕'
        else if (numberOfViews < 5) return '🥉'
        else if (numberOfViews < 50) return '🥈'
        else return '🥇'
    }
    return (
        <>
            <div className={styles.skylineBackground} />
            <div className={styles.container}>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar
                    content={[
                        { title: 'Articles', url: '/articles' },
                        { title: 'Posts', url: '/posts' },
                        { title: 'Groups', url: '/groups' },
                        { title: 'My Account', url: '/profile/' }
                    ]}
                />
                <main className={styles.main}>
                    <h2>User profile</h2>
                    <section className={profileStyles.profile}>
                        <div style={{ alignItems: 'center', display: 'flex' }}>
                            {profilePicture ? (
                                <img
                                    style={{
                                        objectFit: 'cover',
                                        marginRight: '2em',
                                        boxShadow: '0px 0px 0.2em gray',
                                        borderRadius: '50%'
                                    }}
                                    src={profilePicture}
                                />
                            ) : (
                                <svg
                                    style={{
                                        objectFit: 'cover',
                                        marginRight: '2em',
                                        boxShadow: '0px 0px 0.2em gray',
                                        borderRadius: '50%'
                                    }}
                                    width="128"
                                    height="128"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g className="layer">
                                        <ellipse
                                            cx="64.18181"
                                            cy="109.04545"
                                            fill="#000000"
                                            id="svg_5"
                                            rx="43.36364"
                                            ry="43.36364"
                                            stroke="#000000"
                                            strokeWidth="5"
                                        />
                                        <ellipse
                                            cx="64.1875"
                                            cy="31.10795"
                                            fill="#000000"
                                            id="svg_7"
                                            rx="22.44887"
                                            ry="22.44887"
                                            stroke="#000000"
                                            strokeWidth="5"
                                        />
                                    </g>
                                </svg>
                            )}
                            <div>
                                <h3>
                                    {user?.firstname} {user?.surname}
                                </h3>
                                <p>Username: {user?.username}</p>
                                <p>
                                    User since{' '}
                                    {new Date(user?.signup_date).toDateString()}
                                </p>
                                <p>
                                    Written {user?.noofposts} posts, which have
                                    a total of {user?.postsViews} views{' '}
                                    {getMedalEmoji(
                                        Number(user?.postsViews || 0)
                                    )}
                                </p>
                                <p>
                                    Viewed {user?.lastDaysViews} posts in the
                                    last day
                                </p>
                            </div>
                        </div>
                    </section>
                    <h2>Recent posts by this user</h2>
                    {posts && posts.length > 0 ? (
                        <div className={profileStyles.recentPostsContainer}>
                            {posts.map((post) => (
                                <section className={profileStyles.profile}>
                                    {post.post_body.length > 250 ? (
                                        <>
                                            <h3>{post.post_title}</h3>
                                            <p>
                                                Article with{' '}
                                                {
                                                    post.post_body.split(' ')
                                                        .length
                                                }{' '}
                                                words
                                            </p>
                                            <p>
                                                Viewed a total of{' '}
                                                {post.views || 0} time
                                                {post.views != 1
                                                    ? 's'
                                                    : ''} by {post.unique_views}{' '}
                                                unique user
                                                {post.unique_views != 1
                                                    ? 's'
                                                    : ''}
                                            </p>
                                            <a
                                                href={'/posts/' + post.post_id}
                                                className={profileStyles.link}>
                                                Read
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <h3>{post.post_title}</h3>
                                            <p>{post.post_body}</p>
                                        </>
                                    )}
                                </section>
                            ))}
                        </div>
                    ) : (
                        <section className={profileStyles.profile}>
                            <h3>No recent posts by this user</h3>
                        </section>
                    )}
                </main>

                <footer className={styles.footer}>
                    Programmed by Brian Evans, Adam Tweedie, Alex Rundle, Toby
                    Trounce and Matthew Hudson
                </footer>
            </div>
        </>
    )
}
export default ProfilePage

export async function getStaticProps({ params }) {
    if (params.username.length <= 0) return { notFound: true }
    const pool = getDatabasePool()
    const { rows: users, rowCount: userCount } = await pool.query(
        `
            SELECT u.username,
                   u.id,
                   u.firstname,
                   u.surname,
                   u.email,
                   u.signup_date::text,
                   r.rolename,
                   COUNT(p.id) AS noofposts
            FROM Users u
                     LEFT JOIN Posts p ON p.userid = u.id,
                 Roles r
            WHERE u.username = $1
              AND r.roleid = u.roleid
            GROUP BY u.username, u.id, u.firstname, u.surname, u.email, u.signup_date, r.rolename;
        `,
        [params.username]
    )

    // console.log(users, userCount)
    if (userCount !== 1) return { notFound: true }
    const user = users[0]
    const { rows: posts } = await pool.query(
        `SELECT p.id                            AS post_id,
                p.posttitle                     AS post_title,
                p.postcontent                   AS post_body,
                u.firstname || ' ' || u.surname AS author,
                p.timestamp::text               AS timestamp,
                COUNT(distinct pv.view_id)      as views,
                COUNT(distinct pv.username)     as unique_views
         FROM posts p
                  LEFT JOIN
              post_views pv ON p.id = pv.post_id,
              users u
         WHERE p.userid = u.id
           AND LENGTH(p.postcontent) > 250
           AND u.id = $1
         GROUP BY p.id, post_title, post_body, author, p.timestamp
         ORDER BY p.timestamp DESC
         LIMIT 3;`,
        [user.id]
    )

    const { rows: userViews } = await pool.query(
        `
            SELECT COUNT(*)
            FROM post_views
            WHERE username = $1
              AND timestamp > NOW() - INTERVAL '1 day'
        `,
        [user.username]
    )
    user.lastDaysViews = userViews[0]?.count || 0

    const { rows: postsViews } = await pool.query(
        `
            SELECT COUNT(*)
            FROM post_views pv,
                 users u,
                 posts p
            WHERE pv.post_id = p.id
              AND u.username = $1
              AND u.id = p.userid
        `,
        [user.username]
    )
    user.postsViews = postsViews[0]?.count || 0
    await pool.end()
    return {
        props: {
            user,
            posts: posts.map((post) => ({
                ...post,
                timestamp: post.timestamp.toString()
            }))
        },
        revalidate: 1
    }
}

// this gets a list of all the users
export async function getStaticPaths() {
    const pool = getDatabasePool()
    const { rows } = await pool.query(
        'SELECT username::text FROM users ORDER BY signup_date DESC LIMIT 1'
    )
    await pool.end()
    return {
        paths: rows.map((row) => ({ params: row })),
        fallback: true
    }
}
