import axios from 'axios'
import React, { useState } from 'react'
import customStyles from '../../styles/custom.module.css'

function submit(event, setResponse, setPasswordMessage) {
    event.preventDefault()
    const data = new FormData(event.target)
    // Encased in JSX to autosanitize.
    const username = data.get('username')
    const password = data.get('password')
    const confirmPassword = data.get('confirm-password')
    const email = data.get('email')
    const firstname = data.get('firstname')
    const lastname = data.get('lastname')

    if (password !== confirmPassword) {
        setPasswordMessage('Your passwords do not match')
        return
    }
    setPasswordMessage('')

    axios
        .post(`http://127.0.0.1:3000/api/register`, {
            username: username,
            firstname: firstname,
            lastname: lastname,
            email: email,
            pass: password
        })
        .then((res) => {
            setResponse('Successfully registered')
        })
        .catch((err) => {
            if (err.response.status == 422) {
                if (err.response.data.type == 'validation') {
                    switch (err.response.data.field) {
                        case 'username':
                            setResponse('Please enter a valid username')
                            break
                        case 'email':
                            setResponse('Please enter a valid email')
                            break
                        case 'firstname':
                            setResponse(
                                'Please enter a first name of length 1 to 32'
                            )
                            break
                        case 'lastname':
                            setResponse(
                                'Please enter a last name of length 1 to 32'
                            )
                            break
                        case 'password':
                            setResponse(
                                'Please enter a valid password of length 6-32'
                            )
                            break
                    }
                } else if (err.response.data.type == 'preexisting') {
                    setResponse(err.response.data.message)
                }
            } else {
                setResponse(err.response.data.message)
            }
        })
}

export default function Register() {
    const [response, setResponse] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    return (
        <form onSubmit={(e) => submit(e, setResponse, setPasswordMessage)}>
            <div>
                <input
                    name="username"
                    className={customStyles.input}
                    placeholder="Username"></input>
            </div>
            <div>
                <input
                    name="firstname"
                    className={customStyles.input}
                    placeholder="First name"></input>
            </div>
            <div>
                <input
                    name="lastname"
                    className={customStyles.input}
                    placeholder="Last name"></input>
            </div>
            <div>
                <input
                    name="email"
                    className={customStyles.input}
                    placeholder="Email"></input>
            </div>
            <p></p>
            <div>
                <input
                    name="password"
                    type="password"
                    className={customStyles.input}
                    placeholder="Password"></input>
            </div>
            <div>
                <input
                    name="confirm-password"
                    type="password"
                    className={customStyles.input}
                    placeholder="Confirm Password"></input>
            </div>
            <p>{passwordMessage}</p>
            <div>
                <button className={customStyles.button}>Register</button>
            </div>
            <p>{response}</p>
        </form>
    )
}
