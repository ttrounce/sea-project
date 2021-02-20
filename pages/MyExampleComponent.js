import axios from "axios"

import React from 'react';
// import axios from 'axios'

export default class MyExampleComponent extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { username: "" }
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:3000/api/db').then(res => {
            const data = res.data;
            console.log(data);
            this.setState({ username: data.username });
        })
    }

    render()
    {
        return (
            <span> { this.state.username } </span>
        )
    }
}