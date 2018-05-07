import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Menu } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
const SubMenu = Menu.SubMenu;
import { Link, browserHistory } from 'react-router';

class AdminHeader extends Component {

    state = {
        current: 'seller',
    }

    handleClick = (e) => {
        console.log('click ', e);
        browserHistory.push(BASE_URL + "/admin/" + e.key);
        // browserHistory.push(BASE_URL + "/" + e.key);

    }

    render() {
        return (
            <div className="admin-header">
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="seller">
                        <Icon type="appstore" />卖家
                </Menu.Item>
                    <Menu.Item key="user">
                        <Icon type="appstore" />普通用户
                </Menu.Item>
                </Menu>
                {this.props.children}
            </div>
        )
    }
}

export default AdminHeader;