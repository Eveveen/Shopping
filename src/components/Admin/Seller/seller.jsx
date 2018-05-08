import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Menu, Table, Divider, Popconfirm } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/seller.sass';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
const SubMenu = Menu.SubMenu;
import { Link, browserHistory } from 'react-router';

class Seller extends Component {

    state = {
        current: 'seller',
        sellerList: []
    }

    componentWillMount() {
        this.handleGetAllSeller();
    }

    handleGetAllSeller = () => {
        axios.get(SERVICE_URL + "/admin/getAllSeller")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(seller => {
                        this.handleGetSellerShop(seller);
                    });
                    this.setState({ showLoading: false, sellerList: resData });
                } else {
                    message.error("获取地址失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取地址失败");
            });
    }

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

    render() {
        const { sellerList } = this.state;
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
                        <Icon type="delete" />
                    </Popconfirm>
                </span >
            ),
        }];
        const data = [{
            key: '1',
            name: 'John Brown',
            telphone: 32,
            email: 'New York No. 1 Lake Park',
            shopName: 'John Brown',
            shopStatus: '1',
        }, {
            key: '2',
            name: 'Jim Green',
            telphone: 42,
            email: 'London No. 1 Lake Park',
            shopName: 'John Brown',
            shopStatus: '1',
        }, {
            key: '3',
            name: 'Joe Black',
            telphone: 32,
            email: 'Sidney No. 1 Lake Park',
            shopName: 'John Brown',
            shopStatus: '1',
        }];
        return (
            <div className="admin-user">
                <Table columns={columns} dataSource={sellerList} />
            </div>
        )
    }
}

export default Seller;