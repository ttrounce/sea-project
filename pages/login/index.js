import Head from "next/head";
import styles from "../../styles/Home.module.css";
import customStyles from "../../styles/custom.module.css";

export default function Login() {
    return (
        <div className={styles.container}>  
            <main className={styles.main}>
                <h1 className={styles.title}><a href={'/'}>Campus Connect</a></h1>
                <p className={styles.description}>Get started by logging in!</p>
                <div className={customStyles.card}>
                    <div className={customStyles.subtitle}>
                        Login
                    </div>
                    <div>
                        <div><input className={customStyles.input} placeholder='Username'></input></div>
                        <div><input className={customStyles.input} placeholder='Password'></input></div>
                        <div><button className={customStyles.button}>Login</button></div>
                    </div>
                </div>
            </main>
        </div>
    )
}
