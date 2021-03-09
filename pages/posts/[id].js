import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import postStyles from '../../styles/post.module.css'
import { getDatabasePool } from '../../database/db-connect'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs as SyntaxHighlightStyle } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useSession } from 'next-auth/client'

const PostPage = ({ post }) => {
    const router = useRouter()
    const [currentUserName, setCurrentUsername] = useState()
    const [session, loading] = useSession()
    const [reportButtonText, setReportButtonText] = useState("Report")
    useEffect(() => {
        if (!loading) setCurrentUsername(session?.user?.name)
    }, [loading])
    useEffect(() => {
        if (!loading) {
            fetch('/api/posts/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: post.id,
                    username: currentUserName,
                    timestamp: Date.now()
                })
            })
                .then((r) => console.log('pageview response', r.status)) // page view
                .catch((error) => console.error('Page view failed:', error))
        }
    }, [currentUserName])
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

                    <p className={styles.description}>
                        View posts from other students
                    </p>
                    <article className={postStyles.post}>
                        {router.isFallback ? (
                            <h3>Loading...</h3>
                        ) : post ? (
                            <>
                                <h2 className={postStyles.title}>
                                    {post.title}
                                </h2>
                                <h3 className={postStyles.subtitle}>
                                    {'Written by '}
                                    <a
                                        className={postStyles.author}
                                        href={'/profile/' + post.author_id}>
                                        {post.author}
                                    </a>
                                    {' on '}
                                    <span className={postStyles.date}>
                                        {new Date(
                                            post.timestamp
                                        ).toDateString()}
                                    </span>
                                </h3>
                                <ReactMarkdown renderers={renderers}>
                                    {post.body}
                                </ReactMarkdown>
                                <div className={postStyles.button_row}>
                                    <button
                                        className={postStyles.report_button}
                                        onClick={() => {
                                            if (reportButtonText == "Report") {
                                                reportPost(post.id, currentUserName)
                                                .then(async r => {
                                                    if (r.status === 200) {
                                                        setReportButtonText("Reported")
                                                    } else {
                                                        const message = await r.json()
                                                        alert(message.message)
                                                    }
                                                })  
                                            }  
                                        }}>
                                        { reportButtonText }
                                    </button>
                                    <button
                                        className={postStyles.edit_button}
                                        onClick={() => {
                                            router.push(
                                                '/posts/newpost/?post_id=' +
                                                    post.id
                                            )
                                        }}>
                                        Edit
                                    </button>
                                    <button
                                        className={postStyles.delete_button}
                                        onClick={() => {
                                            const confirmation = confirm(
                                                'Are you sure you want to delete your post?'
                                            )
                                            if (confirmation)
                                                deletePost(post.id).then(() =>
                                                    router.push('/posts')
                                                )
                                        }}>
                                        Delete
                                    </button>
                                </div>
                            </>
                        ) : (
                            <h3>Post does not exist</h3>
                        )}
                    </article>
                </main>
            </div>
        </>
    )
}

export default PostPage

const deletePost = (post_id) => {
    return fetch('/api/posts/delete', {
        method: 'POST',
        body: JSON.stringify({ post_id }),
        headers: { 'Content-type': 'application/json' }
    })
}

const reportPost = (post_id, currentUserName) => {
    return fetch('/api/posts/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            post_id: post_id,
            username: currentUserName
        })
    })
}

export async function getStaticProps({ params }) {
    if (isNaN(params.id)) return { notFound: true }
    const pool = getDatabasePool()
    const {
        rows: posts,
        rowCount: postCount
    } = await pool.query('SELECT * FROM posts WHERE id=$1', [params.id])
    if (postCount !== 1) return { notFound: true }
    const post = posts[0]
    const {
        rows: users,
        rowCount: userCount
    } = await pool.query('SELECT * FROM users WHERE id=$1', [post.userid])
    if (userCount !== 1) return { notFound: true }
    const user = users[0]
    await pool.end()
    return {
        props: {
            post: {
                title: post.posttitle,
                body: post.postcontent,
                author: user.firstname + ' ' + user.surname,
                author_id: user.id,
                timestamp: post.timestamp.toString(),
                id: post.id
            }
        },
        revalidate: 5
    }
}

export async function getStaticPaths() {
    const pool = getDatabasePool()
    const { rows } = await pool.query('SELECT CAST(id AS text) FROM posts')
    await pool.end()
    return {
        paths: rows.map((row) => ({ params: row })),
        fallback: true
    }
}
