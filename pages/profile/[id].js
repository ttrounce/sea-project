import { useRouter } from 'next/router'
import { getDatabasePool } from '../../database/db-connect'
import styles from '../../styles/Home.module.css'
import profileStyles from '../../styles/profile.module.css'
import Head from 'next/head'
import Navbar from "../components/Navbar/Navbar"
import { signOut } from 'next-auth/client'

const ProfilePage = ({ user, posts }) => {
    const router = useRouter()
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
                    <h1 className={styles.title}>
                        <a href={'/'}>Campus Connect Profile</a>
                    </h1>

                    <p className={styles.description}>
                        View your profile or browse other students public
                        profiles
                    </p>

                    <section className={profileStyles.profile}>
                        <h3>
                            {user?.firstname} {user?.surname}
                        </h3>
                        <p>Username: {user?.username}</p>
                        <p>
                            User since{' '}
                            {new Date(user?.signup_date).toDateString()}
                        </p>
                        <p>Written {user?.noofposts} posts and articles</p>

                        <button 
                            className={profileStyles.delete_button}
                            onClick={() => {
                                const confirmation = confirm('Are you sure you want to delete your account?')
                                if (confirmation) {
                                    deleteUser(user?.id).then(() =>
                                        router.push('/profile')
                                    )
                                }
                            }}>
                            Delete Account
                        </button>
                    </section>
                    <h2>Recent posts by this user</h2>
                    {posts ? (
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

const deleteUser = (userid) => {
    return fetch(`${process.env.NEXT_PUBLIC_SELF_URL}/api/profile/delete_profile`, {
        method: 'POST',
        body: JSON.stringify({ userid }),
        headers: { 'Content-type': 'application/json'}
    })
}

export async function getStaticProps({ params }) {
    // console.log('request to getStaticProps')
    if (isNaN(params.id)) return { notFound: true }
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
            WHERE u.id = $1
              AND r.roleid = u.roleid
            GROUP BY u.username, u.id, u.firstname, u.surname, u.email, u.signup_date, r.rolename;
        `,
        [params.id]
    )
    // console.log(users, userCount)
    if (userCount !== 1) return { notFound: true }
    const { rows: posts } = await pool.query(
        `SELECT *
         FROM posts
         WHERE userid = $1
         ORDER BY timestamp DESC
         LIMIT 3`,
        [params.id]
    )
    const user = users[0]
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
    const { rows } = await pool.query('SELECT id::text FROM users')
    await pool.end()
    return {
        paths: rows.map((row) => ({ params: row })),
        fallback: true
    }
}
