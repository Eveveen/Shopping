import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class Header extends Component {
    state = {
        current: 'mail',
    }

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }

    render() {
        return (
            <div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <SubMenu title={<span><Icon type="setting" />用户名</span>}>
                        <Menu.Item key="setting:1">账号管理</Menu.Item>
                        <Menu.Item key="setting:2">退出</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="app">
                        <Icon type="appstore" />消息
                    </Menu.Item>
                    <Menu.Item key="app">
                        <Icon type="appstore" />购物车
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="setting" />收藏夹</span>}>
                        <Menu.Item key="setting:1">收藏的宝贝</Menu.Item>
                        <Menu.Item key="setting:2">收藏的店铺</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="app">
                        <Icon type="appstore" />商品分类
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="setting" />买家中心</span>}>
                        <Menu.Item key="setting:1">免费开店</Menu.Item>
                        <Menu.Item key="setting:2">已卖出的宝贝</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="alipay">
                        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default Header;