import React, { Component } from 'react'
import SignOut from '../authentication/signOut'

class Home extends Component {
    render() {
        return (
            <div>
                <SignOut></SignOut>
                <h1>Home Page</h1>
            </div>
        )
    }
}

export default Home;
