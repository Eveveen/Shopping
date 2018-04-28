import React, { Component } from 'react';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider, message } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
// import './Style/main.sass';
import AccountMenu from '../Menu/accountMenu';
import AddAddress from './addAddress';
import EditAddress from './editAddress';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No.',
}, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No',
}, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No',
}];

class AddressList extends Component {
    state = {
        showAddAddress: false,
        addressData: []
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/product/getAllAddress")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    console.log("addressData", resData);
                    this.setState({ showLoading: false, addressData: resData });
                } else {
                    // this.setState({ showLoading: false })
                    // message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                // message.error(intl.get("editFailed"));
                // this.setState({ showLoading: false });
            });
    }

    handleChangeAddressStatus = (id) => {
        console.log("id,,=", id);
        browserHistory.push(BASE_URL + "/account/editAddress/" + id);
        // this.setState({
        //     addressAction: "edit"
        // })
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
                        keyMenu="address"
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
                    <a href="javascript:;" onClick={this.handleChangeAddressStatus.bind(this, data.addressId)}>edit</a>
                    <Divider type="vertical" />
                </span>
            ),
        }];

        return (
            <div className="address-list">
                <div className="address-table">
                    <Table columns={columns} dataSource={this.state.addressData} />
                </div>
                <Icon type="plus-circle" onClick={this.handleShowAddAddress} />
                <AddAddress
                    visible={this.state.showAddAddress}
                    handleCancel={this.handleCancelAddress}
                />
            </div>
        )
    }
}

export default AddressList;