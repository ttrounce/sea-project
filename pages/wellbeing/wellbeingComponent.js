import React, { useState } from 'react'
import customStyles from '../../styles/custom.module.css'

export default function wellbeingForm() {

    return (
        <form onSubmit={(e) => onSubmit(e)}>
            <div>
                <h3>How do you feel about the future?</h3>
                <input
                    name="future"
                    className={customStyles.input}
                    placeholder="grrreat"
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
                    onChange={(e) => setPasswordConfirmation(e.target.value)}></input>
            </div>
            <p>{passwordMessage}</p>
            <div>
                <button className={customStyles.button}>Register</button>
            </div>
            <p>{responseMessage}</p>
        </form>
    )
}