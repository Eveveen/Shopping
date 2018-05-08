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

class BuyItem extends Component {
    state = {
        cartIds: [],
        buyList: [],
        shopList: [],
        totalCount: 0
    }

    componentWillMount() {
        let cartIds = this.props.params.id.split(",");
        const { cartList, shopList } = this.props.location.state;
        this.setState({ cartIds: cartIds, buyList: cartList, shopList: shopList })
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
                        {shopList.length == 0 ? null : this.renderProduct()}
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

    renderBuyItem() {
        const { cartIds, buyList, shopList } = this.state;
        let titleDiv =
            <div className="card-title">
                <div className="card-title-text">2018-04-15</div>
                <div className="card-title-text">订单号: 134936846902892832</div>
                <div className="card-title-text">阿福家萌物</div>
            </div>
        return (
            <div className="card">
                <Card title={titleDiv} extra={<Icon type="delete" />}>
                    <div className="card-item-content">
                        <div className="left-img">
                            <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                        </div>
                        <div className="item-info">
                            韩国Laneige兰芝雪凝雪纱双重防晒隔离霜 SPF22 30ML紫色绿色正品
                        </div>
                        <div className="item-status">
                            颜色分类：白色<br />
                            尺码：均码
                        </div>
                        <div className="item-price">
                            ￥151.90
                        </div>
                        <div className="item-count">
                            <Button onClick={this.decreaseCount}>-</Button>
                            <Input onChange={this.handleChageProNum} />
                            <Button onClick={this.increaseCount}>+</Button>
                        </div>
                        <div className="item-total-price">
                            ￥151.90
                        </div>
                    </div>
                </Card>
                <div className="summary-text">
                    <div className="real-pay">
                        <div className="pay-info">
                            <div className="pay-info-content">
                                <span className="real-pay-title">实付款：</span>
                                <span className="real-pay-price">￥26969.42</span>
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
            </div>
        )
    }

    renderProduct() {
        const { buyList, shopList } = this.state;
        let cartDiv = [];
        let tempProductList = [];
        let totalCount = 0;
        shopList.forEach(shop => {
            let titleDiv =
                <div className="card-title">
                    <div className="card-title-text">
                        <div className="card-title-text">店铺：</div>
                        <div className="card-title-text">{shop.shopInfo ? shop.shopInfo.shopName : null}</div>
                    </div>
                </div>
            cartDiv.push(titleDiv);
            tempProductList = shop.productList;
            let flag = false;
            // shop.productList.forEach(product => {
            //     cartItemDiv = this.renderProductContent(product);
            //     cartDiv.push(cartItemDiv)
            // })
            buyList.forEach(cart => {
                let cartItemDiv = [];
                if (cart.product.shopInfo.shopId == shop.shopId) {
                    totalCount += cart.product.price * cart.product.cartInfo.proNum;
                    this.state.totalCount = totalCount;
                    cartItemDiv = this.renderProductContent(cart.product);
                }
                cartDiv.push(cartItemDiv)
            })
        });

        return (
            <div>
                {cartDiv}
            </div>
        )
    }

    renderProductContent = (product) => {
        let cartItemDiv = [];
        cartItemDiv.push(
            <div className="cart-card">
                <div className="card-item-content">
                    <div className="left-img">
                        <img alt="example" src={product.imgCode} />
                    </div>
                    <div className="item-info">
                        {product.proName} {product.description}
                    </div>
                    <div className="item-status">
                        颜色分类：白色<br />
                        尺码：均码
                        </div>
                    <div className="item-price">
                        {product.price}
                    </div>
                    <div className="item-count">
                        <Button onClick={this.decreaseCount.bind(this, product.cartInfo.cartId, product)}>-</Button>
                        <Input value={product.cartInfo.proNum} onChange={this.changeCount.bind(this, product.cartInfo.cartId, product)} />
                        <Button onClick={this.increaseCount.bind(this, product.cartInfo.cartId, product)}>+</Button>
                    </div>
                    <div className="item-total-price">
                        ￥{product.price * product.cartInfo.proNum}
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
export default BuyItem;
// export default withRouter(BuyItem)