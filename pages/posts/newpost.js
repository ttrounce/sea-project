import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import postStyles from '../../styles/post.module.css'
import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs as SyntaxHighlightStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import axios from 'axios'
import { useSession } from 'next-auth/client'

const PostPage = ({ groups }) => {
    const {
        query: { post_id, group: group_id }
    } = useRouter()
    const [editingTitle, setEditingTitle] = useState(false)
    const [editingContent, setEditingContent] = useState(false)
    const [isEditing] = useState(post_id !== undefined)
    const [title, setTitle] = useState()
    const [content, setContent] = useState()
    const [group, setGroup] = useState(groups[0].id)
    const [errorMessage, setErrorMessage] = useState()
    const [successMessage, setSuccessMessage] = useState()
    const [currentUserName, setCurrentUsername] = useState()
    const router = useRouter()
    const [session, loading] = useSession()
    useEffect(() => {
        if (!loading) setCurrentUsername(session.user.username)
    }, [loading])
    useEffect(() => setGroup(group_id ?? groups[0].id), [group_id])
    useEffect(() => {
        if (isEditing) {
            // fetch(`http://localhost:3000/api/posts/get_post?post_id=${post_id}`)
            axios
                .get(`/api/posts/get_post`, { params: { post_id } })
                .then(async (r) => {
                    if (r.status === 200) {
                        const post = r.data
                        setTitle(post.posttitle)
                        setContent(post.postcontent)
                    }
                })
                .catch((e) => console.log(e))
        }
    }, [])

    const renderers = {
        code: ({ language, value }) => {
            return (
                <SyntaxHighlighter
                    style={SyntaxHighlightStyle}
                    language={language}
                    children={value}
                />
            )
        }
    }
    return (
        <>
            <div className={styles.imageBackground} />

            <div className={styles.container}>
                <Head>
                    <title>Campus Connect</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Navbar
                    content={[
                        { title: 'Posts', url: '/posts' },
                        { title: 'Groups', url: '/groups' },
                        { title: 'Log In', url: '/login' },
                        { title: 'Register', url: '/register' }
                    ]}
                />
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
                                    {title || 'Type your title here'}
                                </kbd>
                            )}
                        </h2>

                        <h3 className={postStyles.subtitle}>
                            {'Written by '}
                            <span className={postStyles.author}>
                                {currentUserName}
                            </span>
                            {' on '}
                            <span className={postStyles.date}>
                                {new Date().toDateString()}
                            </span>
                        </h3>

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
                            <div onClick={() => setEditingContent(true)}>
                                <ReactMarkdown renderers={renderers}>
                                    {content ||
                                        `
### Type your new post here!

You can use markdown in your post for styling.

You can use ** for **bold**, and * for *italics*.

Backticks (\`) for inline code :

\`var x = 5\`

Triple tilde (\~\~\~) for code blocks with syntax highlighting
~~~python
def python():
    print("Hello World!")
~~~
#### \`####\`  hashes for headings

\`![title](image/url.jpeg)\` for images

                                        `}
                                </ReactMarkdown>
                            </div>
                        )}
                        <select
                            className={postStyles.newPostGroup}
                            value={group}
                            onChange={(v) => setGroup(v.target.value)}>
                            {groups?.map((group) => (
                                <option value={group.id} key={group.id}>
                                    {group.groupname}
                                </option>
                            ))}
                        </select>
                        <p>
                            Your post is {content?.length} characters and
                            classifies as a
                            {content?.length < 250 ? ' post' : 'n article'}
                        </p>
                        <button
                            className={postStyles.submit}
                            onClick={() =>
                                submitPost(
                                    title,
                                    content,
                                    95,
                                    group,
                                    post_id
                                ).then(async (r) => {
                                    const message = await r.json()
                                    console.log(message)
                                    if (r.status !== 200)
                                        setErrorMessage(
                                            'Could not post: ' + message.message
                                        )
                                    else {
                                        setSuccessMessage(message.message)
                                        await router.push(
                                            '/posts/' + message.post_id
                                        )
                                    }
                                })
                            }>
                            Submit{' '}
                            {isEditing
                                ? 'edit'
                                : content?.length < 250
                                ? 'post'
                                : 'article'}{' '}
                            for review
                        </button>
                        <a
                            href={'/posts'}
                            className={postStyles.cancelpostlink}>
                            Cancel
                        </a>
                        <p style={{ color: 'crimson' }}>{errorMessage}</p>
                        <p style={{ color: 'forestgreen' }}>{successMessage}</p>
                    </article>
                </main>
            </div>
        </>
    )
}

export default PostPage

const submitPost = (title, content, user, group, post_id) => {
    if (post_id)
        return fetch('http://localhost:3000/api/posts/edit', {
            method: 'POST',
            body: JSON.stringify({ title, content, user, group, post_id }),
            headers: { 'Content-type': 'application/json' }
        })
    else
        return fetch('http://localhost:3000/api/posts/new', {
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
    await pool.end()
    return {
        props: {
            groups
        }
    }
}
