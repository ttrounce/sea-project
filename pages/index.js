import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Navbar from "../components/Navbar/Navbar"
import { useSession } from 'next-auth/client'

export default function Home() {
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
                        <a href={'/'}>Welcome to Campus Connect</a>
                    </h1>
                    <p className={styles.description}>
                        Get started by <a href={'/register'}>registering</a> or{' '}
                        <a href={'/login'}>logging in</a>
                    </p>

                    <div className={styles.grid}>
                        <a href="/groups" className={styles.card}>
                            <h3>Groups</h3>
                            <p>
                                Find in-depth information about your course in a
                                group run by your peers
                            </p>
                        </a>

                        <a href="/profile" className={styles.card}>
                            <h3>Profile</h3>
                            <p>Create a profile and view other users</p>
                        </a>

                        <a href="/posts" className={styles.card}>
                            <h3>Posts</h3>
                            <p>View posts by subject</p>
                        </a>

                        <a href="/wellbeing" className={styles.card}>
                            <h3>Wellbeing</h3>
                            <p>
                                Manage your wellbeing with metrics and statistics
                                reporting
                            </p>
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
