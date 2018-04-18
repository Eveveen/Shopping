import React, { Component } from 'react';
import axios from 'axios';
import HeaderTop from './headerTop';
import Account from './account';
import { Layout, Menu, Icon, Carousel, AutoComplete, Input, Button } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './Style/homePage.sass';
import './Style/main.sass';
import CartPage from './cartPage';
import Collect from './collect';
import Category from './category';
import DetailInfo from './detailInfo';


class HomePage extends Component {
    state = {
        pageStatus: "homePage"
    }

    handlePageStatus = (e) => {
        this.setState({ pageStatus: e.key })
    }

    handleShowDetail = () => {
        this.setState({ pageStatus: "detailInfo" })
    }

    render() {
        const { pageStatus } = this.state;
        console.log(pageStatus);
        return (
            <div>
                <HeaderTop
                    pageStatus={pageStatus}
                    handleChangePageStatus={this.handlePageStatus}
                />
                {/* <Account /> */}
                {pageStatus == "homePage" || pageStatus == "detailInfo" ? this.renderHomePage() :
                    pageStatus == "cart" ? <CartPage /> :
                        pageStatus == "accountSetting" ? <Account /> :
                            pageStatus == "collectTreasure" || pageStatus == "collectShop" ? <Collect pageStatus={pageStatus} /> :
                                pageStatus == "category" ? <Category /> : null}
            </div>
        )
    }

    renderHomePage() {
        console.log("===");
        const { pageStatus } = this.state;
        return (
            <div className="home-page">
                <Layout>
                    <Header>{this.renderHeader()}</Header>
                    <Layout>
                        {pageStatus == "homePage" ? <Sider> {this.renderLeftMenu()}</Sider> : null}
                        {pageStatus == "homePage" ? <Content>{this.renderContent()}</Content> : null}
                        {pageStatus == "detailInfo" ? <Content><DetailInfo /></Content> : null}
                        {/* <Content><DetailInfo /></Content> */}
                    </Layout>
                    <Footer>Footer</Footer>
                </Layout>
            </div>
        )
    }

    renderHeader() {
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        return (
            <div className="global-search-wrapper">
                <AutoComplete
                    style={{ width: 200 }}
                    dataSource={dataSource}
                    placeholder="try to type `b`"
                    className="global-search"
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                >
                    <Input
                        suffix={(
                            <Button className="search-btn" type="primary">
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </div>
        )
    }

    renderLeftMenu() {
        return (
            <div className="home-left-menu">
                <Menu>
                    <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation four&nbsp;&nbsp;</span></span>}>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="setting" /><span>Navigation two</span></span>}>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="setting" /><span>Navigation one</span></span>}>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub1" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub0" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub11" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
        )
    }

    renderContent() {
        return (
            <div className="home-page-content">
                <Carousel autoplay>
                    <div onClick={this.handleShowDetail}><h3>1</h3></div>
                    <div><h3>2</h3></div>
                    <div><h3>3</h3></div>
                    <div><h3>4</h3></div>
                </Carousel>
            </div>
        )
    }
}

export default HomePage;