import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Menu, Table, Divider, Popconfirm } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import '../Style/user.sass';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
const SubMenu = Menu.SubMenu;
import { Link, browserHistory } from 'react-router';
import AddUser from './addUser';

class User extends Component {

    state = {
        userList: [],
        current: 'user',
        showAddUser: false
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/checkIsAdmin")
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    if (data == false) {
                        browserHistory.push(BASE_URL);
                    } else {
                        this.handleGetAllUser();
                    }
                }
            });
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
        browserHistory.push(BASE_URL + "/admin/" + e.key);
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
                    message.error("删除失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("删除失败");
                this.setState({ showLoading: false });
            });
    }

    handleShowAddUser = () => {
        this.setState({ showAddUser: true })
    }

    handleCancelAddUser = () => {
        this.setState({ showAddUser: false })
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
            title: '操作',
            key: 'action',
            render: (text, user) => (
                <span>
                    <a href="javascript:;" className="ant-dropdown-link">
                        <Icon type="edit" onClick={this.handleEditUser.bind(this, user)} />
                    </a>
                    <Popconfirm title="确定删除该用户？" onConfirm={this.handleDeleteUser.bind(this, user.userId)} onCancel={this.handleCancelDelete} okText="Yes" cancelText="No">
                        <Icon type="delete" className="delete-icon" />
                    </Popconfirm>
                </span >
            ),
        }];
        const { userList, showAddUser } = this.state;

        return (
            <div className="admin-user">
                <div className="add-icon" onClick={this.handleShowAddUser}>
                    <Icon type="plus-circle" style={{ fontSize: 24 }} />
                </div>
                <Table
                    columns={columns}
                    dataSource={userList}
                    pagination={{
                        defaultPageSize: 5,
                        total: userList.length,
                        showQuickJumper: true,
                        showSizeChanger: true
                    }}
                />
                {showAddUser ?
                    <AddUser
                        visible={this.state.showAddUser}
                        handleCancel={this.handleCancelAddUser}
                        handleGetAllUser={this.handleGetAllUser}
                    />
                    : null}
            </div>
        )
    }
}

export default User;