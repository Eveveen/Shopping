import React, { Component } from 'react';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider } from 'antd';
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
        showAddAddress: false
    }

    handleChangeAddressStatus = () => {
        browserHistory.push(BASE_URL + "/account/editAddress");
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
            dataIndex: 'name',
            key: 'name',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '所在地区',
            dataIndex: 'age',
            key: 'age',
        }, {
            title: '详细地址',
            dataIndex: 'detailAddress',
            key: 'detailAddress',
        }, {
            title: '电话/手机',
            dataIndex: 'telphone',
            key: 'telphone',
        }, {
            title: '邮编',
            dataIndex: 'address',
            key: 'address',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Divider type="vertical" />
                    <a href="javascript:;" onClick={this.handleChangeAddressStatus}>edit</a>
                    <Divider type="vertical" />
                </span>
            ),
        }];

        return (
            <div className="address-list">
                <div className="address-table">
                    <Table columns={columns} dataSource={data} />
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