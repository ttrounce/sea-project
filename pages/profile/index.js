import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import profileStyles from '../../styles/profile.module.css'
import Navbar from "../components/Navbar/Navbar"
import { useSession } from 'next-auth/client'
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signOut } from 'next-auth/client'

export default function Profile() {
    const [session, loading] = useSession()
    const [user, setUserData] = useState()
    const [posts, setUserPosts] = useState()
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
        }
    }, [])
    
    if (loading) {
        return <>Loading...</>
    }

    if(session && (!user || !posts)) {
        return <>Retrieving user data...</>
    }

    return (
        <>
            {!session && <>
                <div className={styles.imageBackground} />
                <div className={styles.container}>
                    <Head>
                        <title>Campus Connect</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <Navbar content={[{title: 'Posts', url: '/posts'}, {title: 'Groups', url: '/groups'}, {title: 'Log In', url: '/login'}, {title: 'Register', url: '/register'}]}/>
                    <main className={styles.main}>
                        <h1 className={styles.title}>
                            <a href={'/'}>Campus Connect Profile</a>
                        </h1>

                        <p className={styles.description}>
                            View your profile or browse other students public
                            profiles
                        </p>

                        <section className={profileStyles.profile}>
                            <h2>You are not Logged in</h2>
                            <p>
                                Have an account? <a className={profileStyles.link} href='/login'>Log in</a>
                            </p>
                            <p>
                                Don't have an account yet? <a className={profileStyles.link} href='/register'>Register</a>
                            </p>
                        </section>
                    </main>
                    <footer className={styles.footer}>
                        Programmed by Brian Evans, Adam Tweedie, Alex Rundle, Toby
                        Trounce and Matthew Hudson
                    </footer>
                </div>
            </>}
            {session && <>
                <div className={styles.imageBackground} />
                <div className={styles.container}>
                    <Head>
                        <title>Campus Connect</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <Navbar content={[{title: 'Posts', url: '/posts'}, {title: 'Groups', url: '/groups'}, {title: 'My Account', url: '/profile/'}]}/>
                    <main className={styles.main}>
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
                                        console.log(user)
                                        deleteUser(user?.id).then(() => {
                                            signOut()
                                            router.push('/')
                                        })
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
            </>}
        </>
    )
}

const deleteUser = (userid) => {
    return axios.post(`${process.env.NEXT_PUBLIC_SELF_URL}/api/profile/delete_profile`, {
        userid: userid
    })
}
