import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import postStyles from '../../styles/post.module.css'

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
                    <a href={'/'}>Campus Connect Posts</a>
                </h1>

                <p className={styles.description}>
                    View posts from other students
                </p>
                <article className={postStyles.post}>
                    {router.isFallback ? (
                        <h3>Loading...</h3>
                    ) : (
                        <>
                            <h2 className={postStyles.title}>{post.title}</h2>
                            <h3 className={postStyles.author}>{post.author}</h3>
                            <h3 className={postStyles.date}>
                                {new Date(post.timestamp).toDateString()}
                            </h3>
                            <p>{post.body}</p>
                        </>
                    )}
                </article>
            </main>
        </div>
    )
}

export default PostPage

export async function getStaticProps() {
    //todo: get post from database depending on id
    return {
        props: {
            post: {
                title: 'January exams',
                body: 'This is why exams are in January',
                author: 'Brian Evans',
                timestamp: Date.now()
            }
        }
    }
}

export async function getStaticPaths() {
    //todo: get all posts from post table
    return {
        paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
        fallback: true
    }
}
