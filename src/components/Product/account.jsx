import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './Style/account.sass';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import AddAddress from './addAddress';
import EditAddress from './editAddress';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6, offset: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

const residences = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];

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


class Account extends Component {
    state = {
        manageStatus: 1,
        submitLoading: false,
        showAddAddress: false,
        addressAction: "list"
    }

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            manageStatus: e.key,
            addressAction: "list"
        })
    }

    handleSavePersonInfo = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.next();
            }
        });
    }

    handleShowAddAddress = () => {
        this.setState({
            showAddAddress: true
        })
    }

    handleChangeAddressStatus = () => {
        this.setState({
            addressAction: "edit"
        })
    }

    render() {
        const { manageStatus } = this.state;
        return (
            <div className="manage">
                <div className="manage-menu">
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 256 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="light"
                    >
                        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>帐号管理</span></span>}>
                            <Menu.Item key="1">个人资料</Menu.Item>
                            <Menu.Item key="2">收货地址</Menu.Item>
                        </SubMenu>
                    </Menu>
                </div>
                <div className="manage-menu-content">
                    {manageStatus == 1 ? this.renderPersonalInfo() : this.renderAddress()}
                </div>
            </div>
        )
    }

    renderPersonalInfo() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading } = this.state;
        return (
            <div className="personal-info">
                <Form onSubmit={this.handleSavePersonInfo} className="personal-info-form">
                    <FormItem
                        {...formItemLayout}
                        label={"用户头像"}
                    >
                        {getFieldDecorator('telphone', {
                            rules: [],
                        })(
                            <Input placeholder={intl.get("telphone")} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"昵称"}
                        required="true"
                    >
                        {getFieldDecorator('nickname', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                        })(
                            <Input placeholder={"nickname"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="居住地"
                    >
                        {getFieldDecorator('residence', {
                            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                            rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
                        })(
                            <Cascader options={residences} />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSavePersonInfo}>
                            保存
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }

    renderAddress() {
        const { addressAction } = this.state;
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
                {addressAction == "list" ?
                    <div className="address-table"><Table columns={columns} dataSource={data} /></div> : <EditAddress />}
            </div>
        )
    }
}

export default Form.create()(Account);