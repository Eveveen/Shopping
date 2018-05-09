import React, { Component } from 'react';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider, message, Popconfirm } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
// import './Style/main.sass';
import AccountMenu from '../Menu/accountMenu';
import AddAddress from './addAddress';
import EditAddress from './editAddress';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class AddressList extends Component {
    state = {
        showAddAddress: false,
        addressData: []
    }

    componentWillMount() {
        this.handleGetAllAddress();
    }

    handleGetAllAddress = () => {
        axios.get(SERVICE_URL + "/product/getAllAddress")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    console.log("addressData", resData);
                    this.setState({ showLoading: false, addressData: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取地址失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取地址失败");
                this.setState({ showLoading: false });
            });
    }

    handleEditAddress = (id) => {
        browserHistory.push(BASE_URL + "/account/user/editAddress/" + id);
    }

    handleDeleteAddress = (id) => {
        axios.get(SERVICE_URL + "/product/deleteAddress/" + id)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false, address: resData });
                    this.handleGetAllAddress();
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

    handleShowAddAddress = () => {
        this.setState({
            showAddAddress: true
        })
    }

    handleCancelAddress = () => {
        this.setState({
            showAddAddress: false
        })
    }

    render() {
        return (
            <div className="manage">
                <div className="manage-menu">
                    <AccountMenu
                        keyMenu="user/address"
                    />
                </div>
                <div className="manage-menu-content">
                    {this.renderAddress()}
                </div>
            </div >
        )
    }

    renderAddress() {
        const columns = [{
            title: '收货人',
            dataIndex: 'consignee',
            key: 'consignee',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '手机号码',
            dataIndex: 'telphone',
            key: 'telphone',
        }, {
            title: '所在地区',
            dataIndex: 'area',
            key: 'area',
        }, {
            title: '详细地址',
            dataIndex: 'addressName',
            key: 'addressName',
        }, {
            title: '邮编',
            dataIndex: 'zipCode',
            key: 'zipCode',
        }, {
            title: '默认地址',
            dataIndex: 'addressStatus',
            key: 'addressStatus',
        }, {
            title: 'Action',
            key: 'addressId',
            render: (data, record) => (
                <span>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={this.handleEditAddress.bind(this, data.addressId)}>
                        <Icon type="edit" />
                    </a>
                    <Divider type="vertical" />
                    <Divider type="vertical" />
                    <a href="javascript:;" >
                        <Popconfirm title="Are you sure delete this task?" onConfirm={this.handleDeleteAddress.bind(this, data.addressId)} onCancel={this.handleCancelDelete} okText="Yes" cancelText="No">
                            <Icon type="delete" className="delete-icon" />
                        </Popconfirm>
                    </a>
                    <Divider type="vertical" />
                </span>
            ),
        }];

        return (
            <div className="address-list">
                <div className="add-icon" onClick={this.handleShowAddUser}>
                    <Icon type="plus-circle" style={{ fontSize: 24 }} onClick={this.handleShowAddAddress} />
                </div>
                <div className="address-table">
                    <Table columns={columns} dataSource={this.state.addressData} />
                </div>
                <AddAddress
                    visible={this.state.showAddAddress}
                    handleCancel={this.handleCancelAddress}
                    handleGetAllAddress={this.handleGetAllAddress}
                />
            </div>
        )
    }
}

export default AddressList;