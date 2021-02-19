import Head from "next/head";
import styles from "../../styles/Home.module.css";

export default function Groups() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Campus Connect</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <h1 className={styles.title}>
            {' '}
            <a href={'/'}>Campus Connect Groups</a>
          </h1>

          <p className={styles.description}>
            View student-created groups from different courses
          </p>

          <div className={styles.grid}>
            <a href="" className={styles.card}>
              <h3>Computer Science</h3>
              <p>Run by David Wakeling himself</p>
            </a>

            <a href="" className={styles.card}>
              <h3>Psychology</h3>
              <p>Social sciences with a focus on brain activity</p>
            </a>

            <a href="" className={styles.card}>
              <h3>Economics</h3>
              <p>Discuss your view on the economy</p>
            </a>

            <a href="" className={styles.card}>
              <h3>History</h3>
              <p>A group discussion for students history notes</p>
            </a>
          </div>
        </main>

        <footer className={styles.footer}>
          Programmed by Brian Evans, Adam Tweedie, Alex Rundle, Toby Trounce and
          Matthew Hudson
        </footer>
      </div>
  )
}
