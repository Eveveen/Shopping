import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class MenuIndex extends Component {
    state = {
        current: 'mail',
        pageStatus: "index"
    }

    handleClick = (e) => {
        browserHistory.push(BASE_URL + '/' + e.key);
        // this.props.handleChangePageStatus(e);
        // this.setState({
        //     current: e.key,
        // });
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
                            <Menu.Item key="account">账号管理</Menu.Item>
                            <Menu.Item key="exitAccount">退出</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="message">
                            <Icon type="appstore" />消息
                        </Menu.Item>
                        <Menu.Item key="cart">
                            <Icon type="appstore" />购物车
                        </Menu.Item>
                        <SubMenu title={<span><Icon type="setting" />收藏夹</span>}>
                            <Menu.Item key="collectTreasure">收藏的宝贝</Menu.Item>
                            <Menu.Item key="collectShop">收藏的店铺</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="category">
                            <Icon type="appstore" />商品分类
                        </Menu.Item>
                        <SubMenu title={<span><Icon type="setting" />卖家中心</span>}>
                            <Menu.Item key="openshop">免费开店</Menu.Item>
                            <Menu.Item key="trade">已卖出的宝贝</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="home">
                            <Icon type="appstore" />首页
                        </Menu.Item>
                        <Menu.Item key="order">
                            <Icon type="appstore" />我的订单
                        </Menu.Item>
                        <Menu.Item key="alipay">
                            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
                        </Menu.Item>
                    </Menu>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default MenuIndex;