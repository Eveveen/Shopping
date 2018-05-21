import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Layout, AutoComplete, Menu } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
// import './Style/orderItem.sass';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import moment from 'moment';
import { _ } from 'underscore';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { commentTypeEnum } from '../Product/data/enum';

class ShopOrder extends Component {
    state = {
        orderList: [],
        orderNumList: [],
        orderNums: [],
        searchName: '',
        productList: [],
        current: "all",
        shopInfo: {},
        userInfo: {}
    }

    componentWillMount() {
        this.handleGetSellerShop();
    }

    handleGetSellerShop = () => {
        axios.get(SERVICE_URL + "/shop/getSellerShop")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleGetAllOrder(resData);
                    this.setState({ showLoading: false, shopInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleGetAllOrder = (shop) => {
        let shopInfo = shop == undefined ? this.state.shopInfo : shop;
        // const { orderNumList, orderNums } = this.state;
        this.state.orderNumList = [];
        this.state.orderNums = [];
        axios.get(SERVICE_URL + "/shop/getShopOrder/" + shopInfo.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(order => {
                        this.handleGetProduct(order);
                        this.handleGetShopInfo(order);
                        this.handleGetUser(order);
                        if (!_.contains(this.state.orderNums, order.orderNum)) {
                            this.state.orderNums.push(order.orderNum)
                            this.state.orderNumList.push({ "orderNum": order.orderNum, "order": order });
                        }
                    });
                    this.setState({ showLoading: false, orderList: resData });
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

    handleGetUser = (order) => {
        const { userInfo } = this.state;
        axios.get(SERVICE_URL + "/user/getUser/" + order.userId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false, userInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取用户失败");
                }
            }).catch(error => {
                message.error("获取用户失败");
                this.setState({ showLoading: false });
            });
    }

    handleGetOrderByStatus = (commentStatus) => {
        this.state.orderNumList = [];
        this.state.orderNums = [];
        const { orderNumList, orderNums, shopInfo } = this.state;
        let data = {};
        data.shopId = shopInfo.shopId;
        data.commentStatus = commentStatus;
        axios.post(SERVICE_URL + "/shop/getOrderByShopIdAndStatus", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(order => {
                        this.handleGetProduct(order);
                        this.handleGetShopInfo(order);
                        if (!_.contains(orderNums, order.orderNum)) {
                            this.state.orderNums.push(order.orderNum)
                            this.state.orderNumList.push({ "orderNum": order.orderNum, "order": order });
                        }
                    });
                    this.setState({ showLoading: false, orderList: resData, orderNumList: orderNumList });
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

    handleGetShopInfo = (order) => {
        axios.get(SERVICE_URL + "/product/getShop/" + order.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    order.shopInfo = resData;
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

    handleGetProduct = (order) => {
        axios.get(SERVICE_URL + "/product/getProductByProId/" + order.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    order.productInfo = resData;
                    this.handleGetImg(order);
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取商品失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取商品失败");
                this.setState({ showLoading: false });
            })
    }

    handleDeleteOrder = (order) => {
        const { orderNums, orderNumList } = this.state;
        axios.get(SERVICE_URL + "/product/deleteOrder/" + order.orderId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    orderNums.forEach((orderNum, index) => {
                        if (order.orderNum == orderNum) {
                            orderNums.splice(index, 1);
                            orderNumList.splice(index, 1)
                        }
                    });
                    this.handleGetAllOrder();
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("删除失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("删除失败");
                this.setState({ showLoading: false });
            })
    }

    handleClick = (e) => {
        this.setState({ current: e.key });
        if (e.key == "all") {
            this.handleGetAllOrder();
            return;
        }
        if (e.key == "waitPay") {
            this.handleGetOrderByStatus(commentTypeEnum.WAITPAY);
            return;
        }
        if (e.key == "waitSend") {
            this.handleGetOrderByStatus(commentTypeEnum.WAITSEND);
            return;
        }
        if (e.key == "waitConfirm") {
            this.handleGetOrderByStatus(commentTypeEnum.WAITCONFIRM);
            return;
        }
        if (e.key == "waitComment") {
            this.handleGetOrderByStatus(commentTypeEnum.WAITCOMMENT);
            return;
        }
    }

    handleGetImg = (order) => {
        axios.get(SERVICE_URL + "/shop/getImg/" + order.productInfo.imgId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    order.productInfo.imgCode = resData.imgCode;
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

    handleChangeSearchName = (value) => {
        this.setState({ searchName: value })
    }

    handleSearchOrder = () => {
        let data = {};
        this.state.orderNumList = [];
        this.state.orderNums = [];
        const { searchName, orderNums, orderNumList } = this.state;
        // let orderNums = [];
        // let orderNumList = [];
        data.proName = searchName;
        axios.post(SERVICE_URL + "/product/searchOrder", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(order => {
                        this.handleGetProduct(order);
                        this.handleGetShopInfo(order);
                        if (!_.contains(orderNums, order.orderNum)) {
                            this.state.orderNums.push(order.orderNum)
                            this.state.orderNumList.push({ "orderNum": order.orderNum, "order": order });
                        }
                    });
                    this.setState({ showLoading: false, orderList: resData });
                    // this.setState({ showLoading: false, orderList: resData, orderNumList: orderNumList, orderNums: orderNums });
                } else {
                    this.setState({ showLoading: false })
                    message.error("搜索失败");
                }
            }).catch(error => {
                message.error("搜索失败");
                console.log(error)
                this.setState({ showLoading: false });
            });
    }

    handleChangeCommentStatus = (order) => {
        let data = {};
        data.orderNum = order.orderNum;
        data.commentStatus = commentTypeEnum.WAITCONFIRM;
        axios.post(SERVICE_URL + "/product/editOrderCommentStatus", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    let e = {};
                    e.key = this.state.current;
                    this.handleClick(e);
                    this.setState({ showLoading: false })
                } else {
                    console.log(resData.error);
                    this.setState({ showLoading: false })
                    message.error("修改失败");
                }

            }).catch(error => {
                console.log(error);
                message.error("修改失败");
                this.setState({ showLoading: false });
            });
    }

    handleEnter = (e) => {
        if (e.which == 13) {
            this.handleSearchOrder();
        }
    }

    render() {
        return (
            <div className="order-item">
                <Layout>
                    <Header>{this.renderHeader()}</Header>
                    <Content>
                        {this.renderOrderMenu()}
                        {this.renderOrderItem()}
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>

            </div >
        )
    }

    renderHeader() {
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        return (
            <div className="global-search-wrapper">
                <AutoComplete
                    style={{ width: 200 }}
                    // dataSource={dataSource}
                    onChange={this.handleChangeSearchName}
                    placeholder="输入要查询的关键字"
                    className="global-search"
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                >
                    <Input onKeyPress={this.handleEnter}
                        suffix={(
                            <Button className="search-btn" type="primary" onClick={this.handleSearchOrder}>
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </div>
        )
    }

    renderOrderMenu() {
        return (
            <div>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="all">
                        <Icon type="appstore" />全部订单
                    </Menu.Item>
                    <Menu.Item key="waitPay">
                        <Icon type="appstore" />待付款
                    </Menu.Item>
                    <Menu.Item key="waitSend">
                        <Icon type="appstore" />待发货
                    </Menu.Item>
                    <Menu.Item key="waitConfirm">
                        <Icon type="appstore" />待收货
                    </Menu.Item>
                    <Menu.Item key="waitComment">
                        <Icon type="appstore" />待评价
                    </Menu.Item>
                </Menu>
            </div>
        )
    }

    renderOrderItem() {
        const { orderList, orderNumList, orderNums, userInfo } = this.state;
        let titleDiv = '';
        let orderDiv = [];
        orderNumList.forEach(orderNum => {
            titleDiv =
                <div className="card-title">
                    <div className="card-title-text">{moment(orderNum.order.createTime).format("YYYY-MM-DD")}</div>
                    <div className="card-title-text">订单号: {orderNum.order.orderNum}</div>
                    <div className="card-title-text">{orderNum.order.shopInfo == null ? null : orderNum.order.shopInfo.shopName}</div>
                </div>
            orderDiv.push(<Card title={titleDiv} extra={<Icon type="delete" onClick={this.handleDeleteOrder.bind(this, orderNum.order)} />}></Card>);
            orderList.forEach(order => {
                if (order.orderNum == orderNum.orderNum) {
                    orderDiv.push(
                        <div className="card">
                            <Card>
                                <div className="card-item-content">
                                    <div className="left-img">
                                        <img alt={order.productInfo == null ? null : order.productInfo.proName} src={order.productInfo == null ? null : order.productInfo.imgCode} />
                                    </div>
                                    <div className="item-info">
                                        {order.productInfo == null ? null : order.productInfo.proName} &nbsp;&nbsp;
                                        {order.productInfo == null ? null : order.productInfo.description}
                                    </div>
                                    <div className="item-price">
                                        ￥{order.price}
                                    </div>
                                    <div className="item-count">
                                        {order.proNum}
                                    </div>
                                    <div className="item-total-price">
                                        ￥{order.price}
                                    </div>
                                    <div className="item-status">
                                        {userInfo.length == 0 ? null : userInfo.userName}
                                    </div>
                                    <div className="item-status">
                                        {order.commentStatus == commentTypeEnum.WAITCOMMENT
                                            ? "等待买家评价"
                                            : order.commentStatus == commentTypeEnum.WAITCONFIRM
                                                ? "等待买家收货"
                                                : order.commentStatus == commentTypeEnum.WAITPAY
                                                    ? "等待买家付款"
                                                    : order.commentStatus == commentTypeEnum.WAITSEND
                                                        ? <span>买家已付款<br /><Button onClick={this.handleChangeCommentStatus.bind(this, order)}>发货</Button></span>
                                                        : "买家已评价"}
                                    </div>
                                    <div className="item-total-price">
                                        ￥{order.price * order.proNum}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    );
                }
            });
        });

        return (
            <div>{orderDiv}</div>
        )
    }
}

export default ShopOrder;