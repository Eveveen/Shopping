import React, { Component } from 'react';
import axios from 'axios';
import Account from './account';
import { Layout, Menu, Icon, Carousel, AutoComplete, Input, Button, message } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './Style/homePage.sass';
import './Style/main.sass';
import DetailInfo from './detailInfo';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class HomePage extends Component {
    state = {
        searchName: '',
        searchData: [],
        searchProNameList: []
    }

    handleShowDetail = (proId) => {
        browserHistory.push(BASE_URL + "/item/" + proId);
    }

    handleChangeSelect = (value) => {
        browserHistory.push(BASE_URL + "/searchProduct/" + value);
        this.setState({ searchName: value })
    }

    handleSearchProduct = (value) => {
        let data = {};
        let searchProNameList = [];
        data.proName = value;
        axios.post(SERVICE_URL + "/product/searchProduct", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    console.log("resData,", resData);
                    resData.forEach(product => {
                        searchProNameList.push(product.proName)
                    });
                    this.setState({ showLoading: false, searchData: resData, searchProNameList: searchProNameList })
                } else {
                    this.setState({ showLoading: false })
                    console.log(resData.error)
                    message.error("搜索失败");
                }
            }).catch(error => {
                message.error("搜索失败");
                console.log(error)
                this.setState({ showLoading: false });
            });
    }

    render() {
        return (
            <div>
                {/* <Account /> */}
                {this.renderHomePage()}
            </div>
        )
    }

    renderHomePage() {
        return (
            <div className="home-page">
                <Layout>
                    <Header>{this.renderHeader()}</Header>
                    <Layout>
                        <Sider> {this.renderLeftMenu()}</Sider>
                        <Content>{this.renderContent()}</Content>
                    </Layout>
                    <Footer>Footer</Footer>
                </Layout>
            </div>
        )
    }

    renderHeader() {
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        const { searchData, searchProNameList } = this.state;
        return (
            <div className="global-search-wrapper">
                <AutoComplete
                    style={{ width: 200 }}
                    onSearch={this.handleSearchProduct}
                    onSelect={this.handleChangeSelect}
                    dataSource={searchProNameList.length == 0 ? null : searchProNameList}
                    placeholder="输入要搜索的词"
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
                    <div onClick={this.handleShowDetail.bind(this, 1)}><h3>1</h3></div>
                    <div onClick={this.handleShowDetail.bind(this, 4)}><h3>2</h3></div>
                    <div><h3>3</h3></div>
                    <div><h3>4</h3></div>
                </Carousel>
            </div>
        )
    }
}

export default HomePage;