import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Menu, Table, Divider, Popconfirm } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import '../Style/user.sass';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
const SubMenu = Menu.SubMenu;
import { Link, browserHistory } from 'react-router';

class User extends Component {

    state = {
        userList: [],
        current: 'user',
    }

    componentWillMount() {
        this.handleGetAllUser();
    }

    handleGetAllUser = () => {
        axios.get(SERVICE_URL + "/admin/getAllUser")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false, userList: resData });
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

    handleEditUser = (user) => {
        console.log("record,", user);
        browserHistory.push(BASE_URL + "/admin/editUser/" + user.userId);
    }

    handleClick = (e) => {
        console.log('click ', e);
        browserHistory.push(BASE_URL + "/admin/" + e.key);
        // browserHistory.push(BASE_URL + "/" + e.key);

    }

    handleDeleteUser = (userId) => {
        axios.get(SERVICE_URL + "/admin/deleteUser/" + userId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    message.success('删除成功');
                    this.setState({ showLoading: false });
                    this.handleGetAllUser();
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
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
            render: (text, user) => (
                <span>
                    <a href="javascript:;" className="ant-dropdown-link">
                        <Icon type="edit" onClick={this.handleEditUser.bind(this, user)} />
                    </a>
                    <Popconfirm title="Are you sure delete this task?" onConfirm={this.handleDeleteUser.bind(this, user.userId)} onCancel={this.handleCancelDelete} okText="Yes" cancelText="No">
                        <Icon type="delete" />
                    </Popconfirm>
                </span >
            ),
        }];
        const { userList } = this.state;

        return (
            <div className="admin-user">
                <Table columns={columns} dataSource={userList} />
            </div>
        )
    }
}

export default User;