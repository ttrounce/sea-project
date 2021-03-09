import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Navbar from "../../components/Navbar/Navbar"
import { useSession } from 'next-auth/client'

export default function Posts() {
    const [session, loading] = useSession()
    if (loading) {
        return <></>
    }
    return (
        <>
            <div className={styles.imageBackground} />
            <div className={styles.container}>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <>
                    {!session && <>
                        <Navbar content={[{title: 'Posts', url: '/posts'}, {title: 'Groups', url: '/groups'}, {title: 'Log In', url: '/login'}, {title: 'Register', url: '/register'}]}/>
                    </>}
                    {session && <>
                        <Navbar content={[{title: 'Posts', url: '/posts'}, {title: 'Groups', url: '/groups'}, {title: 'My Account', url: '/profile'}]}/>
                    </>}
                </>
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
        </>
    )
}
