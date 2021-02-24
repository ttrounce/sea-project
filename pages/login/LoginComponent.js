import axios from 'axios'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import customStyles from '../../styles/custom.module.css'

function submit(event, responseFunc) {
    event.preventDefault()
    const data = new FormData(event.target)

    axios
        .post(`http://127.0.0.1:3000/api/login`, {
            username: data.get('username'),
            pass: data.get('password')
        })
        .then((res) => {
            responseFunc('Successfully logged in')
        })
        .catch((err) => {
            if (err.response.status == 422) {
                if (err.response.data.type == 'validation') {
                    switch (err.response.data.field) {
                        case 'username':
                            responseFunc('Please enter a valid username')
                            break
                        case 'password':
                            responseFunc('Please enter a valid password')
                            break
                    }
                }
            } else {
                responseFunc(err.response.data.message)
            }
        })
}

export default function Login() {
    const [response, setResponse] = useState('')
    return (
        <form onSubmit={(e) => submit(e, setResponse)}>
            <div>
                <input
                    name="username"
                    className={customStyles.input}
                    placeholder="Username"></input>
            </div>
            <div>
                <input
                    name="password"
                    type="password"
                    className={customStyles.input}
                    placeholder="Password"></input>
            </div>
            <div>
                <button className={customStyles.button}>Login</button>
            </div>
            <h5>{response}</h5>
        </form>
    )
}
