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
import moment from 'moment';

class DetailInfo extends Component {
    state = {
        count: 1,
        productInfo: {},
        showLoading: false,
        commentList: [],
        defaultAddress: {},
        overRange: false
    }

    componentWillMount() {
        const { proId } = this.props.params;
        this.handleChageProductScanNum();
        axios.get(SERVICE_URL + "/product/getProductByProId/" + proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleGetShopInfo(resData);
                    this.handleGetImg(resData);
                    this.handleGetDefaultAddress();
                    this.setState({ showLoading: false, productInfo: resData });
                } else {
                    message.error("获取商品失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                message.error("获取商品失败");
                this.setState({ showLoading: false });
            })
    }

    handleChageProductScanNum = () => {
        const { proId } = this.props.params;
        axios.get(SERVICE_URL + "/product/updateProductScanNum/" + proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("更新浏览次数失败");
                }
            }).catch(error => {
                message.error("更新浏览次数失败");
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
                    message.error("获取图片失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取图片失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetDefaultAddress = () => {
        axios.get(SERVICE_URL + "/product/getDefaultAddress")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false, defaultAddress: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取默认地址失败");
                }
            }).catch(error => {
                // console.log(error);
                // message.error("获取默认地址失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetComment = (proId) => {
        axios.get(SERVICE_URL + "/product/getAllComment/" + proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(comment => {
                        this.handleGetUser(comment);
                    });
                    this.setState({ showLoading: false, commentList: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取评论失败");
                }
            }).catch(error => {
                message.error("获取评论失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetUser = (comment) => {
        axios.get(SERVICE_URL + "/user/getUser/" + comment.userId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    comment.userName = resData.userName;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取用户失败");
                }
            }).catch(error => {
                message.error("获取用户失败");
                this.setState({ showLoading: false });
            });
    }


    handleImgFocus = () => {
        console.log("focus");
    }

    changeCount = (e) => {
        this.setState({ count: e.target.value, overRange: false })
    }

    decreaseCount = () => {
        this.setState({ count: parseInt(this.state.count) - 1, overRange: false })
    }

    increaseCount = () => {
        this.setState({ count: parseInt(this.state.count) + 1, overRange: false })
    }

    callback = (key) => {
        const { productInfo } = this.state;
        if (key == "comment") {
            this.handleGetComment(productInfo.proId);
        }
    }

    handleBuyNow = () => {
        const { productInfo } = this.state;
        productInfo.count = this.state.count;

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
                        if (resData.proNum + count > productInfo.proNum) {
                            this.setState({ overRange: true })
                        } else {
                            this.setState({ overRange: false })
                            this.handleChageProNum(resData);
                        }
                    } else {
                        this.handleAddCart();
                    }
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
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
                    message.error("加入购物车失败");
                }
            }).catch(error => {
                message.error("加入购物车失败");
                this.setState({ showLoading: false });
            });
    }

    handleChageProNum = (cart) => {
        const { productInfo, count } = this.state;
        cart.proNum += count;
        delete cart.updateTime;
        axios.post(SERVICE_URL + "/product/editCartNum", cart)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false })
                    message.success("已加入购物车");
                } else {
                    this.setState({ showLoading: false })
                    message.error("加入购物车商品失败1");
                }

            }).catch(error => {
                message.error("加入购物车商品失败");
                this.setState({ showLoading: false });
            });
    }

    handleViewShop = (shopId) => {
        browserHistory.push(BASE_URL + "/viewShop/" + shopId);
    }

    handleAddCollectProduct = () => {
        const { productInfo } = this.state;
        axios.get(SERVICE_URL + "/product/addCollectProduct/" + productInfo.shopInfo.shopId + "/" + productInfo.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    message.success("收藏成功");
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("收藏商品失败");
                }
            }).catch(error => {
                message.error("收藏商品失败");
                this.setState({ showLoading: false });
            })
    }

    handleIsCollectProductExist = () => {
        const { productInfo } = this.state;
        axios.get(SERVICE_URL + "/product/isCollectProductExist/" + productInfo.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    if (resData == true) {
                        message.warning("商品已收藏");
                    } else {
                        this.handleAddCollectProduct();
                    }
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("判断商品收藏失败");
                }
            }).catch(error => {
                message.error("判断商品收藏失败");
                this.setState({ showLoading: false });
            })
    }

    handleIsCollectShopExist = () => {
        const { productInfo } = this.state;
        axios.get(SERVICE_URL + "/product/isCollectShopExist/" + productInfo.shopInfo.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    if (resData == true) {
                        message.warning("店铺已收藏");
                    } else {
                        this.handleAddCollectShop();
                    }
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("判断商品收藏失败");
                }
            }).catch(error => {
                message.error("判断商品收藏失败");
                this.setState({ showLoading: false });
            })
    }

    handleAddCollectShop = () => {
        const { productInfo } = this.state;
        axios.get(SERVICE_URL + "/product/addCollectShop/" + productInfo.shopInfo.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    message.success("收藏成功");
                    this.setState({ showLoading: false });
                } else {
                    console.log(error)
                    this.setState({ showLoading: false })
                    message.error("收藏店铺失败");
                }
            }).catch(error => {
                message.error("收藏商品失败");
                this.setState({ showLoading: false });
            })
    }

    render() {
        const { count, productInfo, defaultAddress, overRange } = this.state;
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
                            <div className="right-text">
                                {productInfo.shopInfo == null ? null : productInfo.shopInfo.addressArea}
                                &nbsp;至&nbsp;
                                {defaultAddress.area} {defaultAddress.addressName}
                            </div>
                        </div>
                        <div className="text-detail">
                            <div className="left-text">数量</div>
                            <div className="right-text">
                                <Button onClick={this.decreaseCount}>-</Button>
                                <Input value={count} onChange={this.changeCount} />
                                <Button onClick={this.increaseCount}>+</Button>
                            </div>
                            <div className="pro-text">库存：{productInfo.proNum}</div>
                        </div>
                        {count > productInfo.proNum ?
                            <div className="text-detail range-tip">您所填写的商品数量超过库存！</div> : null}
                        {overRange ? <div className="text-detail range-tip" style={{ width: "265px" }}>商品加购件数(含已加购件数)已超过库存</div> : null}
                        <div className="text-detail">
                            <div className={count > productInfo.proNum ? "left-btn-disabled" : "left-btn"}>
                                <Button onClick={this.handleBuyNow} disabled={count > productInfo.proNum ? true : false}>立即购买</Button>
                            </div>
                            <div className={count > productInfo.proNum ? "right-btn-disabled" : "right-btn"}>
                                <Button onClick={this.handleIsCartExist} disabled={count > productInfo.proNum ? true : false}>加入购物车</Button>
                            </div>
                        </div>
                        <div>
                            <Button onClick={this.handleIsCollectProductExist}>收藏宝贝</Button>
                        </div>
                    </div>
                    <div className="shop-info">
                        <div className="shop-name">{productInfo.shopInfo == null ? null : productInfo.shopInfo.shopName}</div>
                        <div className="shop-btn"><Button onClick={productInfo.shopInfo == null ? null : this.handleViewShop.bind(this, productInfo.shopInfo.shopId)}>进入店铺</Button></div>
                        <div className="shop-btn"><Button onClick={this.handleIsCollectShopExist}>收藏店铺</Button></div>
                    </div>
                </div >
                <div className="detailed-info">
                    <Tabs onChange={this.callback} type="card">
                        <TabPane tab="宝贝详情" key="basic">
                            <div className="detailed-header">商品基本信息</div>
                        </TabPane>
                        <TabPane tab="累计评论" key="comment">
                            {this.renderComment()}
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }

    renderComment() {
        const { commentList } = this.state;
        let commentDiv = [];
        commentList.forEach(comment => {
            commentDiv.push(<div className="remark">
                <div className="user-info">
                    <Avatar shape="square" size="large" icon="user" />
                    <div className="user-name">{comment.userName}</div>
                </div>
                <div className="remark-info">
                    <div className="remark-text">{comment.description}</div>
                    <div className="remark-time">{moment(comment.createTime).format("YYYY年MM月DD日 HH:mm:ss")}</div>
                </div>
            </div>)
        });
        return (
            <div>{commentDiv}</div>
        )
    }
}

export default DetailInfo;