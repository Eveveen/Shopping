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

class BuyNow extends Component {
    state = {
        cartIds: [],
        buyList: [],
        shopList: [],
        totalCount: 0,
        productInfo: {}
    }

    componentWillMount() {
        const { productInfo } = this.props.location.state;
        this.setState({})
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

    render() {
        const { shopList, totalCount, buyList } = this.state;
        return (
            <div className="buy-item">
                <Layout>
                    <Header>Header</Header>
                    <Content>
                        <AddressItem />
                        {/* {this.renderBuyItem()} */}
                        {this.renderProductContent()}
                        <div className="summary-text">
                            <div className="real-pay">
                                <div className="pay-info">
                                    <div className="pay-info-content">
                                        <span className="real-pay-title">实付款：</span>
                                        <span className="real-pay-price">￥{this.state.totalCount}</span>
                                    </div>
                                    <div className="pay-info-content">
                                        <span className="real-pay-title">寄送至：</span>
                                        <span className="real-pay-text">江苏省南通市崇川区狼山镇街道啬园路9号南通大学主校区</span>
                                    </div>
                                    <div>
                                        <span className="real-pay-title">收货人：</span>
                                        <span className="real-pay-text">张三12345678909</span>
                                    </div>
                                </div>
                            </div>
                            <div className="submit-btn">
                                <Button>提交订单</Button>
                            </div>
                        </div>
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>

            </div >
        )
    }

    renderProductContent = () => {
        const { productInfo } = this.state;
        console.log(productInfo);
        let cartItemDiv = [];
        cartItemDiv.push(
            <div className="cart-card">
                <div className="card-item-content">
                    <div className="left-img">
                        <img alt="example" src={productInfo.imgCode} />
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
                        {/* <Button onClick={this.decreaseCount.bind(this, productInfo.cartInfo.cartId, productInfo)}>-</Button>
                        <Input value={productInfo.cartInfo.proNum} onChange={this.changeCount.bind(this, productInfo.cartInfo.cartId, productInfo)} /> */}
                        {/* <Button onClick={this.increaseCount.bind(this, productInfo.cartInfo.cartId, productInfo)}>+</Button> */}
                    </div>
                    <div className="item-total-price">
                        {/* ￥{productInfo.price * productInfo.cartInfo.proNum} */}
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