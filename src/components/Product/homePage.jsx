import React, { Component } from 'react';
import axios from 'axios';
import Header from './header';
import Account from './account';

class HomePage extends Component {
    render() {
        return (
            <div>
                <Header />
                <Account />
            </div>
        )
    }
}

export default HomePage;