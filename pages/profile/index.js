import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import profileStyles from '../../styles/profile.module.css'
import Navbar from "../components/Navbar/Navbar"
import { useSession } from 'next-auth/client'
import axios from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

export default function Profile() {
    const router = useRouter()
    const [session, loading] = useSession()
    const [responseMessage, setResponse] = useState('')
    if (loading) {
        return <></>
    }

    if (session) {
        axios
            .post('/api/profile/get_id', {
                username: session.user.name,
                email: session.user.email
            })
            .then((res) => {
                router.push('/profile/' + res.data.id)
            })
            .catch((err) => {
                setResponse(err.response.data.message)
            })
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
                <div className={styles.container}>
                    <Head>
                        <title>Campus Connect</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                </div>
            </>}
        </>
    )
}
