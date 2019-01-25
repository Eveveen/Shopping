import React, { Component } from 'react';
import { Button } from 'antd';
import intl from 'react-intl-universal';
import './Style/registerSuccess.sass';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class RegisterSuccess extends Component {

    handleReturnToIndex = () => {
        browserHistory.push(BASE_URL + "/home");
    }
    render() {
        return (
            <div className="success-page">
                <div>注册成功！等待管理员认证</div>
            </div >
        )
    }
}

export default RegisterSuccess;