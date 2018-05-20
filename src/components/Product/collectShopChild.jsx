import React, { Component } from 'react';
import {
    Button, Input, Select, Upload, Modal, message, Icon, Form,
    Avatar, Card, Col, Row
} from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/collectShopChild.sass';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { Link, browserHistory } from 'react-router';
import './Style/antd.sass';

class CollectShopChild extends Component {
    componentWillReceiveProps(props) {
        if (props.collectShopList != null) {

            this.setState({})
        }
    }

    handleGetShopInfo = (collectShop) => {
        axios.get(SERVICE_URL + "/product/getShop/" + collectShop.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    collectShop.shopInfo = resData;
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

    handleViewShop = (shopId) => {
        browserHistory.push(BASE_URL + "/viewShop/" + shopId);
    }

    handleShowProductDetail = (proId) => {
        browserHistory.push(BASE_URL + "/item/" + proId);
    }

    render() {
        const { collectShopList } = this.props;
        let collectShopDiv = [];
        let shopDiv = '';
        collectShopList.forEach(collectShop => {
            shopDiv =
                <div className="collect-shop">
                    <div className="left-shop-avatar">
                        <Avatar onClick={this.handleViewShop.bind(this, collectShop.shopId)} src={collectShop.sellerInfo == null ? null : collectShop.sellerInfo.imgCode} />
                    </div>
                    <div className="left-shop-text" onClick={this.handleViewShop.bind(this, collectShop.shopId)}>
                        {collectShop.shopInfo == null ? null : collectShop.shopInfo.shopName}
                    </div>
                </div>
            let productDiv = [];
            collectShop.productList == null ? null :
                collectShop.productList.forEach((product, index) => {
                    if (product.shopId == collectShop.shopId && index < 5) {
                        productDiv.push(
                            <div className="right-treasure">
                                <Card
                                    bordered={false}
                                    cover={<img alt="example" src={collectShop.productList[index].imgCode} />}
                                    onClick={this.handleShowProductDetail.bind(this, collectShop.productList[index].proId)}
                                >
                                </Card>
                            </div>
                        )
                    } else if (product.shopId != collectShop.shopId) {
                        productDiv.push(<div></div>);
                    }
                });
            collectShopDiv.push(
                <div className="collect-shop-item">
                    {shopDiv}
                    <div className="right-product">{productDiv}</div>
                </div>);
        });
        return (
            <div>{collectShopDiv}</div>
        )
    }
}

export default CollectShopChild;