import React, { Component } from 'react';
import { MenuItems } from "./MenuItems";
import Head from 'next/head';
import styles from '../../../styles/Home.module.css';
import navbarStyles from '../../../styles/navbar.module.css';

class Navbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }

    render() {
        return(
        <>
            <Head>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.2/css/all.css" integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu" crossorigin="anonymous"></link>
            </Head>
            <nav className={navbarStyles.NavbarItems}>
                <h1 className={navbarStyles.navbarlogo}><a href='/'>Campus Connect</a></h1>
                <div className={navbarStyles.menuicon} onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times ' + navbarStyles.fa_times : 'fas fa-bars ' + navbarStyles.fa_bars}></i>
                </div>
                <ul className={this.state.clicked ? navbarStyles.navmenu_active : navbarStyles.navmenu}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index} style={{listStyleType: 'none'}}>
                                <a className={item.cName} href={item.url}>
                                    {item.title}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </>
        )
    }
}

export default Navbar