import React, { Component } from 'react';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/shopIndex.sass';
import './Style/main.sass';
import { Card, Layout, AutoComplete, Input, Button, Icon, Menu, Avatar, message, Popconfirm, Spin } from 'antd';
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import AddProduct from './addProduct';

class ShopIndex extends Component {
    state = {
        shopInfo: {},
        productList: [],
        imgCode: '',
        showAddModal: false,
        searchName: '',
        current: "selling",
        showLoading: true,
        showNum: 6
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
        axios.get(SERVICE_URL + "/shop/getSellerShop")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleGetProduct(resData.shopId);
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

    // handleGetProduct = (id) => {
    //     axios.get(SERVICE_URL + "/product/getShopProduct/" + id)
    //         .then(response => {
    //             const resData = response.data;
    //             if (response.status == 200 && !resData.error) {
    //                 resData.forEach(product => {
    //                     if (product.imgId != null) {
    //                         this.handleGetImg(product);
    //                         this.handleGetProductOrder(product);
    //                     }
    //                 });
    //                 this.setState({ showLoading: false, productList: resData });
    //             } else {
    //                 this.setState({ showLoading: false })
    //                 message.error(intl.get("editFailed"));
    //             }
    //         }).catch(error => {
    //             message.error(intl.get("editFailed"));
    //             this.setState({ showLoading: false });
    //         });
    // }

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

    handleEditProduct = (proId) => {
        browserHistory.push(BASE_URL + "/shop/editProduct/" + proId);
    }

    handleShowAddProduct = () => {
        this.setState({ showAddModal: true })
    }

    handleCancelAddProduct = () => {
        this.setState({
            showAddModal: false
        })
    }

    handleDeleteProduct = (proId) => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/deleteProduct/" + proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    message.success('删除成功');
                    this.setState({ showLoading: false });
                    this.handleGetSellerShop();
                } else {
                    this.setState({ showLoading: false })
                    message.error("删除失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("删除失败");
                this.setState({ showLoading: false });
            });
    }

    handleCancelDelete = () => {
        console.log("canceldelte");
    }

    handleSearchProduct = () => {
        let data = {};
        const { shopInfo, searchName } = this.state;
        data.proName = searchName;
        data.shopId = shopInfo.shopId;
        this.state.showLoading = true;
        axios.post(SERVICE_URL + "/shop/searchShopProduct", { data })
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

    handleChangeSearchName = (value) => {
        this.setState({ searchName: value })
    }

    handleEnter = (e) => {
        if (e.which == 13) {
            this.handleSearchProduct();
        }
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

    handleClick = (e) => {
        const { shopInfo } = this.state;
        this.handleGetProduct(shopInfo.shopId, e.key);
        this.setState({ current: e.key });
    }

    handleGetProduct = (shopId, current) => {
        // const { shopInfo } = this.state;
        // let id = shopId == undefined ? shopInfo.shopId : shopId
        this.state.showLoading = true;
        let proStatus = 1;
        if (current == "soldout") {
            proStatus = 0;
        }
        axios.get(SERVICE_URL + "/product/getShopProductByProStatus/" + shopId + "/" + proStatus)
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

    render() {
        const { showAddModal, shopInfo } = this.state;
        return (
            <Spin size="large" spinning={this.state.showLoading}>
                <div className="shop-index">
                    <Layout>
                        <Header>
                            <div className="collect-header">
                                店铺名称：{shopInfo.shopName}
                            </div>
                            <div className="global-search-wrapper">
                                <AutoComplete
                                    style={{ width: 200 }}
                                    placeholder="请输入要查询的关键字"
                                    className="global-search"
                                    onChange={this.handleChangeSearchName}
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                >
                                    <Input onKeyPress={this.handleEnter}
                                        suffix={(
                                            <Button className="search-btn" type="primary" onClick={this.handleSearchProduct} >
                                                <Icon type="search" />
                                            </Button>
                                        )}
                                    />
                                </AutoComplete>
                            </div>
                            <div className="add-product" onClick={this.handleShowAddProduct}>
                                <Icon type="appstore" />添加商品
                            </div>
                        </Header>
                        <Content>
                            {this.renderShopMenu()}
                            {this.renderCollectTreasureContent()}
                            {showAddModal ?
                                <AddProduct
                                    visible={this.state.showAddModal}
                                    handleCancel={this.handleCancelAddProduct}
                                    handleGetSellerShop={this.handleGetSellerShop}
                                    shopInfo={this.state.shopInfo}
                                /> : null}
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
                            actions={[
                                <Icon type="edit" onClick={this.handleEditProduct.bind(this, product.proId)} />,
                                <Icon type="ellipsis" />,
                                <Popconfirm title="Are you sure delete this task?" onConfirm={this.handleDeleteProduct.bind(this, product.proId)} onCancel={this.handleCancelDelete} okText="Yes" cancelText="No">
                                    <a href="#">Delete</a>
                                </Popconfirm>]}
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

    renderShopMenu() {
        return (
            <div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="selling">
                        <Icon type="appstore" />出售中商品
                    </Menu.Item>
                    <Menu.Item key="soldout">
                        <Icon type="appstore" />下架商品
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

export default ShopIndex;