import axios from 'axios'
import React from 'react'
import customStyles from '../../styles/custom.module.css'

export default class LoginComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = { response: false }
    }

    handleSubmit(e) {
        e.preventDefault()
        const data = new FormData(e.target)
        // Encased in JSX to autosanitize.
        const username = <span>{data.get('username')}</span>
        const password = <span>{data.get('password')}</span>

        axios
            .post(`https://localhost:3000/api/login`, {
                username: data.get('username'),
                pass: data.get('password')
            })
            .then((res) => {
                this.setState({ response: 'Successfully logged in' })
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
                            case 'password':
                                this.setState({
                                    response: 'Please enter a valid password'
                                })
                                break
                        }
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
                        name="password"
                        type="password"
                        className={customStyles.input}
                        placeholder="Password"></input>
                </div>
                <div>
                    <button className={customStyles.button}>Login</button>
                </div>
                <h5>{this.state.response}</h5>
            </form>
        )
    }
}
