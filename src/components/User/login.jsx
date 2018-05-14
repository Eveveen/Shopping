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
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, data) => {
            console.log(data);
            if (!err) {
                this.setState({ submitLoading: true });
                if (role == "user") {
                    this.handleUserLogin(data);
                    return;
                }
                if (role == "seller") {
                    this.handleSellerLogin(data);
                    return;
                }
            }
        });
    }

    handleUserLogin = (data) => {
        httpRequestPost(SERVICE_URL + "/user/login", { data }, (resData) => {
            this.setState({ showLoading: false });
            if (resData) {
                // axios.get(SERVICE_URL + "/user/getUserInfo")
                //     .then(response => {
                //         const resData = response.data;
                //         if (response.status == 200 && !resData.error) {
                //             this.setState({ showLoading: false, userInfo: resData });
                //         } else {
                //             this.setState({ showLoading: false })
                //             message.error(intl.get("editFailed"));
                //         }
                //     }).catch(error => {
                //         console.log(error);
                //         message.error(intl.get("editFailed"));
                //         this.setState({ showLoading: false });
                //     });
                browserHistory.push(BASE_URL + "/home");
            } else {
                message.error(intl.get("editFailed"));
            }
        }, (errorData) => {
            this.setState({ showLoading: false })
            message.error(intl.get("editFailed"));
        })
    }

    handleSellerLogin = (data) => {
        httpRequestPost(SERVICE_URL + "/shop/login", { data }, (resData) => {
            this.setState({ showLoading: false });
            if (resData) {
                // axios.get(SERVICE_URL + "/shop/getShopInfo")
                //     .then(response => {
                //         const resData = response.data;
                //         if (response.status == 200 && !resData.error) {
                //             this.setState({ showLoading: false, userInfo: resData });
                //         } else {
                //             this.setState({ showLoading: false })
                //             message.error(intl.get("editFailed"));
                //         }
                //     }).catch(error => {
                //         console.log(error);
                //         message.error(intl.get("editFailed"));
                //         this.setState({ showLoading: false });
                //     });
                browserHistory.push(BASE_URL + "/shop");
            } else {
                message.error(intl.get("editFailed"));
            }
        }, (errorData) => {
            console.log(errorData);
            this.setState({ showLoading: false })
            message.error(intl.get("editFailed"));
        })
    }
    callback = (key) => {
        this.setState({ role: key })
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
                        label={intl.get("username")}
                        required="true"
                    >
                        {getFieldDecorator(role == "user" ? 'userName' : 'sellerName', {
                            rules: [{
                                required: true, message: intl.get("usernameNotnull")
                            }, {
                                max: 50, message: intl.get("usernameLength")
                            }],
                        })(
                            <Input placeholder={intl.get("username")} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={intl.get("password")}
                        required="true"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: intl.get("passwordNotnull")
                            }, {
                                max: 50, message: intl.get("passwordLength")
                            }],
                        })(
                            <Input type="password" placeholder={intl.get("password")} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handleLogin} loading={submitLoading}>{intl.get("login")}</Button>
                    </FormItem>
                </Form>
                <hr />
                <Link to="register">点击注册</Link>
            </div>
        )
    }
}

export default Form.create()(Login);