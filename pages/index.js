import Head from 'next/head'
import styles from '../styles/Home.module.css'
import indexStyles from '../styles/index.module.css'
import Navbar from './components/Navbar/Navbar'
import { useSession } from 'next-auth/client'

export default function Home() {
    const [session, loading] = useSession()
    if (loading) {
        return <></>
    }
    return (
        <>
            <div className={indexStyles.imageBackground} />
            <div className={indexStyles.gradientBackground} />
            <div>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <div className={indexStyles.navbarWrapper}>
                    {!session && (
                        <>
                            <Navbar
                                content={[
                                    { title: 'Posts', url: '/posts' },
                                    { title: 'Groups', url: '/groups' },
                                    { title: 'Log In', url: '/login' },
                                    { title: 'Register', url: '/register' }
                                ]}
                            />
                        </>
                    )}
                    {session && (
                        <>
                            <Navbar
                                content={[
                                    { title: 'Posts', url: '/posts' },
                                    { title: 'Groups', url: '/groups' },
                                    { title: 'My Account', url: '/profile' }
                                ]}
                            />
                        </>
                    )}
                </div>
                <div className={indexStyles.container}>
                    <main className={indexStyles.main}>
                        <div className={indexStyles.tiles}>
                            <a className={indexStyles.tile} href={'/posts'}>
                                <h3>Trending posts</h3>
                                <p>
                                    See todays trending insights, comments, and
                                    anything Exeter related. Posted by students
                                    and academics
                                </p>
                            </a>
                            <a className={indexStyles.tile} href={'/articles'}>
                                <h3>Articles</h3>
                                <p>
                                    Read articles written by your peers such as
                                    notes and study resources
                                </p>
                            </a>
                            <a className={indexStyles.tile} href={'/groups'}>
                                <h3>Groups</h3>
                                <p>
                                    Find articles specific to your subject, such
                                    as computer science or biology
                                </p>
                            </a>
                            <a className={indexStyles.tile} href={'/wellbeing'}>
                                <h3>Well being</h3>
                                <p>
                                    Be mindful of your wellbeing to avoid
                                    burnout and stress
                                </p>
                            </a>
                        </div>
                    </main>

                    <aside className={indexStyles.sidebar}>
                        <a className={indexStyles.myProfile} href={'/profile'}>
                            <img
                                src={'/static/sunglasses_emoji.png'}
                                className={indexStyles.sunglasses}
                            />
                            My Profile
                        </a>
                    </aside>
                </div>

                <footer className={styles.footer}>
                    Programmed by Brian Evans, Adam Tweedie, Alex Rundle, Toby
                    Trounce and Matthew Hudson
                </footer>
            </div>
        </>
    )
}
