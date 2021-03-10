import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import customStyles from '../../styles/custom.module.css'

import { signOut, useSession } from 'next-auth/client'

import Login from './LoginComponent'
import Navbar from '../../components/Navbar/Navbar'

export default function LoginPage() {
    const [session, loading] = useSession()
    if (loading) {
        return <></>
    }
    return (
        <>
            <div className={styles.exeterStoneBackground} />
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
                                    { title: 'Articles', url: '/articles' },
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
                                    { title: 'Articles', url: '/articles' },
                                    { title: 'Posts', url: '/posts' },
                                    { title: 'Groups', url: '/groups' },
                                    { title: 'My Account', url: '/profile' }
                                ]}
                            />
                        </>
                    )}
                </>
                <main className={styles.main}>
                    <div className={styles.container}>
                        <h1 className={styles.title}>
                            <a href={'/'}>Campus Connect</a>
                        </h1>
                        <>
                            {!session && (
                                <>
                                    <p className={styles.description}>
                                        Welcome back! <br></br>
                                        Not got an account?{' '}
                                        <a href={'/register'}>Register now.</a>
                                    </p>
                                    <div className={customStyles.card}>
                                        <div className={customStyles.subtitle}>
                                            Login
                                        </div>
                                        <Login />
                                    </div>
                                </>
                            )}
                            {session && (
                                <>
                                    <p className={styles.description}>
                                        You are already logged in as{' '}
                                        <b>{session.user.name}</b>! Click below
                                        to log out.
                                    </p>
                                    <button
                                        className={customStyles.button}
                                        onClick={(e) => {
                                            signOut()
                                        }}>
                                        Log out
                                    </button>
                                </>
                            )}
                        </>
                    </div>
                </main>
            </div>
        </>
    )
}
