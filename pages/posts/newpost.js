import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import postStyles from '../../styles/post.module.css'
import { useState } from 'react'

const PostPage = ({ groups }) => {
    const [editingTitle, setEditingTitle] = useState(false)
    const [editingContent, setEditingContent] = useState(false)
    const [title, setTitle] = useState('Type your title here')
    const [content, setContent] = useState('Type your article content here')
    const [group, setGroup] = useState(groups[0])
    const [errorMessage, setErrorMessage] = useState()
    return (
        <div className={styles.container}>
            <Head>
                <title>Campus Connect</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <a href={'/posts'}>Campus Connect Posts</a>
                </h1>

                <p className={styles.description}>Write a new post</p>
                <article className={postStyles.post}>
                    <h2>
                        {editingTitle ? (
                            <kbd>
                                <input
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    onBlur={() => setEditingTitle(false)}
                                    autoFocus
                                    onKeyPress={(k) =>
                                        setEditingTitle(k.key !== 'Enter')
                                    }
                                    className={postStyles.newtitle}
                                />
                            </kbd>
                        ) : (
                            <kbd onClick={() => setEditingTitle(true)}>
                                {title}
                            </kbd>
                        )}
                    </h2>

                    <h3 className={postStyles.subtitle}>
                        {'Written by '}
                        <span className={postStyles.author}>
                            {'currentUser'}
                        </span>
                        {' on '}
                        <span className={postStyles.date}>
                            {new Date().toDateString()}
                        </span>
                    </h3>

                    <p>
                        {editingContent ? (
                            <kbd>
                                <textarea
                                    value={content}
                                    onChange={(event) =>
                                        setContent(event.target.value)
                                    }
                                    onBlur={() => setEditingContent(false)}
                                    autoFocus
                                    className={postStyles.newcontent}
                                />
                            </kbd>
                        ) : (
                            <kbd onClick={() => setEditingContent(true)}>
                                {content}
                            </kbd>
                        )}
                    </p>
                    <select
                        value={group}
                        onChange={(v) => setGroup(v.target.value)}>
                        {groups?.map((group) => (
                            <option value={group.id}>{group.groupname}</option>
                        ))}
                    </select>
                    <br />
                    <button
                        className={postStyles.submit}
                        onClick={() =>
                            submitPost(title, content, undefined, group).then(
                                async (r) => {
                                    const message = await r.json()
                                    if (r.status !== 200)
                                        setErrorMessage(
                                            'Could not post: ' + message.message
                                        )
                                    else
                                        alert(
                                            'Reroute to posts/' +
                                                message.post_id
                                        )
                                }
                            )
                        }>
                        Submit post for review
                    </button>
                    <p style={{ color: 'crimson' }}>{errorMessage}</p>
                </article>
            </main>
        </div>
    )
}

export default PostPage

const submitPost = (title, content, user, group) => {
    return fetch('http://localhost:3000/api/post', {
        method: 'POST',
        body: JSON.stringify({ title, content, user, group }),
        headers: { 'Content-type': 'application/json' }
    })
}

export async function getStaticProps() {
    const { getDatabasePool } = require('../../database/db-connect')
    const pool = getDatabasePool()
    const { rows: groups } = await pool.query(
        'SELECT id, groupname FROM groups'
    )
    return {
        props: {
            groups
        }
    }
}
