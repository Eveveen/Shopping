import React, { Component } from 'react';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/shopItem.sass';
// import './Style/main.sass';
import { Card, Layout, AutoComplete, Input, Button, Icon, Menu, Avatar, message, Spin } from 'antd';
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class ShopItem extends Component {
    state = {
        shopInfo: {},
        productList: [],
        imgCode: '',
        searchName: '',
        showLoading: true,
        showNum: 8
    }

    componentWillMount() {
        this.handleGetSellerShop();
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScrollHandle.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollHandle.bind(this));
    }

    onScrollHandle(event) {
        const clientHeight = document.documentElement.clientHeight
        const scrollTop = document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const isBottom = (clientHeight + scrollTop === scrollHeight)
        if (isBottom && this.state.showNum <= this.state.productList.length) {
            this.setState({ showNum: this.state.showNum + 4 })
            console.log("aaaa", this.state.showNum)
        }
    }

    handleGetSellerShop = () => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getShop/" + this.props.params.id)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleGetProduct(resData.shopId);
                    this.setState({ showLoading: false, shopInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取店铺信息失败");
                }
            }).catch(error => {
                message.error("获取店铺信息失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetProduct = (shopId) => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getShopProductByProStatus/" + shopId + "/1")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(product => {
                        if (product.imgId != null) {
                            this.handleGetImg(product);
                            this.handleGetProductOrder(product);
                        }
                    });
                    this.setState({ showLoading: false, productList: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取商品失败");
                }
            }).catch(error => {
                message.error("获取商品失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetImg = (product) => {
        this.state.showLoading = true;
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

    handleGetProductOrder = (product) => {
        let selledNum = 0;
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getOrderByProId/" + product.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(order => {
                        selledNum += order.proNum;
                    });
                    product.selledNum = selledNum;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取订单失败");
                }
            }).catch(error => {
                message.error("获取订单失败");
                this.setState({ showLoading: false });
            });
    }

    handleSearchProduct = () => {
        let data = {};
        const { shopInfo, searchName } = this.state;
        data.proName = searchName;
        data.shopId = shopInfo.shopId;
        this.state.showLoading = true;
        axios.post(SERVICE_URL + "/product/searchShopActiveProduct", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(product => {
                        this.handleGetImg(product);
                        this.handleGetProductOrder(product);
                    });
                    this.setState({ showLoading: false, productList: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("搜索失败");
                }
            }).catch(error => {
                message.error("搜索失败");
                console.log(error)
                this.setState({ showLoading: false });
            });
    }

    handleShowProductDetail = (proId) => {
        browserHistory.push(BASE_URL + "/item/" + proId);
    }

    handleChangeSearchName = (value) => {
        this.setState({ searchName: value })
    }

    handleEnter = (e) => {
        if (e.which == 13) {
            this.handleSearchProduct();
        }
    }

    render() {
        const { shopInfo } = this.state;
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        return (
            <Spin size="large" spinning={this.state.showLoading}>
                <div className="shop-item">
                    <Layout>
                        <Header>
                            <div className="collect-header">
                                店铺名称：{shopInfo.shopName}
                            </div>
                            <div className="global-search-wrapper">
                                <AutoComplete
                                    style={{ width: 200 }}
                                    placeholder="输入要搜索的关键字"
                                    className="global-search"
                                    onChange={this.handleChangeSearchName}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                >
                                    <Input onKeyPress={this.handleEnter}
                                        suffix={(
                                            <Button className="search-btn" type="primary" onClick={this.handleSearchProduct}>
                                                <Icon type="search" />
                                            </Button>
                                        )}
                                    />
                                </AutoComplete>
                            </div>
                        </Header>
                        <Content>
                            {this.renderCollectTreasureContent()}
                        </Content>
                        <Footer>Footer</Footer>
                    </Layout>
                </div >
            </Spin>
        )
    }

    renderCollectTreasureContent() {
        const { productList, showNum } = this.state;
        let productDiv = [];
        productList.forEach((product, index) => {
            if (index < showNum) {
                productDiv.push(<div className="collect-treasure-content">
                    <div className="collect-card">
                        <Card
                            style={{ width: 240 }}
                            cover={<img alt={product.proName} src={product.imgCode} />}
                            onClick={this.handleShowProductDetail.bind(this, product.proId)}
                        >
                            <div className="card-text">
                                <Meta
                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={<div>{product.proName}&nbsp;{product.description}</div>}
                                    description={
                                        <div className="pro-description">
                                            <div className="descprition-price">￥{product.price}</div>
                                            <div className="selled-num">已售出：{product.selledNum == null ? null : product.selledNum}&nbsp;件</div>
                                        </div>
                                    }
                                />
                            </div>
                        </Card>
                    </div>
                </div>);
            }
        });
        return (
            <div>
                {productDiv}
            </div>
        )
    }
}

export default ShopItem;