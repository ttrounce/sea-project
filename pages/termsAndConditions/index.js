import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import termsStyles from '../../styles/terms.module.css'

export default function Terms() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Campus Connect</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div>
                    <h1 className={styles.title}>
                        <a href={'/'}>Campus Connect</a>
                    </h1>
                    <div className={termsStyles.card}>
                        <div className={termsStyles.subtitle}>Terms and Conditions</div>
                        <h3 className={termsStyles.date}>
                            Last updated: 06/03/2021
                        </h3>
                        <p1 className={termsStyles.description}>
                            These terms and conditions apply to your access and use of Campus Connect. Please read them<br></br>
                            carefully.
                        </p1>
                        <hr></hr>
                        <div className={termsStyles.subtitle}>Accepting terms</div>
                        <p1 className={termsStyles.description}>
                            If you access or use this service, you are agreeing to uphold all of the terms below. If you do not<br></br>
                            agree then please do not use the service.
                        </p1>
                        <hr></hr>
                        <div className={termsStyles.subtitle}>Changes to terms</div>
                        <p1 className={termsStyles.description}>
                            At any point in time we reserve the right to modify and change these terms if, for example, we <br></br>
                            update or modify the app.
                        </p1>
                        <hr></hr>
                        <div className={termsStyles.subtitle}>Our Policies and Conduct</div>
                        <p1 className={termsStyles.description}>
                            Campus Connect will allow users to upload, interact and share posts and content, as a user you<br></br>
                            are responsible for content that you decide to make available. This includes ensuring your<br></br>
                            content is appropriate.
                        </p1> <br></br>
                        <p1 className={termsStyles.description}>
                            We reserve the right to restrict, modify and delete any content you upload if we deem it<br></br>
                            innapropriate. Content must not:
                        </p1>
                        <li className={termsStyles.description}>Contain harmful links, viruses or corrupted data.</li>
                        <li className={termsStyles.description}>Be derogatory, innapropriate or negatively targetted at any group.</li>
                        <li className={termsStyles.description}>Contrain personal or private information such as email addresses.</li>
                        <hr></hr>
                        <div className={termsStyles.subtitle}>Boring legal stuff</div>
                        <p1 className={termsStyles.description}>
                            At no stage are we legally liable for anything.
                        </p1>
                        <hr></hr>
                        <div className={termsStyles.subtitle}>Account Termination</div>
                        <p1 className={termsStyles.description}>
                            At any time we can and will terminate your account if we deem that you have broke any of these<br></br>
                            terms.
                        </p1> 
                    </div>
                </div>
            </main>
        </div>
    )
}