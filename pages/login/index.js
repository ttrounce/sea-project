import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import customStyles from '../../styles/custom.module.css'

import { signOut, useSession } from 'next-auth/client'

import Login from './LoginComponent'

export default function LoginPage() {
    const [session, loading] = useSession()
    if(loading)
    {
        return <></>
    }
    return (
        <div>
            <Head>
                <title>Campus Connect</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>
                        <a href={'/'}>Campus Connect</a>
                    </h1>
                    <>
                        {!session && <>
                            <p className={styles.description}>
                                Welcome back! <br></br>
                                Not got an account?{' '}
                                <a href={'/register'}>Register now.</a>
                            </p>
                            <div className={customStyles.card}>
                                <div className={customStyles.subtitle}>Login</div>
                                <Login />
                            </div>
                        </>}
                        {session && <>
                            <p className={styles.description}>
                                You are already logged in as <b>{session.user.name}</b>! Click below to log out.
                            </p>
                            <button className={customStyles.button} onClick={(e) => {signOut()}}>Log out</button>
                        </>}
                    </>
                </div>
            </main>
        </div>
    )
}
