import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Menu, Table, Divider, Popconfirm } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/seller.sass';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
const SubMenu = Menu.SubMenu;
import { Link, browserHistory } from 'react-router';
import AddSeller from './addSeller';

class Seller extends Component {

    state = {
        sellerList: [],
        applyShopList: [],
        showAddSeller: false
    }

    componentWillMount() {
        if (this.props.location.pathname == "/admin/shopApply") {
            this.handleGetApplyShop();
        } else {
            this.handleGetAllSeller(this.props.location.pathname);
        }
        this.setState({})
    }

    componentWillReceiveProps(props) {
        // this.handleGetAllSeller(this.props.location.pathname);
        if (props.location.pathname == "/admin/shopApply") {
            this.handleGetApplyShop();
        } else {
            this.handleGetAllSeller();
        }
    }

    handleGetAllSeller = (pathname) => {
        axios.get(SERVICE_URL + "/admin/getAllSeller")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(seller => {
                        this.handleGetSellerShop(seller);
                    });
                    this.setState({ showLoading: false, sellerList: resData });
                } else {
                    message.error("获取卖家失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取卖家失败");
            });
    }

    handleGetApplyShop = () => {
        axios.get(SERVICE_URL + "/admin/getShopByShopStatus/0")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(shop => {
                        this.handleGetSeller(shop);
                        shop.shopInfo = shop;
                        // shop.shopName = resData.shopName;
                        // shop.shopStatus = resData.shopStatus;
                    });
                    console.log(resData);
                    this.setState({ showLoading: false, sellerList: resData });
                } else {
                    message.error("获取卖家失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取卖家失败");
            });
    }

    handleGetSeller = (shop) => {
        axios.get(SERVICE_URL + "/admin/getSeller/" + shop.sellerId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    shop.sellerId = resData.sellerId;
                    shop.sellerName = resData.sellerName;
                    shop.telphone = resData.telphone;
                    shop.email = resData.email;
                    this.setState({ showLoading: false });
                } else {
                    message.error("获取用户失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取用户失败");
            });
    }

    // handleGetApplyShop = (seller) => {
    //     axios.get(SERVICE_URL + "/admin/getShopByShopStatus/0")
    //         .then(response => {
    //             const resData = response.data;
    //             if (response.status == 200 && !resData.error) {
    //                 seller.shopInfo = resData;
    //                 seller.shopName = resData.shopName;
    //                 seller.shopStatus = resData.shopStatus;
    //                 this.setState({ showLoading: false });
    //             } else {
    //                 message.error("获取店铺失败");
    //                 this.setState({ showLoading: false })
    //             }
    //         }).catch(error => {
    //             console.log(error);
    //             this.setState({ showLoading: false })
    //             message.error("获取店铺失败");
    //         });
    // }

    handleGetSellerShop = (seller) => {
        axios.get(SERVICE_URL + "/admin/getSellerShop/" + seller.sellerId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    seller.shopInfo = resData;
                    seller.shopName = resData.shopName;
                    seller.shopStatus = resData.shopStatus;
                    this.setState({ showLoading: false });
                } else {
                    message.error("获取店铺失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取店铺失败");
            });
    }

    handleClick = (e) => {
        console.log('click ', e);
        browserHistory.push(BASE_URL + "/admin/" + e.key);
        // browserHistory.push(BASE_URL + "/" + e.key);

    }

    handleEditSeller = (seller) => {
        console.log(seller);
        browserHistory.push(BASE_URL + "/admin/editSeller/" + seller.sellerId + "/" + seller.shopInfo.shopId);
    }

    handleDeleteSeller = (sellerId) => {
        axios.get(SERVICE_URL + "/admin/deleteSeller/" + sellerId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    message.success('删除成功');
                    this.setState({ showLoading: false });
                    this.handleGetAllSeller();
                } else {
                    this.setState({ showLoading: false })
                    message.error("删除失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("删除失败");
                this.setState({ showLoading: false });
            });
    }

    handleShowAddSeller = () => {
        this.setState({ showAddSeller: true })
    }

    handleCancelAddSeller = () => {
        this.setState({ showAddSeller: false })
    }

    render() {
        const { sellerList, showAddSeller } = this.state;
        const columns = [{
            title: '姓名',
            dataIndex: 'sellerName',
            key: 'sellerName',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '手机号码',
            dataIndex: 'telphone',
            key: 'telphone',
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        }, {
            title: '店铺名称',
            dataIndex: 'shopName',
            key: 'shopName',
        }, {
            title: '店铺状态',
            dataIndex: 'shopStatus',
            key: 'shopStatus',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, seller) => (
                <span>
                    <a href="javascript:;" className="ant-dropdown-link">
                        <Icon type="edit" onClick={this.handleEditSeller.bind(this, seller)} />
                    </a>
                    <Popconfirm title="Are you sure delete this task?" onConfirm={this.handleDeleteSeller.bind(this, seller.sellerId)} onCancel={this.handleCancelDelete} okText="Yes" cancelText="No">
                        <Icon type="delete" className="delete-icon" />
                    </Popconfirm>
                </span >
            ),
        }];
        return (
            <div className="admin-seller">
                <div className="add-icon" onClick={this.handleShowAddSeller}>
                    <Icon type="plus-circle" style={{ fontSize: 24 }} />
                </div>
                <div>
                    <Table columns={columns} dataSource={sellerList} />
                </div>
                {showAddSeller ?
                    <AddSeller
                        visible={this.state.showAddSeller}
                        handleCancel={this.handleCancelAddSeller}
                        handleGetAllSeller={this.handleGetAllSeller}
                    />
                    : null}
            </div>
        )
    }
}

export default Seller;