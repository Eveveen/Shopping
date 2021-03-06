import React, { Component } from 'react';
import { Button, Input, message, Card, Avatar, Tabs, Spin } from 'antd';
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
        showLoading: true,
        commentList: [],
        overRange: false,
        isLogin: false,
        defaultAddress: { area: "江苏", addressName: "南通" },
        getCurrentPositionResult: null,
        imgList: [],
        showImg: {}
    }


    componentWillMount() {
        // var point = new BMap.Point(116.331398, 39.897445);
        // map.centerAndZoom(point, 12);
        var map = new BMap.Map("allmap");
        var geolocation = new BMap.Geolocation();
        var defaultAddress = { area: "", addressName: "" }

        this.handleIsLogin();
        const { proId } = this.props.params;
        this.handleChageProductScanNum();
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getProductByProId/" + proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleGetShopInfo(resData);
                    this.handleGetImg(resData);
                    axios.get(SERVICE_URL + "/checkIsUser")
                        .then(response => {
                            const data = response.data;
                            if (!data.error) {
                                if (data == false) {
                                    geolocation.getCurrentPosition((r) => {
                                        defaultAddress.area = r.address.province;
                                        defaultAddress.addressName = r.address.city;
                                        this.setState({ defaultAddress: defaultAddress })
                                    }, { enableHighAccuracy: true })
                                    //this.setState({ defaultAddress: defaultAddress })
                                } else {
                                    this.handleGetDefaultAddress();
                                }
                            }
                        });
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

    handleIsLogin = () => {
        axios.get(SERVICE_URL + "/checkIsUser")
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    this.setState({ isLogin: data })
                }
            });
    }

    handleChageProductScanNum = () => {
        const { proId } = this.props.params;
        this.state.showLoading = true;
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
        this.state.showLoading = true;
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
        this.state.showLoading = true;
        product.imgIdList.forEach((imgId, index) => {
            axios.get(SERVICE_URL + "/shop/getImg/" + imgId)
                .then(response => {
                    const resData = response.data;
                    if (response.status == 200 && !resData.error) {
                        product.imgCode = resData.imgCode;
                        if (index == 0) {
                            this.state.showImg = { imgId: imgId, imgCode: resData.imgCode };
                        }
                        this.state.imgList.push({ imgId: imgId, imgCode: resData.imgCode })
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
        })
    }

    handleGetDefaultAddress = () => {
        this.state.showLoading = true;
        var map = new BMap.Map("allmap");
        var geolocation = new BMap.Geolocation();
        var defaultAddress = { area: "", addressName: "" }
        axios.get(SERVICE_URL + "/product/getDefaultAddress")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    if (resData != "") {
                        this.setState({ defaultAddress: resData })
                    } else {
                        geolocation.getCurrentPosition((r) => {
                            defaultAddress.area = r.address.province;
                            defaultAddress.addressName = r.address.city;
                            this.setState({ defaultAddress: defaultAddress })
                        }, { enableHighAccuracy: true })
                    }
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取默认地址失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取默认地址失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetComment = (proId) => {
        this.state.showLoading = true;
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
        this.state.showLoading = true;
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


    handleImgFocus = (img) => {
        console.log("focus");
        this.setState({ showImg: img })
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
        if (this.state.isLogin) {
            const { productInfo } = this.state;
            productInfo.count = this.state.count;
            console.log("----");
            browserHistory.push({ pathname: BASE_URL + "/buyNow/" + productInfo.proId, state: { productInfo: productInfo } });
        } else {
            browserHistory.push(BASE_URL + "/login")
        }
    }

    handleIsCartExist = () => {
        if (this.state.isLogin) {
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
                        message.error("判断商品失败存在失败");
                    }
                }).catch(error => {
                    message.error("判断商品失败存在失败");
                    this.setState({ showLoading: false });
                });
        } else {
            browserHistory.push(BASE_URL + "/login")
        }
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
        if (this.state.isLogin) {
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
        } else {
            browserHistory.push(BASE_URL + "/login")
        }
    }

    handleIsCollectShopExist = () => {
        if (this.state.isLogin) {
            const { productInfo } = this.state;
            this.state.showLoading = true;
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
        } else {
            browserHistory.push(BASE_URL + "/login")
        }
    }

    handleAddCollectShop = () => {
        const { productInfo } = this.state;
        this.state.showLoading = true;
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
        const { count, productInfo, defaultAddress, overRange, imgList, showImg } = this.state;
        let moreImgDiv = [];
        let imgsDiv = [];
        console.log(imgList);
        imgList.length == 0 ? null : imgList.forEach(img => {
            moreImgDiv.push(<img alt="image" src={img.imgCode} onClick={this.handleImgFocus.bind(this, img)} />)
            imgsDiv.push(<img alt="img" src={img.imgCode} />);
        });
        return (
            <Spin size="large" spinning={this.state.showLoading}>
                <div className="detail">
                    <div className="summary-info">
                        <div className="card-info">
                            <Card
                                style={{ width: 400, height: 400 }}
                                cover={<img alt="example" src={showImg.imgCode} />}
                            >
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
                                <div className="pro-text">库存：{productInfo.proNum}件</div>
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
                            {/* <div className="collect-btn">
                                <Button onClick={this.handleIsCollectProductExist}>收藏宝贝</Button>
                            </div> */}
                            <div className="right-text-foot">
                                <div className="detail-info-img">
                                    {moreImgDiv}
                                </div>
                                <div className="collect-btn">
                                    <Button onClick={this.handleIsCollectProductExist}>收藏宝贝</Button>
                                </div>
                            </div>
                        </div>

                    </div >
                    <div className="detailed-info">
                        <div className="shop-info">
                            <div className="shop-name">{productInfo.shopInfo == null ? null : productInfo.shopInfo.shopName}</div>
                            <div className="shop-btn"><Button onClick={productInfo.shopInfo == null ? null : this.handleViewShop.bind(this, productInfo.shopInfo.shopId)}>进入店铺</Button></div>
                            <div className="shop-btn"><Button onClick={this.handleIsCollectShopExist}>收藏店铺</Button></div>
                        </div>
                        <Tabs onChange={this.callback} type="card">
                            <TabPane tab="宝贝详情" key="basic">
                                <div className="detailed-content">
                                    <div className="product-content">
                                        <div className="line">产品参数：</div>
                                        <div className="line">
                                            <div className="left-line">
                                                <div className="left-text">产品名称：</div>
                                                <div className="right-text">{productInfo.proName}</div>
                                            </div>
                                            <div className="right-line">
                                                <div className="left-text">产品描述：</div>
                                                <div className="right-text">{productInfo.description}</div>
                                            </div>
                                        </div>
                                        <div className="line">
                                            <div className="left-line">
                                                <div className="left-text">定价：</div>
                                                <div className="right-text">{productInfo.price}元</div>
                                            </div>
                                            <div className="right-line">
                                                <div className="left-text">库存：</div>
                                                <div className="right-text">{productInfo.proNum} 件</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="product-img">
                                        {imgsDiv}
                                        {/* <img alt="img" src={showImg.imgCode} /> */}
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="累计评论" key="comment">
                                {this.renderComment()}
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </Spin>
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