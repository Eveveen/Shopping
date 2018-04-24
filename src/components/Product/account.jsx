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
import AddressList from './addressList';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import AccountMenu from '../Menu/accountMenu';
import { httpRequestGet, httpRequestPost } from '../../common/utils';

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

class Account extends Component {
    state = {
        manageStatus: "member",
        submitLoading: false,
        showAddAddress: false,
        addressAction: "list",
        userInfo: {}
    }

    componentWillMount() {
        httpRequestGet(SERVICE_URL + "/user/getUserInfo", (resData) => {
            this.setState({ showLoading: false, userInfo: resData });
        }, (errorData) => {
            this.setState({ showLoading: false })
            this.alertMsg(messageText(errorData.code, intl.get("initSourceFailedTip")));
        })
    }

    handleSavePersonInfo = (e) => {
        e.preventDefault();
        const { userInfo } = this.state;
        this.props.form.validateFields((err, data) => {
            data.userId = userInfo.userId;
            data.role = 1;
            console.log("0000");
            if (!err) {
                httpRequestPost(SERVICE_URL + "/user/updateUser", { data }, (resData) => {
                    // this.setState({ showLoading: false });
                    console.log(resData)
                }, (errorData) => {
                    // this.setState({ showLoading: false })
                    message.error(intl.get("createApplicationFailed"));
                })
            }
        });
    }


    render() {
        console.log("hello");
        const { manageStatus } = this.state;
        return (
            <div className="manage">
                <div className="manage-menu">
                    <AccountMenu
                        keyMenu="member"
                    />
                </div>
                <div className="manage-menu-content">
                    {this.renderPersonalInfo()}
                </div>
            </div>
        )
    }

    renderPersonalInfo() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading, userInfo } = this.state;
        return (
            <div className="personal-info">
                <Form onSubmit={this.handleSavePersonInfo} className="personal-info-form">
                    <FormItem
                        {...formItemLayout}
                        label={"用户头像"}
                    >
                        {getFieldDecorator('avatar', {
                            rules: [],
                            initialValue: userInfo.avatar
                        })(
                            <Input placeholder={intl.get("telphone")} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"手机号码"}
                    >
                        {getFieldDecorator('telphone', {
                            rules: [],
                            initialValue: userInfo.telphone
                        })(
                            <Input placeholder={intl.get("telphone")} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"昵称"}
                        required="true"
                    >
                        {getFieldDecorator('userName', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                            initialValue: userInfo.userName
                        })(
                            <Input placeholder={"nickname"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"密码"}
                        required="true"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                            initialValue: userInfo.password
                        })(
                            <Input placeholder={"password"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"邮箱"}
                        required="true"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                            initialValue: userInfo.email
                        })(
                            <Input placeholder={"email"} disabled={submitLoading} />
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

}

export default Form.create()(Account);