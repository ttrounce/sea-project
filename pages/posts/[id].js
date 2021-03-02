import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import postStyles from '../../styles/post.module.css'
import { getDatabasePool } from '../../database/db-connect'
import { useState } from 'react'

const PostPage = ({ post }) => {
    const router = useRouter()
    const [currentUserName, setCurrentUsername] = useState('anonymous')
    //this needs updating when cookies/localStorage are working
    // setCurrentUsername(window.localStorage.getItem('fullname') || 'anonymous')
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

                <p className={styles.description}>
                    View posts from other students
                </p>
                <article className={postStyles.post}>
                    {router.isFallback ? (
                        <h3>Loading...</h3>
                    ) : post ? (
                        <>
                            <h2 className={postStyles.title}>{post.title}</h2>
                            <h3 className={postStyles.subtitle}>
                                {'Written by '}
                                <span className={postStyles.author}>
                                    {post.author}
                                </span>
                                {' on '}
                                <span className={postStyles.date}>
                                    {new Date(post.timestamp).toDateString()}
                                </span>
                            </h3>
                            <p>{post.body}</p>
                            <button
                                className={postStyles.delete_button}
                                onClick={() => deletePost(post.id)}>
                                Delete
                            </button>
                        </>
                    ) : (
                        <h3>Post does not exist</h3>
                    )}
                </article>
            </main>
        </div>
    )
}

export default PostPage

const deletePost = (post_id) => {
    return fetch('http://localhost:3000/api/posts/delete', {
        method: 'POST',
        body: JSON.stringify({ post_id }),
        headers: { 'Content-type': 'application/json' }
    })
}

export async function getStaticProps({ params }) {
    if (isNaN(params.id)) return { props: {} }
    const pool = getDatabasePool()
    const {
        rows: posts,
        rowCount: postCount
    } = await pool.query('SELECT * FROM posts WHERE id=$1', [params.id])
    if (postCount !== 1) return { props: {} }
    const post = posts[0]
    const {
        rows: users,
        rowCount: userCount
    } = await pool.query('SELECT * FROM users WHERE id=$1', [post.userid])
    if (userCount !== 1) return { props: {} }
    const user = users[0]
    return {
        props: {
            post: {
                title: post.posttitle,
                body: post.postcontent,
                author: user.firstname + ' ' + user.surname,
                timestamp: post.timestamp.toString(),
                id: post.id
            }
        }
    }
}

export async function getStaticPaths() {
    const pool = getDatabasePool()
    const { rows } = await pool.query('SELECT CAST(id AS text) FROM posts')
    return {
        paths: rows.map((row) => ({ params: row })),
        fallback: true
    }
}
