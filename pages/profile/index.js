import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import profileStyles from '../../styles/profile.module.css'
import Navbar from "../components/Navbar/Navbar"
import { useSession } from 'next-auth/client'

export default function Profile() {
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
                        <a href={'/'}>Campus Connect Profile</a>
                    </h1>

                    <p className={styles.description}>
                        View your profile or browse other students public
                        profiles
                    </p>

                    <section className={profileStyles.profile}>
                        <h2>View/edit your profile</h2>
                        <p>
                            This section can only be done when we have a
                            session/cookie/localStorage solution to access the
                            currently signed in user
                        </p>
                    </section>
                </main>

                <footer className={styles.footer}>
                    Programmed by Brian Evans, Adam Tweedie, Alex Rundle, Toby
                    Trounce and Matthew Hudson
                </footer>
            </div>
        </>
    )
}
