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
            axios.get(SERVICE_URL + "/shop/logout")
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
            if (e.key == "shop/account") {
                browserHistory.push(BASE_URL + '/' + e.key);
            } else {
                axios.get(SERVICE_URL + "/shop/getSellerShop")
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            console.log(resData);
                            if (resData == "") {
                                axios.get(SERVICE_URL + "/shop/getSellerInfo")
                                    .then(response => {
                                        const res = response.data;
                                        if (response.status == 200 && !res.error) {
                                            browserHistory.push(BASE_URL + "shop/registerShop/" + res.sellerId);
                                        } else {
                                            this.setState({ showLoading: false })
                                            message.error("获取个人信息失败");
                                        }
                                    }).catch(error => {
                                        console.log(error);
                                        message.error("获取个人信息失败");
                                        this.setState({ showLoading: false });
                                    })
                            } else {
                                if (resData.shopStatus == 0 || resData.shopStatus == null) {
                                    browserHistory.push(BASE_URL + "/shop/registerSuccess");
                                } else {
                                    browserHistory.push(BASE_URL + '/' + e.key);
                                }
                            }
                            this.setState({ showLoading: false, shopInfo: resData });
                        } else {
                            this.setState({ showLoading: false })
                            message.error("获取信息失败");
                        }
                    }).catch(error => {
                        message.error("获取信息失败");
                        this.setState({ showLoading: false });
                    });
            }
        }
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
                            <Menu.Item key="shop/account">账号管理</Menu.Item>
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