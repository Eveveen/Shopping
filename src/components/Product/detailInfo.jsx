import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Avatar, Tabs } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import './Style/detailInfo.sass';
const { Meta } = Card;
const TabPane = Tabs.TabPane;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class DetailInfo extends Component {
    state = {
        count: 1,
        productInfo: {},
        showLoading: false
    }

    componentWillMount() {
        const { proId } = this.props.params;
        axios.get(SERVICE_URL + "/product/getProductByProId/" + proId)
            .then(response => {
                const resData = response.data;
                console.log(resData);
                if (response.status == 200 && !resData.error) {
                    this.handleGetShopInfo(resData);
                    this.handleGetImg(resData);
                    this.setState({ showLoading: false, productInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            })
    }

    handleGetShopInfo = (product) => {
        axios.get(SERVICE_URL + "/product/getShop/" + product.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    product.shopInfo = resData;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取店铺信息失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取店铺信息失败");
                this.setState({ showLoading: false });
            })
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
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }


    handleImgFocus = () => {
        console.log("focus");
    }

    changeCount = (e) => {
        console.log(e.target.value);
        this.setState({
            count: e.target.value
        })
    }

    decreaseCount = () => {
        this.setState({ count: this.state.count - 1 })
    }

    increaseCount = () => {
        this.setState({ count: this.state.count + 1 })
    }

    callback = (key) => {
        console.log(key);
    }

    handleBuyNow = () => {
        const { productInfo } = this.state;

        browserHistory.push({ pathname: BASE_URL + "/buyNow/" + productInfo.proId, state: { productInfo: productInfo } });
    }

    handleIsCartExist = () => {
        const { productInfo, count } = this.state;
        let data = {};
        data.proId = productInfo.proId;
        axios.post(SERVICE_URL + "/product/isCartExist", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false });
                    if (resData.cartId != null) {
                        this.handleChageProNum(resData);
                    } else {
                        this.handleAddCart();
                    }
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleAddCart = () => {
        const { productInfo, count } = this.state;
        let data = {};
        data.shopId = productInfo.shopId;
        data.proId = productInfo.proId;
        data.proNum = count;

        axios.post(SERVICE_URL + "/product/addCart", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false });
                    message.success("已加入购物车");
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleChageProNum = (cart) => {
        const { productInfo, count } = this.state;
        cart.proNum += count;

        axios.post(SERVICE_URL + "/product/editCartNum", cart)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false })
                    message.success("已加入购物车");
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
        const { count, productInfo } = this.state;
        console.log(productInfo);
        return (
            <div className="detail">
                <div className="summary-info">
                    <div className="card-info">
                        <Card
                            style={{ width: 400, height: 400 }}
                            cover={<img alt="example" src={productInfo.imgCode} />}
                        >
                            <div className="detail-info-img">
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                            </div>
                        </Card>
                    </div>
                    <div className="text-info">
                        <div className="text-title">
                            {productInfo.proName}
                        </div>
                        <div className="text-detail text-price">
                            <div className="left-text">价格</div>
                            <div className="right-text">￥{productInfo.price}</div>
                        </div>
                        <div className="text-detail">
                            <div className="left-text">配送</div>
                            <div className="right-text">河南洛阳 至 江苏南通</div>
                        </div>
                        <div className="text-detail">
                            <div className="left-text">数量</div>
                            <div className="right-text">
                                <Button onClick={this.decreaseCount}>-</Button>
                                <Input value={count} onChange={this.changeCount} />
                                <Button onClick={this.increaseCount}>+</Button>
                            </div>
                        </div>
                        <div className="text-detail">
                            <div className="left-btn">
                                <Button onClick={this.handleBuyNow}>立即购买</Button>
                            </div>
                            <div className="right-btn">
                                <Button onClick={this.handleIsCartExist}>加入购物车</Button>
                            </div>
                        </div>
                    </div>
                    <div className="shop-info">
                        <div className="shop-name">{productInfo.shopInfo == null ? null : productInfo.shopInfo.shopName}</div>
                        <div className="shop-btn"><Button>进入店铺</Button></div>
                        <div className="shop-btn"><Button>收藏店铺</Button></div>
                    </div>
                </div >
                <div className="detailed-info">
                    <Tabs onChange={this.callback} type="card">
                        <TabPane tab="宝贝详情" key="1">
                            <div className="detailed-header">商品基本信息</div>
                        </TabPane>
                        <TabPane tab="累计评论" key="2">
                            <div className="remark">
                                <div className="user-info">
                                    <Avatar shape="square" size="large" icon="user" />
                                    <div className="user-name">匿名</div>
                                </div>
                                <div className="remark-info">
                                    <div className="remark-text">好评</div>
                                    <div className="remark-time">2018年04月17日 09:52</div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default DetailInfo;