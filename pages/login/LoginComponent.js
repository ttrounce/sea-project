import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import customStyles from '../../styles/custom.module.css'

export default function Login() {
    const router = useRouter()
    const [response, setResponse] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()

        const res = signIn('username-login', {
            callbackUrl: `/login`,
            redirect: false,
            username,
            password
        })
        res.then((res) => {
            if (res.status == 401)
                setResponse('Username or password is incorrect')
            if (res.status == 200) router.push('/')
        })
    }

    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <div>
                <input
                    name="username"
                    className={customStyles.input}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}></input>
            </div>
            <div>
                <input
                    name="password"
                    type="password"
                    className={customStyles.input}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <div>
                <button className={customStyles.button}>Login</button>
            </div>
            <h5>{response}</h5>
        </form>
    )
}
