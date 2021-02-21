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
                    {' '}
                    <a href={'/'}>Campus Connect Wellbeing</a>
                </h1>

                <p className={styles.description}>
                    View your well-being statistics
                </p>

                <div className={styles.grid}>
                    <a href="" className={styles.card}>
                        <h3>How are you feeling on a scale of 1 to 10?</h3>
                        <input type={'number'} />
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
