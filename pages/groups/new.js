import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../../components/Navbar/Navbar'
import { useSession } from 'next-auth/client'

const NewGroup = ({ groups }) => {
    const [name, setName] = useState()
    const [description, setDescription] = useState()
    const [errorMessage, setErrorMessage] = useState()
    const router = useRouter()
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
                        Create a new group for articles
                    </p>
                    <div>
                        <p>
                            This styling is a work in progress, but the page is
                            functional
                        </p>
                        <input
                            placeholder={'Group name...'}
                            value={name}
                            onChange={(v) => setName(v.target.value)}
                        />
                        <textarea
                            placeholder={'Group description'}
                            value={description}
                            onChange={(v) => setDescription(v.target.value)}
                        />
                        <button
                            onClick={() =>
                                submitNewGroup(name, description).then(
                                    async (r) => {
                                        const j = await r.json()
                                        if (r.status === 200) {
                                            alert(j.message)
                                            router.push('/groups/' + j.group_id)
                                        } else {
                                            setErrorMessage(j.message)
                                        }
                                    }
                                )
                            }>
                            Submit new group for review
                        </button>
                        <p style={{ color: 'crimson' }}>{errorMessage}</p>
                    </div>
                </main>
            </div>
        </>
    )
}
export default NewGroup
const submitNewGroup = (name, description) => {
    return fetch('http://localhost:3000/api/groups/new', {
        method: 'POST',
        body: JSON.stringify({ name, description }),
        headers: { 'Content-type': 'application/json' }
    })
}
