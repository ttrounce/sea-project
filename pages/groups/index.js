import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import groupStyles from '../../styles/groups.module.css'
import Navbar from '../components/Navbar/Navbar'
import { useSession } from 'next-auth/client'

export default function Groups({ groups }) {
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
                        <a href={'/'}>Campus Connect Groups</a>
                    </h1>

                    <p className={styles.description}>
                        View student-created groups from different courses
                    </p>
                    <a
                        href={'/groups/new'}
                        className={groupStyles.newGroupLink}>
                        New group
                    </a>

                    <div className={groupStyles.groupsContainer}>
                        {groups?.map((group) => (
                            <a
                                className={groupStyles.group}
                                href={'/groups/' + group.id}>
                                <h3>{group.name}</h3>
                                <p>{group.description}</p>
                                <p>
                                    {group.num_posts} article
                                    {group.num_posts == 1 ? '' : 's'}
                                </p>
                            </a>
                        ))}
                        {/*below here is only test groups. must be removed*/}
                        <a className={groupStyles.group}>
                            <h3>Computer Science</h3>
                            <p>Run by David Wakeling himself</p>
                        </a>

                        <a className={groupStyles.group}>
                            <h3>Psychology</h3>
                            <p>
                                Social sciences with a focus on brain activity
                            </p>
                        </a>

                        <a className={groupStyles.group}>
                            <h3>Economics</h3>
                            <p>Discuss your view on the economy</p>
                        </a>

                        <a className={groupStyles.group}>
                            <h3>History</h3>
                            <p>A group discussion for students history notes</p>
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

export async function getStaticProps() {
    const { getDatabasePool } = require('../../database/db-connect')
    const pool = getDatabasePool()
    const { rows: groups } = await pool.query(
        `
            SELECT g.id,
                   g.groupname          AS name,
                   g.groupdesc          AS description,
                   COUNT(DISTINCT p.id) AS num_posts
            FROM groups g,
                 posts p
            WHERE p.groupid = g.id
              AND LENGTH(p.postcontent) > 250
            GROUP BY g.id, g.groupname, g.groupdesc;
        `
    )
    return {
        props: {
            groups
        }
    }
}
