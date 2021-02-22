import axios from 'axios'
import React from 'react'
import customStyles from '../../styles/custom.module.css'

export default class RegisterComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = { response: '' }
    }

    handleSubmit(e) {
        e.preventDefault()
        const data = new FormData(e.target)
        // Encased in JSX to autosanitize.
        const username = <span>{data.get('username')}</span>
        const password = <span>{data.get('password')}</span>

        axios
            .post(`http://127.0.0.1:3000/api/register`, {
                username: data.get('username'),
                email: data.get('email'),
                pass: data.get('password')
            })
            .then((res) => {
                this.setState({ response: 'Successfully registered' })
            })
            .catch((err) => {
                if (err.response.status == 422) {
                    if (err.response.data.type == 'validation') {
                        switch (err.response.data.field) {
                            case 'username':
                                this.setState({
                                    response: 'Please enter a valid username'
                                })
                                break
                            case 'email':
                                this.setState({
                                    response: 'Please enter a valid email'
                                })
                                break
                            case 'password':
                                this.setState({
                                    response:
                                        'Please enter a valid password of length 6-32'
                                })
                                break
                        }
                    } else if (err.response.data.type == 'preexisting') {
                        this.setState({ response: err.response.data.message })
                    }
                } else {
                    this.setState({ response: err.response.data.message })
                }
            })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div>
                    <input
                        name="username"
                        className={customStyles.input}
                        placeholder="Username"></input>
                </div>
                <div>
                    <input
                        name="email"
                        className={customStyles.input}
                        placeholder="Email"></input>
                </div>
                <div>
                    <input
                        name="password"
                        type="password"
                        className={customStyles.input}
                        placeholder="Password"></input>
                </div>
                <div>
                    <button className={customStyles.button}>Register</button>
                </div>
                <p>{this.state.response}</p>
            </form>
        )
    }
}
