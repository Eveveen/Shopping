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


class CartPage extends Component {
    state = {
        count: 1,
        checkedList: [],
        indeterminate: true,
        checkAll: false,
        cartInfos: [],
        shopInfos: [],
        cartItemDiv: '',
        titleDiv: '',
        productList: [],
        productInfo: {},
        shopIds: [],
        shopIdList: [],
        checkedAll: false
    };
    plainOptions = ['apple', 'PERA'];

    componentWillMount() {
        this.handleGetAllCart();
        // this.handleGetAllShop();
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
        product.cartInfo.proNum = e.target.value;
        this.setState({})
    }

    decreaseCount = (cartId, product) => {
        product.cartInfo.proNum = product.cartInfo.proNum - 1;
        this.setState({})
    }

    increaseCount = (cartId, product) => {
        product.cartInfo.proNum = product.cartInfo.proNum + 1;
        this.setState({})
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

    handleCheckboxProduct = (proId, checked, e) => {
        const { shopIdList } = this.state;
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
        if (shopFlag) {
            this.state.checkedAll = true;
        } else {
            this.state.checkedAll = false;
        }
        this.setState({})
    }

    handleCheckboxShop = (shopId, checked, e) => {
        const { shopIdList } = this.state;
        let shopFlag = true;
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
        if (shopFlag) {
            this.state.checkedAll = true;
        } else {
            this.state.checkedAll = false;
        }
        this.setState({})
    }

    handleCheckAll = (e) => {
        const { shopIdList } = this.state;
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
        if (flag == true) {
            checkedAll = true;
        } else {
            checkedAll = false;
        }
        this.setState({ checkedAll: checkedAll })
    }

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.plainOptions.length),
            checkAll: checkedList.length === this.plainOptions.length,
        });
    }


    handleBuy = () => {
        browserHistory.push(BASE_URL + "/buy");
    }

    render() {
        const { cartItemDiv, productInfo, cartInfos, shopIdList, productList, checkedAll } = this.state;
        const plainOptions = ['apple', 'PERA'];
        let cartFooterDiv =
            <div>
                勾选购物车内所有商品 全选删除清除失效宝贝移入收藏夹分享已选商品29件合计（不含运费）： ￥2460.40
            </div>
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
                        {/* {cartInfos.length == 0 ? null :
                            cartInfos.forEach(cartInfo => {
                                // if(cartInfo.shopId)
                            })
                        } */}
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
                // productList.forEach(pro => {
                // if (pro.proId == product.proId) {
                cartItemDiv = this.renderProductContent(product);
                // }
                // })
                cartDiv.push(cartItemDiv)
            })
        });
        // });

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
                <Checkbox checked={product.checked} onChange={this.handleCheckboxProduct.bind(this, product.proId, product.checked)}>
                </Checkbox>
                <div className="card-item-content">
                    <div className="left-img">
                        <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
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
                        <span onClick={this.handleDeleteItem.bind(this, product.cartInfo.cartId)}>删除</span>
                    </div>
                </div>
            </div>)
        return (
            <div>{cartItemDiv}</div>
        )
    }

    renderFooterContent() {
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
                <div className="footer-operation"><a onClick={this.delete}>删除</a></div>
                <div className="footer-operation">清除失效宝贝</div>
                <div className="footer-operation"> 移入收藏夹</div>
                <div className="footer-operation"> 已选商品29件</div>
                <div className="footer-operation">合计（不含运费）： ￥2460.40</div>
            </div>
        )
    }
}

export default CartPage;