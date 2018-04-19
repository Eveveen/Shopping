import React, { Component } from 'react';
import { Button } from 'antd';
import intl from 'react-intl-universal';
import './success.sass';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';

class Success extends Component {

    handleReturnToIndex = () => {
        browserHistory.push(BASE_URL + "/home");
    }
    render() {
        return (
            <div className="success-page">
                店铺评分成功！
                <Button type="primary" onClick={this.handleReturnToIndex}>点击返回首页</Button>
            </div >
        )
    }
}

export default Success;