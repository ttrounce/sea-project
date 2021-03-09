import { getDatabasePool } from '../../database/db-connect'
import styles from '../../styles/Home.module.css'
import profileStyles from '../../styles/profile.module.css'
import Head from 'next/head'
import Navbar from "../components/Navbar/Navbar"
import { useState, useEffect } from 'react'
import axios from 'axios'

const ProfilePage = ({ user, posts }) => {
    const [profilePicture, setProfilePicture] = useState()

    if(!user) {
        return (
            <></>
        )
    }

    useEffect(() => {
        axios
            .post('/api/proxy/profile_picture', {username: user.username})
            .then((res) => {
                setProfilePicture(res.data.results[0].picture.large)
            })
            .catch(err => {
                console.log("error: " + err)
            })
    }, [])

    return (
        <>
            <div className={styles.imageBackground} />
            <div className={styles.container}>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar content={[{title: 'Posts', url: '/posts'}, {title: 'Groups', url: '/groups'}, {title: 'My Account', url: '/profile/'}]}/>
                <main className={styles.main}>
                    <h2>User profile</h2>
                    <section className={profileStyles.profile}>
                        <div style={{alignItems: 'center', display:'flex'}}>
                                
                                {profilePicture ? (
                                    <img style={{objectFit: 'cover', marginRight: '2em', boxShadow: '0px 0px 0.2em gray', borderRadius: '50%'}} src={profilePicture}></img>
                                ) : (
                                    <svg style={{objectFit: 'cover', marginRight: '2em', boxShadow: '0px 0px 0.2em gray', borderRadius: '50%'}} width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                                        <g class="layer">
                                            <ellipse cx="64.18181" cy="109.04545" fill="#000000" id="svg_5" rx="43.36364" ry="43.36364" stroke="#000000" stroke-width="5"/>
                                            <ellipse cx="64.1875" cy="31.10795" fill="#000000" id="svg_7" rx="22.44887" ry="22.44887" stroke="#000000" stroke-width="5"/>
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
                                    <p>Written {user?.noofposts} posts and articles</p>
                                </div>
                        </div>
                    </section>
                    <h2>Recent posts by this user</h2>
                    {posts && posts.length > 0 ? (
                        <div className={profileStyles.recentPostsContainer}>
                            {posts.map((post) => (
                                <section className={profileStyles.profile}>
                                    {post.postcontent.length > 250 ? (
                                        <>
                                            <h3>{post.posttitle}</h3>
                                            <p>
                                                Article with{' '}
                                                {
                                                    post.postcontent.split(' ')
                                                        .length
                                                }{' '}
                                                words
                                            </p>
                                            <a href={'/posts/' + post.id}>
                                                Read
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <h3>{post.posttitle}</h3>
                                            <p>{post.postcontent}</p>
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
    // console.log('request to getStaticProps')
    if (params.username.length <= 0) return { notFound: true }
    const pool = getDatabasePool()
    console.log(params)
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
        `SELECT *
         FROM posts
         WHERE userid = $1
         ORDER BY timestamp DESC
         LIMIT 3`,
        [user.id]
    )
    await pool.end()
    return {
        props: {
            user,
            posts: posts.map((post) => ({
                ...post,
                timestamp: post.timestamp.toString()
            }))
        }
    }
}

// this gets a list of all the users
export async function getStaticPaths() {
    const pool = getDatabasePool()
    const { rows } = await pool.query('SELECT username::text FROM users')
    await pool.end()
    return {
        paths: rows.map((row) => ({ params: row })),
        fallback: true
    }
}
