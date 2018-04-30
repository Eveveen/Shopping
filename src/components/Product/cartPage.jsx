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


class CartPage extends Component {
    state = {
        count: 1,
        checkedList: [],
        indeterminate: true,
        checkAll: false,
        cartInfos: [],
        shopInfos: [],
        cartItemDiv: ''
    };
    plainOptions = ['apple', 'PERA'];

    componentWillMount() {
        this.handleGetAllCart();
        // this.handleGetAllShop();
        console.log(this.state.cartInfos);
    }

    handleGetAllCart = () => {
        axios.get(SERVICE_URL + "/product/getAllCart")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(cartInfo => {
                        this.handleGetShop(cartInfo.shopId);
                    });
                    this.setState({ showLoading: false, cartInfos: resData });
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

    handleGetShop = (id) => {
        console.log("0000", id);

        axios.get(SERVICE_URL + "/product/getShop/" + id)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    let shopInfo = resData;
                    let cartItemDiv = [];
                    cartItemDiv.push(this.renderItem(shopInfo.shopName));
                    this.setState({ showLoading: false, cartItemDiv: cartItemDiv });
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

    handleGetProduct = (shopId) => {

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

    handleDeleteItem = () => {
        console.log("delete");
    }

    handleOnChange = (e) => {
        console.log(`checked = ${e.target.checked}`);
    }

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.plainOptions.length),
            checkAll: checkedList.length === this.plainOptions.length,
        });
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    handleBuy = () => {
        browserHistory.push(BASE_URL + "/buy");
    }

    render() {
        const { cartItemDiv } = this.state;
        const defaultCheckedList = [this.renderItem()];
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
                            indeterminate={this.state.indeterminate}
                            onChange={this.onCheckAllChange}
                            checked={this.state.checkAll}
                        >
                            Check all
                        </Checkbox>
                        <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                        {/* {this.renderItem()} */}
                        {cartItemDiv}
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


    renderItem = (shopName) => {
        const { count } = this.state;
        let titleDiv =
            <div className="card-title">
                <Checkbox onChange={this.handleOnChange}>
                    <div className="card-title-text">
                        <div className="card-title-text">店铺：</div>
                        <div className="card-title-text">{shopName}</div>
                    </div>
                </Checkbox>
                {/* <CheckboxGroup options={this.plainOptions} value={this.state.checkedList} onChange={this.onChange} /> */}

            </div>
        return (
            <div className="cart-card" >
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
                            <Input value={count} onChange={this.changeCount} />
                            <Button onClick={this.increaseCount}>+</Button>
                        </div>
                        <div className="item-total-price">
                            ￥151.90
                        </div>
                        <div className="item-operation">
                            <span onClick={this.handleDeleteItem}>删除</span>
                        </div>
                    </div>
                </Card>
            </div >
        );
    }

    renderFooterContent() {
        return (
            <div className="cart-footer-content">
                <div className="footer-operation">全选</div>
                <div className="footer-operation">删除</div>
                <div className="footer-operation">清除失效宝贝</div>
                <div className="footer-operation"> 移入收藏夹</div>
                <div className="footer-operation"> 已选商品29件</div>
                <div className="footer-operation">合计（不含运费）： ￥2460.40</div>
            </div>
        )
    }
}

export default CartPage;