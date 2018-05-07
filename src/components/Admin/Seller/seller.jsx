import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Menu, Table, Divider } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import '../Style/user.sass';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
const SubMenu = Menu.SubMenu;
import { Link, browserHistory } from 'react-router';

class Seller extends Component {

    state = {
        current: 'seller',
    }

    handleClick = (e) => {
        console.log('click ', e);
        browserHistory.push(BASE_URL + "/admin/" + e.key);
        // browserHistory.push(BASE_URL + "/" + e.key);

    }

    render() {
        const columns = [{
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
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
            render: (text, record) => (
                <span>
                    <a href="javascript:;">Action 一 {record.name}</a>
                </span>
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
                <Table columns={columns} dataSource={data} />
            </div>
        )
    }
}

export default Seller;