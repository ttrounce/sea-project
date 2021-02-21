import axios from "axios"
import React from 'react';
import customStyles from "../../styles/custom.module.css";

export default class LoginComponent extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {success: false}
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        // Encased in JSX to autosanitize.
        const username = <span>{data.get('username')}</span>;
        const password = <span>{data.get('password')}</span>;

        axios.post('http://127.0.0.1:3000/api/login', {username: data.get('username'), pass: data.get('password')}).then(res => {
            if(res.data.success)
            {
                this.setState({success: 'Successfully authenticated with the server.'});
                // Here we can handle a login success...
            }
            else
            {
                this.setState({success: 'Could not authenticate with the server.'});
                // Here we can handle a login failure...
            }
        }).catch(err => {
            console.log(err);
            // Here we can handle a login failure (due to an error)...
        })
    }

    render()
    {
        return (
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div><input name='username' className={customStyles.input} placeholder='Username'></input></div>
                <div><input name='password' type='password' className={customStyles.input} placeholder='Password'></input></div>
                <div><button className={customStyles.button}>Login</button></div>
                <h5>{this.state.success}</h5>
            </form>
        )
    }
}