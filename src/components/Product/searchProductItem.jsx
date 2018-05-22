import React, { Component } from 'react';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/shopItem.sass';
// import './Style/main.sass';
import { Card, Layout, AutoComplete, Input, Button, Icon, Menu, Avatar, message, Popconfirm } from 'antd';
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class SearchProductItem extends Component {
    state = {
        shopInfo: {},
        productList: [],
        imgCode: '',
        searchName: this.props.params.name
    }

    componentWillMount() {
        this.handleSearchProduct();
    }

    handleSearchProduct = () => {
        let data = {};
        const { searchName } = this.state;
        if (searchName == this.props.params.name) {
            let searchProNameList = [];
            data.proName = searchName;
            axios.post(SERVICE_URL + "/product/searchProduct", { data })
                .then(response => {
                    const resData = response.data;
                    if (response.status == 200 && !resData.error) {
                        resData.forEach(product => {
                            this.handleGetImg(product);
                        });
                        this.setState({ showLoading: false, productList: resData })
                    } else {
                        this.setState({ showLoading: false })
                        message.error("搜索失败");
                    }
                }).catch(error => {
                    message.error("搜索失败");
                    console.log(error)
                    this.setState({ showLoading: false });
                });
        } else {
            let searchProNameList = [];
            data.proName = searchName;
            axios.post(SERVICE_URL + "/product/searchProduct", { data })
                .then(response => {
                    const resData = response.data;
                    if (response.status == 200 && !resData.error) {
                        resData.forEach(product => {
                            this.handleGetImg(product);
                        });
                        this.setState({ showLoading: false, productList: resData })
                    } else {
                        this.setState({ showLoading: false })
                        message.error("搜索失败");
                    }
                }).catch(error => {
                    message.error("搜索失败");
                    console.log(error)
                    this.setState({ showLoading: false });
                });
            browserHistory.push(BASE_URL + "/searchProduct/" + searchName);
        }
    }

    handleChangeSearchName = (value) => {
        this.setState({ searchName: value })
    }

    handleGetImg = (product) => {
        axios.get(SERVICE_URL + "/shop/getImg/" + product.imgId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    product.imgCode = resData.imgCode;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取图片失败");
                }
            }).catch(error => {
                message.error("获取图片失败");
                this.setState({ showLoading: false });
            });
    }

    handleShowProductDetail = (proId) => {
        browserHistory.push(BASE_URL + "/item/" + proId);
    }

    render() {
        return (
            <div className="shop-item">
                <Layout>
                    <Header>{this.renderHeader()}</Header>
                    {/* <Header>{this.renderCollectHeader()}</Header> */}
                    <Content>
                        {this.renderCollectTreasureContent()}
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>
            </div >
        )
    }

    renderHeader() {
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        const { searchData, searchProNameList } = this.state;
        const { name } = this.props.params;
        return (
            <div className="global-search-wrapper">
                <AutoComplete
                    style={{ width: 200 }}
                    onChange={this.handleChangeSearchName}
                    // onSearch={this.handleSearchProduct}
                    // onSelect={this.handleChangeSelect}
                    // dataSource={searchProNameList.length == 0 ? null : searchProNameList}
                    placeholder="输入要搜索的词"
                    className="global-search"
                    defaultValue={name}
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                >
                    <Input
                        suffix={(
                            <Button className="search-btn" type="primary" onClick={this.handleSearchProduct}>
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </div>
        )
    }

    renderCollectHeader() {
        const { shopInfo } = this.state;
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        return (
            <div className="collect-header">
                店铺名称：{shopInfo.shopName}
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
            </div>
        )
    }

    renderCollectTreasureContent() {
        const { productList } = this.state;
        let productDiv = [];
        productList.forEach(product => {
            productDiv.push(<div className="collect-treasure-content">
                <div className="collect-card">
                    <Card
                        style={{ width: 300 }}
                        cover={<img alt={product.proName} src={product.imgCode} />}
                        onClick={this.handleShowProductDetail.bind(this, product.proId)}
                    >
                        <div className="card-text">
                            <Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={product.proName}
                                description={product.description}
                            />
                        </div>
                    </Card>
                </div>
            </div>);
        });
        return (
            <div>
                {productDiv}
            </div>
        )
    }
}

export default SearchProductItem;