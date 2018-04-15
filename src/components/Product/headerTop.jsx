import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class HeaderTop extends Component {
    state = {
        current: 'mail',
        pageStatus: "index"
    }

    handleClick = (e) => {
        this.props.handleChangePageStatus(e);
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
                        <Menu.Item key="accountSetting">账号管理</Menu.Item>
                        <Menu.Item key="exitAccount">退出</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="message">
                        <Icon type="appstore" />消息
                    </Menu.Item>
                    <Menu.Item key="cart">
                        <Icon type="appstore" />购物车
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="setting" />收藏夹</span>}>
                        <Menu.Item key="collect:1">收藏的宝贝</Menu.Item>
                        <Menu.Item key="collect:2">收藏的店铺</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="catagory">
                        <Icon type="appstore" />商品分类
                    </Menu.Item>
                    <SubMenu title={<span><Icon type="setting" />买家中心</span>}>
                        <Menu.Item key="user:1">免费开店</Menu.Item>
                        <Menu.Item key="user:2">已卖出的宝贝</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="homePage">
                        <Icon type="appstore" />首页
                    </Menu.Item>
                    <Menu.Item key="alipay">
                        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default HeaderTop;