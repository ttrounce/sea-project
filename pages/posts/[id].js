import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import postStyles from '../../styles/post.module.css'
import { getDatabasePool } from '../../database/db-connect'

const PostPage = ({ post }) => {
    const router = useRouter()

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
                timestamp: post.timestamp.toString()
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
