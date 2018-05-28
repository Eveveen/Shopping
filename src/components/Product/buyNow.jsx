import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Layout, Checkbox } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/buyItem.sass';
// import './Style/main.sass';
import AddressItem from './addressItem';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import moment from 'moment';
import { commentTypeEnum } from './data/enum';

class BuyNow extends Component {
    state = {
        cartIds: [],
        buyList: [],
        shopList: [],
        totalCount: 0,
        productInfo: {},
        orderAddressId: '',
        addressData: [],
        defaultAddress: {}
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/checkIsUser")
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    if (data == false) {
                        browserHistory.push(BASE_URL + "/login");
                    } else {
                        const { productInfo } = this.props.location.state;
                        this.handleGetAllAddress();
                        this.setState({ productInfo: productInfo })
                    }
                }
            });

    }

    changeCount = (cartId, product, e) => {
        let cart = { "cartId": cartId, "proNum": e.target.value }
        this.handleChageProNum(cart, product);
        this.setState({})
    }

    decreaseCount = (cartId, product) => {
        let cart = { "cartId": cartId, "proNum": product.cartInfo.proNum - 1 }
        this.handleChageProNum(cart, product);
        this.setState({})
    }

    increaseCount = (cartId, product) => {
        let cart = { "cartId": cartId, "proNum": product.cartInfo.proNum + 1 }
        this.handleChageProNum(cart, product);
        this.setState({})
    }

    handleChageProNum = (cart, product) => {
        let totalCount = this.state.totalCount;
        delete cart.updateTime;
        axios.post(SERVICE_URL + "/product/editCartNum", cart)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    totalCount += (cart.proNum - product.cartInfo.proNum) * product.price;
                    product.cartInfo.proNum = cart.proNum;
                    this.setState({ showLoading: false, totalCount: totalCount })
                } else {
                    this.setState({ showLoading: false })
                    message.error("减少购物车商品失败1");
                }

            }).catch(error => {
                message.error("减少购物车商品失败");
                this.setState({ showLoading: false });
            });
    }

    handleAddOrder = () => {
        const { productInfo, orderAddressId } = this.state;
        let data = {};
        let random = parseInt(Math.random() * 100 + 10);
        data.orderNum = moment(Date.now()).format("YYYYMMDDHHMMSS") + random.toString().slice(0, 2);
        data.proId = productInfo.proId;
        data.shopId = productInfo.shopInfo.shopId;
        data.proNum = productInfo.count;
        data.price = productInfo.price;
        data.addressId = orderAddressId;
        data.commentStatus = commentTypeEnum.WAITPAY;

        axios.post(SERVICE_URL + "/product/addOrder", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleChangeProNum(data.orderNum);
                    this.setState({ showLoading: false })
                } else {
                    this.setState({ showLoading: false })
                    message.error("添加订单失败");
                    console.log(resData.error);
                }

            }).catch(error => {
                console.log(error);
                message.error("添加订单失败");
                this.setState({ showLoading: false });
            });
    }

    handleChangeProNum = (orderNum) => {
        const { productInfo } = this.state;
        console.log(productInfo);
        let totalPrice = productInfo.price * productInfo.count;
        let data = {};
        data.proId = productInfo.proId;
        data.proName = productInfo.proName;
        data.imgId = productInfo.imgId;
        data.description = productInfo.description;
        data.price = productInfo.price;
        data.scanNum = productInfo.scanNum;
        data.category = productInfo.category;
        data.updataTime = productInfo.updataTime;
        data.proStatus = productInfo.proStatus;
        data.shopId = productInfo.shopId;
        data.proNum = productInfo.proNum - productInfo.count;
        if (data.proNum == 0) {
            this.handleChageProductStatus(productInfo);
        }
        axios.post(SERVICE_URL + '/product/editProduct', { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    browserHistory.push({ pathname: BASE_URL + "/pay/" + orderNum, state: { totalPrice: totalPrice } });
                } else {
                    console.log(resData.error);
                    message.error("修改商品数量失败");
                }
                this.setState({ submitLoading: false });
            }).catch(error => {
                console.log(error);
                message.error("修改商品数量失败");
                this.setState({ submitLoading: false });
            });
    }

    handleChageProductStatus = (productInfo) => {
        axios.get(SERVICE_URL + "/product/updateProductStatus/" + productInfo.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false })
                } else {
                    this.setState({ showLoading: false })
                    message.error("修改商品状态失败");
                    console.log(resData.error);
                }
            }).catch(error => {
                console.log(error);
                message.error("修改商品状态失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetAllAddress = () => {
        axios.get(SERVICE_URL + "/product/getAllAddress")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(address => {
                        if (address.addressStatus == 1) {
                            this.state.orderAddressId = address.addressId;
                            this.state.defaultAddress = address;
                        }
                    });
                    this.state.addressData = resData;
                    this.setState({ showLoading: false });
                } else {
                    message.error("获取地址失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                this.setState({ showLoading: false })
                message.error("获取地址失败");
            });
    }

    handleChageAddress = (e) => {
        const { addressData } = this.state;
        addressData.find((address) => { address.addressId == e.target.value ? this.state.defaultAddress = address : null });
        this.setState({
            orderAddressId: e.target.value
        })
    }

    render() {
        const { shopList, totalCount, buyList, productInfo, orderAddressId, addressData, defaultAddress } = this.state;
        return (
            <div className="buy-item">
                <Layout>
                    <Header>&nbsp;&nbsp;</Header>
                    <Content>
                        {addressData.length == 0 ? null : <AddressItem
                            handleChageAddress={this.handleChageAddress}
                            orderAddressId={orderAddressId}
                            addressData={addressData}
                        />}
                        {/* {this.renderBuyItem()} */}
                        {this.renderProductContent()}
                        <div className="summary-text">
                            <div className="real-pay">
                                <div className="pay-info">
                                    <div className="pay-info-content">
                                        <span className="real-pay-title">实付款：</span>
                                        <span className="real-pay-price">￥{productInfo.price * productInfo.count}</span>
                                    </div>
                                    <div className="pay-info-content">
                                        <span className="real-pay-title">寄送至：</span>
                                        <span className="real-pay-text">{defaultAddress.area}{defaultAddress.addressName}</span>
                                    </div>
                                    <div>
                                        <span className="real-pay-title">收货人：</span>
                                        <span className="real-pay-text">{defaultAddress.consignee} &nbsp;&nbsp; {defaultAddress.telphone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="submit-btn">
                                <Button onClick={this.handleAddOrder}>提交订单</Button>
                            </div>
                        </div>
                    </Content>
                    <Footer>@2018-eshop</Footer>
                </Layout>

            </div >
        )
    }

    renderProductContent = () => {
        const { productInfo } = this.state;
        let cartItemDiv = [];
        let titleDiv =
            <div className="card-title">
                <div className="card-title-text">
                    <div className="card-title-text">店铺：</div>
                    <div className="card-title-text">{productInfo.shopInfo ? productInfo.shopInfo.shopName : null}</div>
                </div>
            </div>
        cartItemDiv.push(titleDiv);
        cartItemDiv.push(
            <div className="cart-card">
                <div className="card-item-content">
                    <div className="left-img">
                        <img alt={productInfo.proName} src={productInfo.imgCode} />
                    </div>
                    <div className="item-info">
                        {productInfo.proName} {productInfo.description}
                    </div>
                    <div className="item-status">
                        颜色分类：白色<br />
                        尺码：均码
                        </div>
                    <div className="item-price">
                        {productInfo.price}
                    </div>
                    <div className="item-count">
                        {/* <Button onClick={this.decreaseCount.bind(this, productInfo.cartInfo.cartId, productInfo)}>-</Button> */}
                        <Input value={productInfo.count} />
                        {/* <Input value={productInfo.cartInfo.proNum} onChange={this.changeCount.bind(this, productInfo.cartInfo.cartId, productInfo)} /> */}
                        {/* <Button onClick={this.increaseCount.bind(this, productInfo.cartInfo.cartId, productInfo)}>+</Button> */}
                    </div>
                    <div className="item-total-price">
                        ￥{productInfo.price * productInfo.count}
                    </div>
                    <div className="item-operation">
                        {/* <span onClick={this.handleDeleteItem.bind(this, product.cartInfo.cartId)}>删除</span> */}
                    </div>
                </div>
            </div>)
        return (
            <div>{cartItemDiv}</div>
        )
    }


}
export default BuyNow;