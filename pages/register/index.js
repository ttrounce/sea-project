import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import customStyles from '../../styles/custom.module.css'
import termsStyles from '../../styles/terms.module.css'
import Navbar from "../components/Navbar/Navbar"

import RegisterComponent from './RegisterComponent'

export default function Login() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Campus Connect</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
<<<<<<< HEAD
            <main className={styles.main}>
                <div className={styles.container}>
                    <h1 className={styles.title}>
                        <a href={'/'}>Campus Connect</a>
                    </h1>
                    <p className={styles.description}>
                        Get started by registering! <br></br>
                        Already got an account? <a href={'/login'}>Log in.</a>
                    </p>
                    <div className={customStyles.card}>
                        <div className={customStyles.subtitle}>Register</div>
                        <RegisterComponent />
                    </div>
                    <p className={termsStyles.smallLink}>
                        <a href={'/termsAndConditions'}>Terms and Conditions.</a>
                    </p>
=======
            <Navbar />
            <div className={styles.main}>
                <h1 className={styles.title}>
                    <a href={'/'}>Campus Connect</a>
                </h1>
                <p className={styles.description}>
                    Get started by registering! <br></br>
                    Already got an account? <a href={'/login'}>Log in.</a>
                </p>
                <div className={customStyles.card}>
                    <div className={customStyles.subtitle}>Register</div>
                    <RegisterComponent />
>>>>>>> b51ba1f345ea8daeb6a9bb9de951d7a9022f49d9
                </div>
            </div>
        </div>
    )
}
