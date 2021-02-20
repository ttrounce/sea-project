import axios from "axios"

import React from 'react';

export default class MyExampleComponent extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { username: "" }
    }

    componentDidMount() {
        axios.post('http://127.0.0.1:3000/api/login', {username:'bigjohn01', pass:'passschicken'}).then(res => {
            const data = res.data;
            console.log(data);
            this.setState({ username: data.loggedin });
        })
    }

    render()
    {
        return (
            <span> { this.state.username } </span>
        )
    }
}