import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import profileStyles from '../../styles/profile.module.css'
import Navbar from '../../components/Navbar/Navbar'
import { signOut, useSession } from 'next-auth/client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Profile() {
    const [session, loading] = useSession()
    const [user, setUserData] = useState()
    const [posts, setUserPosts] = useState()
    const [profilePicture, setProfilePicture] = useState()
    const router = useRouter()

    useEffect(() => {
        if (session && !user) {
            // if session is available, get the user's information and display it.
            axios
                .post('/api/profile/get_id', {
                    username: session.user.name,
                    email: session.user.email
                })
                .then((res) => {
                    const id = res.data.id
                    axios
                        .post('/api/profile/get_profile', {
                            userid: id
                        })
                        .then((res) => {
                            res.data.id = id
                            setUserData(res.data)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    axios
                        .post('/api/posts/get_user_posts', {
                            userid: res.data.id
                        })
                        .then((res) => {
                            setUserPosts(res.data)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log(err)
                })

            axios
                .post('/api/proxy/profile_picture', {
                    username: session.user.name
                })
                .then((res) => {
                    setProfilePicture(res.data.results[0].picture.large)
                })
                .catch((err) => {
                    console.log('error: ' + err)
                })
        }
    }, [session, user])

    if (loading || (session && !user)) {
        return <></>
    }

    return (
        <>
            {!session && (
                <>
                    <div className={styles.skylineBackground} />
                    <div className={styles.container}>
                        <Head>
                            <title>Campus Connect</title>
                            <link rel="icon" href="/favicon.ico" />
                        </Head>
                        <Navbar
                            content={[
                                { title: 'Posts', url: '/posts' },
                                { title: 'Groups', url: '/groups' },
                                { title: 'Log In', url: '/login' },
                                { title: 'Register', url: '/register' }
                            ]}
                        />
                        <main className={styles.main}>
                            <h1 className={styles.title}>
                                <a href={'/'}>Campus Connect Profile</a>
                            </h1>

                            <p className={styles.description}>
                                View your profile or browse other students
                                public profiles
                            </p>

                            <section className={profileStyles.profile}>
                                <h2>You are not Logged in</h2>
                                <p>
                                    Have an account?{' '}
                                    <a
                                        className={profileStyles.link}
                                        href="/login">
                                        Log in
                                    </a>
                                </p>
                                <p>
                                    Don't have an account yet?{' '}
                                    <a
                                        className={profileStyles.link}
                                        href="/register">
                                        Register
                                    </a>
                                </p>
                            </section>
                        </main>
                        <footer className={styles.footer}>
                            Programmed by Brian Evans, Adam Tweedie, Alex
                            Rundle, Toby Trounce and Matthew Hudson
                        </footer>
                    </div>
                </>
            )}
            {session && (
                <>
                    <div className={styles.skylineBackground} />
                    <div className={styles.container}>
                        <Head>
                            <title>Campus Connect</title>
                            <link rel="icon" href="/favicon.ico" />
                        </Head>
                        <Navbar
                            content={[
                                { title: 'Posts', url: '/posts' },
                                { title: 'Groups', url: '/groups' },
                                { title: 'My Account', url: '/profile/' }
                            ]}
                        />
                        <main className={styles.main}>
                            <h2>Your profile</h2>
                            <section className={profileStyles.profile}>
                                <div
                                    style={{
                                        alignItems: 'center',
                                        display: 'flex'
                                    }}>
                                    {profilePicture ? (
                                        <img
                                            style={{
                                                objectFit: 'cover',
                                                marginRight: '2em',
                                                boxShadow: '0px 0px 0.2em gray',
                                                borderRadius: '50%'
                                            }}
                                            src={profilePicture}></img>
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
                                            <g>
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
                                            {new Date(
                                                user?.signup_date
                                            ).toDateString()}
                                        </p>
                                        <p>
                                            Written {user?.noofposts} posts and
                                            articles
                                        </p>
                                    </div>
                                </div>
                                <a href={'/profile/' + user?.username}>
                                    View profile as visitor
                                </a>
                                <button
                                    className={profileStyles.delete_button}
                                    onClick={() => {
                                        const confirmation = confirm(
                                            'Are you sure you want to delete your account? This action is irreversible.'
                                        )
                                        if (confirmation) {
                                            deleteUser(user?.id).then(() => {
                                                signOut()
                                                router.push('/')
                                            })
                                        }
                                    }}>
                                    Delete Account
                                </button>
                                <button
                                    className={profileStyles.logout_button}
                                    onClick={() => {
                                        const confirmation = confirm(
                                            'Are you want to log out?'
                                        )
                                        if (confirmation) {
                                            signOut()
                                            router.push('/')
                                        }
                                    }}>
                                    Log out
                                </button>
                            </section>
                            <h2>Your recent posts</h2>
                            {posts && posts.length > 0 ? (
                                <div
                                    className={
                                        profileStyles.recentPostsContainer
                                    }>
                                    {posts.map((post, index) => (
                                        <section
                                            className={profileStyles.profile}
                                            key={index}>
                                            {post.postcontent.length > 250 ? (
                                                <>
                                                    <h3>{post.posttitle}</h3>
                                                    <p>
                                                        Article with{' '}
                                                        {
                                                            post.postcontent.split(
                                                                ' '
                                                            ).length
                                                        }{' '}
                                                        words
                                                    </p>
                                                    <a
                                                        href={
                                                            '/posts/' + post.id
                                                        }>
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
                                    <h3>No recent posts</h3>
                                </section>
                            )}
                        </main>

                        <footer className={styles.footer}>
                            Programmed by Brian Evans, Adam Tweedie, Alex
                            Rundle, Toby Trounce and Matthew Hudson
                        </footer>
                    </div>
                </>
            )}
        </>
    )
}

const deleteUser = (userid) => {
    return axios.post(`/api/profile/delete_profile`, {
        userid: userid
    })
}
