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
                    <a href={'/'}>Campus Connect Posts</a>
                </h1>

                <p className={styles.description}>
                    View posts from other students
                </p>

                <div className={styles.grid}>
                    <a href="" className={styles.card}>
                        <h3>The real reason exams are in January</h3>
                        <p>
                            An anonymous student exposes why academics have
                            chosen to put semester 1 exams starting on 4 January
                        </p>
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
