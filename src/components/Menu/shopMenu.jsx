import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class ShopMenu extends Component {
    state = {
        current: 'mail',
        pageStatus: "index"
    }

    handleClick = (e) => {
        this.setState({ current: e.key });

        if (e.key == "exitAccount") {
            browserHistory.push(BASE_URL);
        } else {
            browserHistory.push(BASE_URL + '/' + e.key);
        }
        // this.props.handleChangePageStatus(e);
    }

    render() {
        return (
            <div>
                <div>
                    <Menu
                        onClick={this.handleClick}
                        selectedKeys={[this.state.current]}
                        mode="horizontal"
                    >
                        <SubMenu title={<span><Icon type="setting" />用户名</span>}>
                            <Menu.Item key="account/seller">账号管理</Menu.Item>
                            <Menu.Item key="exitAccount">退出</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="shop">
                            <Icon type="appstore" />首页
                        </Menu.Item>
                        <Menu.Item key="message">
                            <Icon type="appstore" />消息
                        </Menu.Item>
                        <Menu.Item key="shop/order">
                            <Icon type="appstore" />我的订单
                        </Menu.Item>
                    </Menu>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default ShopMenu;