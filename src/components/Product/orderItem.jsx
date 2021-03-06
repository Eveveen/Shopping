import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Layout, AutoComplete, Menu, Spin } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/orderItem.sass';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import moment from 'moment';
import { _ } from 'underscore';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { commentTypeEnum } from './data/enum';
import InfiniteScroll from 'react-infinite-scroller';
import './Style/antd.sass';

class OrderItem extends Component {
    state = {
        orderList: [],
        orderNumList: [],
        orderNums: [],
        searchName: '',
        productList: [],
        current: "all",
        showLoading: true,
        showNum: 4
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/checkIsUser")
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    if (data == false) {
                        browserHistory.push(BASE_URL + "/login");
                    } else {
                        this.handleGetAllOrder();
                    }
                }
            });
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScrollHandle.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollHandle.bind(this));
    }

    onScrollHandle(event) {
        const clientHeight = document.documentElement.clientHeight
        const scrollTop = document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const isBottom = (clientHeight + scrollTop === scrollHeight)
        if (isBottom && this.state.showNum <= this.state.orderList.length) {
            this.setState({ showNum: this.state.showNum + 4 })
            console.log("aaaa", this.state.showNum)
        }
        // console.log("clientHeight", clientHeight)
        // console.log("scrollHeight", scrollHeight)
        // console.log("scrollTop", scrollTop)
        // console.log('is bottom:', isBottom)
        // console.log("scrollTop", document.documentElement.scrollTop)
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

    handleGetAllOrder = () => {
        this.state.orderNumList = [];
        this.state.orderNums = [];
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/product/getAllOrder")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(order => {
                        this.handleGetProduct(order);
                        this.handleGetShopInfo(order);
                        if (!_.contains(this.state.orderNums, order.orderNum)) {
                            this.state.orderNums.push(order.orderNum)
                            this.state.orderNumList.push({ "orderNum": order.orderNum, "order": order });
                        }
                    });
                    this.setState({ showLoading: false, orderList: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取订单失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取订单失败");
                this.setState({ showLoading: false });
            })
    }

    handleGetOrderByStatus = (commentStatus) => {
        this.state.orderNumList = [];
        this.state.orderNums = [];
        this.state.showLoading = true;
        const { orderNumList, orderNums } = this.state;
        let data = {};
        data.commentStatus = commentStatus;
        axios.post(SERVICE_URL + "/product/getOrderByStatus", { data })
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
                    message.error("获取订单失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取订单失败");
                this.setState({ showLoading: false });
            })
    }

    handleGetShopInfo = (order) => {
        this.state.showLoading = true;
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
        this.state.showLoading = true;
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

    handleRemark = (order) => {
        browserHistory.push({ pathname: BASE_URL + "/remark/" + order.orderId, state: { order: order } });
    }

    handleDeleteOrder = (order) => {
        const { orderNums, orderNumList } = this.state;
        this.state.showLoading = true;
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

    handleGetImg = (order) => {
        this.state.showLoading = true;
        axios.get(SERVICE_URL + "/shop/getImg/" + order.productInfo.imgId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    order.productInfo.imgCode = resData.imgCode;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取图片失败");
                }
            }).catch(error => {
                message.error("获取图片失败");
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
        this.state.showLoading = true;
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
        this.state.showLoading = true;
        data.orderNum = order.orderNum;
        data.commentStatus = commentTypeEnum.WAITCOMMENT;
        axios.post(SERVICE_URL + "/product/editOrderCommentStatus", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    let e = {};
                    e.key = this.state.current;
                    this.handleClick(e);
                    this.setState({ showLoading: false })
                } else {
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

    handlePay = (order) => {
        let totalPrice = order.proNum * order.price;
        // browserHistory.push(BASE_URL + "/pay/" + order.orderNum);
        browserHistory.push({ pathname: BASE_URL + "/pay/" + order.orderNum, state: { totalPrice: totalPrice } });
    }

    render() {
        return (
            <div className="order-item">
                <Spin size="large" spinning={this.state.showLoading}>
                    <Layout>
                        <Header>{this.renderHeader()}</Header>
                        <Content>
                            {this.renderOrderMenu()}
                            {this.renderOrderItem()}
                        </Content>
                        <Footer>@2018-eshop</Footer>
                    </Layout>
                </Spin>
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
        const { orderList, orderNumList, orderNums, showNum } = this.state;
        let titleDiv = '';
        let orderDiv = [];
        let olen = 0;

        orderNumList.forEach((orderNum, index) => {
            // if (olen < showNum) {
            if (olen < showNum) {
                titleDiv =
                    <div className="card-title">
                        <div className="card-title-text">{moment(orderNum.order.createTime).format("YYYY-MM-DD")}</div>
                        <div className="card-title-text">订单号: {orderNum.order.orderNum}</div>
                        <div className="card-title-text">{orderNum.order.shopInfo == null ? null : orderNum.order.shopInfo.shopName}</div>
                    </div>
                orderDiv.push(<Card title={titleDiv} extra={<Icon type="delete" onClick={this.handleDeleteOrder.bind(this, orderNum.order)} />}></Card>);
                orderList.forEach((order, i) => {
                    // console.log(showNum);
                    if (order.orderNum == orderNum.orderNum && olen <= showNum) {
                        orderDiv.push(this.renderOrder(order));
                        olen = olen + 1;
                    }
                })
            }
        });

        return (
            <div>
                {orderDiv}
            </div>
        )
    }

    renderOrder(order) {
        // orderList.forEach(order => {
        // if (order.orderNum == orderNum.orderNum) {
        // orderDiv.push(
        return (
            <div className="card">
                <Card>
                    <div className="card-item-content">
                        <div className="left-img">
                            <img alt={order.productInfo == null ? "img" : order.productInfo.proName} src={order.productInfo == null ? null : order.productInfo.imgCode} />
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
                            ￥{order.price * order.proNum}
                        </div>
                        <div className="item-status">
                            交易成功<br />
                            订单详情
                                </div>
                        <div className="item-remark">
                            {order.commentStatus == commentTypeEnum.WAITCOMMENT
                                ? <Button onClick={this.handleRemark.bind(this, order)}>评价</Button>
                                : order.commentStatus == commentTypeEnum.WAITCONFIRM
                                    ? <Button onClick={this.handleChangeCommentStatus.bind(this, order)}>确认收货</Button>
                                    : order.commentStatus == commentTypeEnum.WAITPAY
                                        ? <Button onClick={this.handlePay.bind(this, order)}>付款</Button>
                                        : order.commentStatus == commentTypeEnum.WAITSEND
                                            ? "待发货" : "已评价"}
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default OrderItem;