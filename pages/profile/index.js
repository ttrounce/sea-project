import Head from 'next/head'
import styles from '../../styles/Home.module.css'

export default function Posts() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Campus Connect</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <a href={'/'}>Campus Connect Profile</a>
                </h1>

                <p className={styles.description}>
                    View your profile or browse other students public profiles
                </p>

                <div className={styles.grid}>
                    <a href="" className={styles.card}>
                        <h3>Bobby Bobson</h3>
                        <p>A 6th year student :)</p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                Programmed by Brian Evans, Adam Tweedie, Alex Rundle, Toby
                Trounce and Matthew Hudson
            </footer>
        </div>
    )
}
