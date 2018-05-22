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
    componentWillMount() {
        let current = this.props.location.pathname.split("/");
        this.setState({ current: current[2] })
    }

    handleClick = (e) => {
        this.setState({ current: e.key })
        if (e.key == "exitAccount") {
            axios.get(SERVICE_URL + "/admin/logout")
                .then(response => {
                    const resData = response.data;
                    if (response.status == 200 && !resData.error) {
                        browserHistory.push(BASE_URL + "/login");
                    } else {
                        message.error("退出失败");
                    }
                }).catch(error => {
                    console.log(error);
                    message.error("退出失败");
                });
        } else {
            browserHistory.push(BASE_URL + "/admin/" + e.key);
        }
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
                    <Menu.Item key="shopApply">
                        <Icon type="appstore" />店铺申请
                    </Menu.Item>
                    <Menu.Item key="user">
                        <Icon type="appstore" />普通用户
                    </Menu.Item>
                    <Menu.Item key="exitAccount">
                        <Icon type="appstore" />退出登录
                    </Menu.Item>
                </Menu>
                {this.props.children}
            </div>
        )
    }
}

export default AdminHeader;