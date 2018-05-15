import React, { Component } from 'react';
import { Layout, Table, Button, List, message, Avatar, Spin, Card, Icon, Input, Checkbox } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/cartPage.sass';
const CheckboxGroup = Checkbox.Group;
import CartFooter from './cartFooter';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { _ } from 'underscore';
// import { withRouter } from 'react-router';


class CartPage extends Component {
    state = {
        count: 1,
        cartInfos: [],
        cartItemDiv: '',
        titleDiv: '',
        productList: [],
        productInfo: {},
        shopIds: [],
        shopIdList: [],
        checkedAll: false,
        selectedCartIds: [],
        totalCount: 0,
        overRange: false
    };

    componentWillMount() {
        this.handleGetAllCart();
    }

    handleGetAllCart = () => {
        const { shopIds, shopIdList } = this.state;
        axios.get(SERVICE_URL + "/product/getAllCart")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(cartInfo => {
                        if (!_.contains(shopIds, cartInfo.shopId)) {
                            shopIds.push(cartInfo.shopId)
                            shopIdList.push({ "shopId": cartInfo.shopId, "productList": [] });
                        }
                    });
                    this.setState({ showLoading: false, cartInfos: resData, shopIds: shopIds });
                    this.handleGetShop();
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取购物车失败");
                }
            }).catch(error => {
                message.error("获取购物车失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetShop = () => {
        const { shopIdList, cartInfos, shopIds } = this.state;
        cartInfos.forEach(cartInfo => {
            axios.get(SERVICE_URL + "/product/getShop/" + cartInfo.shopId)
                .then(response => {
                    const resData = response.data;
                    if (response.status == 200 && !resData.error) {
                        let shopInfo = resData;
                        shopIdList.forEach(shop => {
                            if (shop.shopId == cartInfo.shopId) {
                                shop.shopInfo = shopInfo;
                                shop.checked = false;
                            }
                        });
                        this.setState({ showLoading: false });
                        this.handleGetProduct(cartInfo, shopInfo);
                    } else {
                        this.setState({ showLoading: false })
                        message.error("获取店铺失败");
                    }
                }).catch(error => {
                    message.error("获取店铺失败");
                    this.setState({ showLoading: false });
                });
        });

    }

    handleGetProduct = (cartInfo, shopInfo) => {
        const { count, shopIdList, shopIds, productList } = this.state;
        shopIdList.forEach(shop => {
            shop.productList = [];
        });
        axios.get(SERVICE_URL + "/product/getProduct/" + cartInfo.shopId + "/" + cartInfo.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.cartInfo = cartInfo;
                    resData.shopInfo = shopInfo;
                    if (resData.imgId != null) {
                        this.handleGetImg(resData);
                    }
                    productList.push(resData);

                    shopIdList.forEach(shop => {
                        productList.forEach((product, index) => {
                            if (shop.shopId == product.shopInfo.shopId && !_.contains(shop.productList, product)) {
                                product.checked = false;
                                shop.productList.push(product);
                            }
                        });
                    });
                    this.setState({ productInfo: resData })
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取商品失败1");
                }
            }).catch(error => {
                message.error("获取商品失败2");
                this.setState({ showLoading: false });
            });
    }

    changeCount = (cartId, product, e) => {
        let proNum = parseInt(e.target.value);
        product.overRange = false;
        // this.setState({ overRange: false })
        if (proNum > product.proNum) {
            proNum = product.proNum;
            product.overRange = true;
            // this.setState({ overRange: true })
        }
        if (proNum <= 0 || isNaN(proNum) == true) {
            proNum = 1;
        }
        let cart = { "cartId": cartId, "proNum": proNum }
        this.handleChageProNum(cart, product);
        this.setState({})
    }

    decreaseCount = (cartId, product) => {
        let cart = { "cartId": cartId, "proNum": parseInt(product.cartInfo.proNum) - 1 }
        product.overRange = false;
        this.handleChageProNum(cart, product);
        this.setState({})
    }

    increaseCount = (cartId, product) => {
        let cart = { "cartId": cartId, "proNum": parseInt(product.cartInfo.proNum) + 1 }
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

    handleDeleteItem = (cartId) => {
        const { shopIdList, cartInfos, productList } = this.state;
        axios.get(SERVICE_URL + "/product/deleteOneCart/" + cartId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    shopIdList.forEach((shop, index) => {
                        shop.productList.forEach(product => {
                            if (product.cartInfo.cartId === cartId && shop.productList.length == 1) {
                                shop.shopInfo = {};
                                shopIdList.splice(index, 1)
                            }
                        });

                    });

                    this.setState({ showLoading: false, productList: [] })
                    this.handleGetAllCart();
                } else {
                    this.setState({ showLoading: false })
                    message.error("删除购物车商品失败1");
                }

            }).catch(error => {
                message.error("删除购物车商品失败");
                this.setState({ showLoading: false });
            });

        this.setState({})
    }

    handleDeleteMoreItem = () => {
        const { shopIdList, cartInfos, productList, selectedCartIds } = this.state;
        axios.post(SERVICE_URL + "/product/deleteMoreCart", { selectedCartIds: selectedCartIds })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    shopIdList.forEach((shop, index) => {
                        shop.productList.forEach(product => {
                            selectedCartIds.forEach(cartId => {
                                if (product.cartInfo.cartId === cartId && shop.productList.length == 1) {
                                    shop.shopInfo = {};
                                    shopIdList.splice(index, 1)
                                }
                            });

                        });

                    });

                    this.setState({ showLoading: false, productList: [] })
                    this.handleGetAllCart();
                } else {
                    this.setState({ showLoading: false })
                    console.log(error);
                    message.error("删除购物车商品失败1");
                }

            }).catch(error => {
                console.log(error);
                message.error("删除购物车商品失败");
                this.setState({ showLoading: false });
            });

        this.setState({})
    }

    handleCheckboxProduct = (proId, checked, e) => {
        const { shopIdList, selectedCartIds, productList } = this.state;
        let totalCount = this.state.totalCount;
        let shopId = '';
        let shopFlag = true;
        shopIdList.forEach(shop => {
            let productFlag = true;
            shop.productList.forEach(product => {
                if (proId == product.proId) {
                    product.checked = e.target.checked;
                }
                if (product.checked == false) {
                    shop.checked = false;
                    this.state.checkedAll = false;
                    productFlag = false;
                    shopFlag = false;
                }
                if (productFlag) {
                    shop.checked = true;
                }
            });
            if (shop.checked == false) {
                shopFlag = false;
            }
        });

        productList.forEach((product, index) => {
            if (product.proId == proId) {
                if (product.checked && !_.contains(selectedCartIds, product.cartInfo.cartId)) {
                    selectedCartIds.push(product.cartInfo.cartId);
                    totalCount += product.cartInfo.proNum * product.price;
                } else if (_.contains(selectedCartIds, product.cartInfo.cartId) && product.checked == false) {
                    totalCount -= product.cartInfo.proNum * product.price;
                    selectedCartIds.forEach((id, idIndex) => {
                        if (id == product.cartInfo.cartId) {
                            selectedCartIds.splice(idIndex, 1);
                        }
                    });
                }
            }
        });
        if (shopFlag) {
            this.state.checkedAll = true;
        } else {
            this.state.checkedAll = false;
        }
        this.setState({ totalCount: totalCount })
    }

    handleCheckboxShop = (shopId, checked, e) => {
        const { shopIdList, productList, selectedCartIds } = this.state;
        let shopFlag = true;
        let totalCount = this.state.totalCount;
        shopIdList.forEach(shop => {
            if (shopId == shop.shopId) {
                shop.checked = e.target.checked;
            }
            if (shop.checked == false) {
                shopFlag = false;

            }
            shop.productList.forEach(product => {
                if (shopId == product.shopInfo.shopId) {
                    product.checked = shop.checked;
                }
            });
        });
        productList.forEach((product, index) => {
            if (product.shopInfo.shopId == shopId) {
                if (product.checked && !_.contains(selectedCartIds, product.cartInfo.cartId)) {
                    selectedCartIds.push(product.cartInfo.cartId);
                    totalCount += product.cartInfo.proNum * product.price;
                } else if (_.contains(selectedCartIds, product.cartInfo.cartId) && product.checked == false) {
                    totalCount -= product.cartInfo.proNum * product.price;
                    selectedCartIds.forEach((id, idIndex) => {
                        if (id == product.cartInfo.cartId) {
                            selectedCartIds.splice(idIndex, 1);
                        }
                    });
                }
            }
        });
        if (shopFlag) {
            this.state.checkedAll = true;
        } else {
            this.state.checkedAll = false;
        }
        this.setState({ totalCount: totalCount })
    }

    handleCheckAll = (e) => {
        const { shopIdList, selectedCartIds, productList } = this.state;
        let flag = true;
        let checkedAll = false;
        shopIdList.forEach(shop => {
            shop.checked = e.target.checked;
            if (shop.checked == false) {
                flag = false;
            }
            shop.productList.forEach(product => {
                product.checked = shop.checked;
                if (product.checked == false) {
                    flag = false;
                }
            });
        });

        let totalCount = 0;
        if (flag == true) {
            checkedAll = true;
            productList.forEach((product, index) => {
                if (product.checked && !_.contains(selectedCartIds, product.cartInfo.cartId)) {
                    selectedCartIds.push(product.cartInfo.cartId);
                    totalCount += product.cartInfo.proNum * product.price;
                } else if (_.contains(selectedCartIds, product.cartInfo.cartId) && product.checked == false) {
                    selectedCartIds.forEach((id, idIndex) => {
                        if (id == product.cartInfo.cartId) {
                            selectedCartIds.splice(idIndex, 1);
                        }
                    });
                }
            });
        } else {
            checkedAll = false;
            this.state.selectedCartIds = [];
        }

        this.setState({ checkedAll: checkedAll, totalCount: totalCount })
    }

    handleBuy = () => {
        const { selectedCartIds, productList, shopIdList } = this.state;
        let cartList = [];
        let shopList = [];
        selectedCartIds.forEach(cartId => {
            productList.forEach(product => {
                if (cartId == product.cartInfo.cartId) {
                    cartList.push({ "cartId": cartId, "product": product })
                }
            })
            shopIdList.forEach((shop, index) => {
                shop.productList.forEach(pro => {
                    if (pro.cartInfo.cartId == cartId && !_.contains(shopList, shop)) {
                        shopList.push(shop);
                    }
                });
            });
        });
        browserHistory.push({ pathname: BASE_URL + "/buy/" + selectedCartIds, state: { cartList: cartList, shopList: shopList } });
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

    handleShowProductDetail = (proId) => {
        browserHistory.push(BASE_URL + "/item/" + proId);
    }

    render() {
        const { cartItemDiv, productInfo, cartInfos, shopIdList, productList, checkedAll, selectedCartIds } = this.state;
        return (
            <div className="cart-page">
                <Layout>
                    <Header>Header</Header>
                    <Content>
                        <Checkbox
                            onChange={this.handleCheckAll}
                            checked={this.state.checkedAll}
                        >
                            全选
                        </Checkbox>
                        {productInfo.proId == null ? null : this.renderProduct()}
                    </Content>
                    <Footer>
                    </Footer>
                    <div className="cart-footer">
                        <CartFooter
                            footerShow={true}
                            footerContent={this.renderFooterContent()}
                            handleBuy={this.handleBuy}
                        />
                    </div>

                </Layout>
            </div >
        )
    }

    renderProduct() {
        const { count, cartInfos, productInfo, shopIdList, productList } = this.state;
        let cartDiv = [];
        let tempProductList = [];
        shopIdList.forEach(shop => {
            let cartItemDiv = [];
            let titleDiv =
                <div className="card-title">
                    <Checkbox checked={shop.checked} onChange={this.handleCheckboxShop.bind(this, shop.shopId, shop.checked)}>
                        <div className="card-title-text">
                            <div className="card-title-text">店铺：</div>
                            <div className="card-title-text">{shop.shopInfo ? shop.shopInfo.shopName : null}</div>
                        </div>
                    </Checkbox>
                </div>
            cartDiv.push(titleDiv);
            tempProductList = shop.productList;
            let flag = false;
            shop.productList.forEach(product => {
                cartItemDiv = this.renderProductContent(product);
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
        const { overRange } = this.state;
        let cartItemDiv = [];
        cartItemDiv.push(
            <div className="cart-card">
                {product.proNum == 0 || product.proStatus == 0 ? <div className="cart-disabled-bg"></div> : null}
                {product.proNum == 0 || product.proStatus == 0 ? <span className="cart-disabled-text">失效</span> : <Checkbox disabled={product.proNum == 0 ? true : false} checked={product.checked} onChange={this.handleCheckboxProduct.bind(this, product.proId, product.checked)}>
                </Checkbox>}
                <div className="card-item-content">
                    <div className="left-img" onClick={this.handleShowProductDetail.bind(this, product.proId)}>
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
                    <div className="range-count">
                        {product.proNum == 0 ?
                            <div className="item-count">{product.cartInfo.proNum}</div>
                            :
                            <div className="item-count">
                                <Button onClick={this.decreaseCount.bind(this, product.cartInfo.cartId, product)} disabled={product.cartInfo.proNum <= 1 ? true : false}>-</Button>
                                <Input value={product.cartInfo.proNum} onChange={this.changeCount.bind(this, product.cartInfo.cartId, product)} />
                                <Button onClick={this.increaseCount.bind(this, product.cartInfo.cartId, product)} disabled={product.cartInfo.proNum >= product.proNum || overRange ? true : false}>+</Button>
                            </div>
                        }
                        {product.overRange ? <div className="range-tip">最多只能购买{product.proNum}件</div> : null}
                    </div>
                    <div className="item-total-price">
                        ￥{product.price * product.cartInfo.proNum}
                    </div>
                    <div className="item-operation">
                        <span onClick={this.handleDeleteItem.bind(this, product.cartInfo.cartId)}>删除</span>
                    </div>
                </div>
            </div>)
        return (
            <div>{cartItemDiv}</div>
        )
    }

    renderFooterContent() {
        const { selectedCartIds, totalCount } = this.state;
        return (
            <div className="cart-footer-content">
                <div className="footer-operation">
                    <Checkbox
                        onChange={this.handleCheckAll}
                        checked={this.state.checkedAll}
                    >
                        全选
                    </Checkbox>
                </div>
                <div className="footer-operation"><a onClick={this.handleDeleteMoreItem}>删除</a></div>
                <div className="footer-operation">清除失效宝贝</div>
                <div className="footer-operation"> 移入收藏夹</div>
                <div className="footer-operation"> 已选商品{selectedCartIds.length}件</div>
                <div className="footer-operation">合计（不含运费）： ￥{totalCount}</div>
            </div>
        )
    }
}

export default CartPage;
// export default withRouter(CartPage)