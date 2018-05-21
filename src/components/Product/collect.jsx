import React, { Component } from 'react';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/collect.sass';
import './Style/main.sass';
import { Card, Layout, AutoComplete, Input, Button, Icon, Menu, Avatar, message, Spin } from 'antd';
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import CollectShopChild from './collectShopChild';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { Link, browserHistory } from 'react-router';
import './Style/antd.sass';

class Collect extends Component {
    state = {
        pageStatus: this.props.pageStatus,
        current: this.props.pageStatus,
        collectProductList: [],
        productList: [],
        shopList: [],
        showDeletePop: false,
        collectShopList: [],
        showLoading: true,
        pathname: this.props.pageStatus
    }

    componentWillMount() {
        this.handleGetCollectProduct();
        if (this.props.location.pathname == "/collectShop") {
            this.handleGetCollectShop();
        }
        this.setState({ pathname: this.props.location.pathname })
    }

    componentWillReceiveProps(props) {
        console.log("props,", props);
        if (props.location.pathname == "/collectShop") {
            this.handleGetCollectShop();
        }
        this.setState({ pathname: props.location.pathname })
    }

    handleGetCollectProduct = () => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getCollectProduct")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(collectProduct => {
                        this.handleGetProduct(collectProduct);
                        this.handleGetShopInfo(collectProduct);
                    });
                    this.setState({ showLoading: false, collectProductList: resData });
                } else {
                    console.log(error)
                    this.setState({ showLoading: false })
                    message.error("获取收藏的宝贝失败");
                }
            }).catch(error => {
                message.error("获取收藏的宝贝失败");
                this.setState({ showLoading: false });
            })
    }

    handleGetProduct = (collectProduct) => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getProductByProId/" + collectProduct.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    // this.handleGetImg(resData);
                    this.handleGetImg(resData);
                    collectProduct.productInfo = resData;
                    this.state.productList.push(resData);
                    this.setState({ showLoading: false, productInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取商品失败");
                }
            }).catch(error => {
                message.error("获取商品失败");
                this.setState({ showLoading: false });
            })
    }

    handleGetShopInfo = (collectProduct) => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getShop/" + collectProduct.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    collectProduct.shopInfo = resData;
                    if (this.state.pathname == "/collectShop") {
                        this.handleGetSeller(collectProduct);
                    }
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取店铺信息失败");
                }
            }).catch(error => {
                message.error("获取店铺信息失败");
                this.setState({ showLoading: false });
            })
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
                console.log(error);
                message.error("获取图片失败");
                this.setState({ showLoading: false });
            });
    }

    handleClick = (e) => {
        this.setState({
            pageStatus: e.key,
            pathname: e.key,
            current: e.key
        });
    }

    handleGoToCollectShop = () => {
        browserHistory.push(BASE_URL + "/collectShop");
    }

    handleGoToCollectTreasure = () => {
        browserHistory.push(BASE_URL + "/collectTreasure");
    }

    handleGoToShop = (shopId) => {
        browserHistory.push(BASE_URL + "/viewShop/" + shopId);
    }

    handleShowDeletePop = (collectProduct) => {
        collectProduct.showDeletePop = true;
        this.setState({ showDeletePop: true })
    }

    handleHideDeletePop = (collectProduct) => {
        collectProduct.showDeletePop = false;
        console.log("cancel");
        this.setState({ showDeletePop: false })
    }

    handleDeleteCollectProduct = (cpId) => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/deleteCollectProduct/" + cpId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleGetCollectProduct();
                    message.success("删除宝贝成功");
                    this.setState({ showLoading: false, productInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("删除宝贝失败");
                }
            }).catch(error => {
                message.error("删除宝贝失败");
                this.setState({ showLoading: false });
            })
    }

    handleGetCollectShop = () => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getCollectShop")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(collectShop => {
                        this.handleGetShopInfo(collectShop);
                        this.handleGetShopProduct(collectShop);
                        // this.handleGetSeller(collectShop);
                    });
                    this.setState({ showLoading: false, collectShopList: resData });
                } else {
                    console.log(error)
                    this.setState({ showLoading: false })
                    message.error("获取收藏的店铺失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取收藏的店铺失败");
                this.setState({ showLoading: false });
            })
    }

    handleGetShopProduct = (collectShop) => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getShopProduct/" + collectShop.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(product => {
                        if (product.imgId != null) {
                            this.handleGetImg(product);
                        }
                    });
                    collectShop.productList = resData;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleGetSeller = (collectShop) => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/admin/getSeller/" + collectShop.shopInfo.sellerId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.imgId = resData.avatar;
                    collectShop.sellerInfo = resData;
                    this.handleGetImg(resData);
                    this.setState({ showLoading: false, sellerInfo: resData });
                } else {
                    message.error("获取用户失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取用户失败");
            });
    }

    handleShowProductDetail = (proId) => {
        browserHistory.push(BASE_URL + "/item/" + proId);
    }

    render() {
        const { pageStatus, collectShopList } = this.state;
        return (
            <div className="collect">
                <Spin size="large" spinning={this.state.showLoading}>
                    <Layout>
                        <Header>{this.renderCollectHeader()}</Header>
                        <Content>{this.state.pathname == "/collectTreasure" ?
                            this.renderCollectTreasureContent() :
                            this.state.pathname == "/collectShop" ? <CollectShopChild collectShopList={collectShopList} /> : null}</Content>
                        <Footer>Footer</Footer>
                    </Layout>
                </Spin>
            </div >
        )
    }

    renderCollectHeader() {
        const { pathname } = this.state;
        return (
            <div className="collect-header">
                <div className={pathname == "/collectTreasure" ? "collect-header-product" : "collect-header-product-no"} onClick={this.handleGoToCollectTreasure}>
                    收藏的宝贝
                </div>
                <div className={pathname == "/collectShop" ? "collect-header-shop" : "collect-header-shop-no"} onClick={this.handleGoToCollectShop}>
                    收藏的店铺
                </div>
            </div>
        )
    }

    renderCollectTreasureContent() {
        const { collectProductList, showDeletePop } = this.state;
        let collectProductDiv = [];
        collectProductList.forEach(collectProduct => {
            collectProductDiv.push(
                <div className="collect-treasure-content">
                    <div className="collect-card">
                        <Card
                            hoverable
                            onClick={this.handleShowProductDetail.bind(this, collectProduct.proId)}
                            style={{ width: 148 }}
                            cover={<img alt={collectProduct.productInfo == null ? "img" : collectProduct.productInfo.proName} src={collectProduct.productInfo == null ? null : collectProduct.productInfo.imgCode} />}
                        >
                        </Card>
                        {collectProduct.shopInfo != null ?
                            <div>
                                <div className="go-shop-btn" onClick={this.handleGoToShop.bind(this, collectProduct.shopInfo.shopId)}>
                                    <span>进入店铺</span>
                                </div>
                                <div className="delete-btn" onClick={this.handleShowDeletePop.bind(this, collectProduct)}>
                                    <Icon type="delete" />
                                </div>

                            </div>
                            : null}
                        {collectProduct.showDeletePop == true ?
                            <div className="delete-pop-show">
                                <div className="delete-pop">
                                    <div className="del-pop-bg"></div>
                                    <div className="del-pop-box">
                                        <div className="txt">确定删除？</div>
                                        <div className="btns">
                                            <Button type="primary" className="btn-ok" onClick={this.handleDeleteCollectProduct.bind(this, collectProduct.cpId)}>确定</Button>
                                            <Button className="btn-close" onClick={this.handleHideDeletePop.bind(this, collectProduct)}>取消</Button>
                                        </div>
                                    </div>
                                </div>
                            </div> : null
                        }

                        <div className="card-text">
                            {collectProduct.productInfo == null ? null : <Meta
                                title={collectProduct.productInfo.proName}
                                description={<div>￥ {collectProduct.productInfo.price}</div>}
                            />}
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <div className="collect-product">{collectProductDiv}</div>
        )
    }

    renderCollectShopContent() {
        const { collectShopList } = this.state;
        console.log("shop");
        return (
            <div>
                <CollectShopChild collectShopList={collectShopList} />
            </div>
        )
    }
}

export default Collect;