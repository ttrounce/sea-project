import axios from 'axios'
import React, { useState } from 'react'
import customStyles from '../../styles/custom.module.css'
import { useRouter } from 'next/router'

export default function Register() {
    const [username, setUsername] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const router = useRouter()
    const [responseMessage, setResponse] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()

        if (password !== passwordConfirmation) {
            setPasswordMessage('Your passwords do not match')
            return
        }
        axios
            .post(`/api/register`, {
                username: username,
                firstname: firstname,
                lastname: lastname,
                email: email,
                pass: password
            })
            .then((res) => {
                setResponse('Successfully registered')
            })
            .then(() => router.push('/login'))
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
                    name="firstname"
                    className={customStyles.input}
                    placeholder="First name"
                    onChange={(e) => setFirstname(e.target.value)}></input>
            </div>
            <div>
                <input
                    name="lastname"
                    className={customStyles.input}
                    placeholder="Last name"
                    onChange={(e) => setLastname(e.target.value)}></input>
            </div>
            <div>
                <input
                    name="email"
                    className={customStyles.input}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <p></p>
            <div>
                <input
                    name="password"
                    type="password"
                    className={customStyles.input}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}></input>
            </div>
            <div>
                <input
                    name="confirm-password"
                    type="password"
                    className={customStyles.input}
                    placeholder="Confirm Password"
                    onChange={(e) =>
                        setPasswordConfirmation(e.target.value)
                    }></input>
            </div>
            <p>{passwordMessage}</p>
            <div>
                <button className={customStyles.button}>Register</button>
            </div>
            <p>{responseMessage}</p>
        </form>
    )
}
