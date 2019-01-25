import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Tabs } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import { httpRequestGet, httpRequestPost } from '../../common/utils';
import { guid, contains, messageText } from '../../common/tools';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
const TabPane = Tabs.TabPane;

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

class Login extends Component {
    state = {
        submitLoading: false,
        role: "user"
    }

    handleLogin = (e) => {
        const { role } = this.state;
        this.setState({ submitLoading: true });
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, data) => {
            console.log(data);
            if (!err) {
                if (role == "user") {
                    this.handleUserLogin(data);
                    this.setState({ submitLoading: false })
                    return;
                }
                if (role == "seller") {
                    this.handleSellerLogin(data);
                    this.setState({ submitLoading: false })
                    return;
                }
                if (role == "admin") {
                    this.handleAdminLogin(data);
                    this.setState({ submitLoading: false })
                    return;
                }
            }
        });
    }

    handleUserLogin = (data) => {
        httpRequestPost(SERVICE_URL + "/user/login", { data }, (resData) => {
            if (resData) {
                browserHistory.push(BASE_URL + "/home");
                this.setState({ submitLoading: false });
            } else {
                message.error("用户登录失败");
                this.setState({ submitLoading: false });
            }
        }, (errorData) => {
            message.error("用户登录失败");
            this.setState({ submitLoading: false })
        })
    }

    handleSellerLogin = (data) => {
        httpRequestPost(SERVICE_URL + "/shop/login", { data }, (resData) => {
            this.setState({ submitLoading: false });
            if (resData) {
                browserHistory.push(BASE_URL + "/shop");
            } else {
                message.error("卖家登录失败");
                this.setState({ submitLoading: false });
            }
        }, (errorData) => {
            console.log(errorData);
            this.setState({ submitLoading: false })
            message.error("卖家登录失败");
        })
    }

    handleAdminLogin = (data) => {
        httpRequestPost(SERVICE_URL + "/admin/login", { data }, (resData) => {
            this.setState({ submitLoading: false });
            if (resData) {
                browserHistory.push(BASE_URL + "/admin");
            } else {
                message.error("管理员登录失败");
                this.setState({ submitLoading: false });
            }
        }, (errorData) => {
            console.log(errorData);
            this.setState({ submitLoading: false })
            message.error("管理员登录失败");
        })
    }

    callback = (key) => {
        this.setState({ role: key })
    }

    handleToRegister = () => {
        const { role } = this.state;
        if (role == "user") {
            browserHistory.push(BASE_URL + "/register");
        } else if (role == "seller") {
            browserHistory.push(BASE_URL + "/registerSeller");
        }

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading } = this.state;
        return (
            <div className="login-background" style={{
                // backgroundImage: "url(assets/img/login.jpg)", height: "100%",
                // backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", MozBackgroundSize: "100% 100%"
            }}>
                <div className="login">
                    &nbsp;
                    <div className="login-form">
                        <Tabs defaultActiveKey="user" onChange={this.callback}>
                            <TabPane tab={<span><Icon type="apple" />我是买家</span>} key="user">
                                {this.renderLogin()}
                            </TabPane>
                            <TabPane tab={<span><Icon type="android" />我是卖家</span>} key="seller">
                                {this.renderLogin()}
                            </TabPane>
                            <TabPane tab={<span><Icon type="android" />管理员</span>} key="admin">
                                {this.renderLogin()}
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>

        )
    }

    renderLogin() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading, role } = this.state;
        return (
            <div>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label={"用户名"}
                        required="true"
                    >
                        {getFieldDecorator(role == "user" ? 'userName' : role == "seller" ? 'sellerName' : "name", {
                            rules: [{
                                required: true, message: "用户名不能为空"
                            }, {
                                max: 50, message: "用户名过长"
                            }],
                        })(
                            <Input placeholder={"用户名"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"密码"}
                        required="true"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: "密码不能为空"
                            }, {
                                max: 50, message: "密码过长"
                            }],
                        })(
                            <Input type="password" placeholder={"密码"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handleLogin} loading={submitLoading}>{"登录"}</Button>
                    </FormItem>
                </Form>
                <hr />
                <div className="register-btn">
                    {role == "admin" ? null : <a onClick={this.handleToRegister}>点击注册</a>}
                </div>
            </div>
        )
    }
}

export default Form.create()(Login);