import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import customStyles from '../../styles/custom.module.css'

import LoginComponent from './LoginComponent'

export default function Login() {
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
                    <p className={styles.description}>
                        Welcome back! <br></br>
                        Not got an account? <a href={'/register'}>Register now.</a>
                    </p>
                    <div className={customStyles.card}>
                        <div className={customStyles.subtitle}>Login</div>
                        <LoginComponent />
                    </div>
                </div>
            </main>
        </div>
    )
}
