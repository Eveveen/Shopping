import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Menu, Table, Divider } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import '../Style/user.sass';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
const SubMenu = Menu.SubMenu;
import { Link, browserHistory } from 'react-router';

class User extends Component {

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
            dataIndex: 'userName',
            key: 'userName',
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
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a href="javascript:;">Action 一 {record.name}</a>
                    <Divider type="vertical" />
                    <a href="javascript:;">Delete</a>
                    <Divider type="vertical" />
                    <a href="javascript:;" className="ant-dropdown-link">
                        More actions <Icon type="down" />
                    </a>
                </span>
            ),
        }];
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        }];
        return (
            <div className="admin-user">
                <Table columns={columns} dataSource={data} />
            </div>
        )
    }
}

export default User;