import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Steps, Checkbox } from 'antd';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import './Style/register.sass';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { Link, browserHistory } from 'react-router';
const FormItem = Form.Item;
const Step = Steps.Step;
import { httpRequestGet, httpRequestPost } from '../../common/utils';
import { guid, contains } from '../../common/tools';
import { getCookie, messageText, getBase64 } from '../../data/tools';

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

class Register extends Component {
    state = {
        submitLoading: false,
        current: 0,
        telphone: '',
        alert: {},
    }

    componentWillMount() {
        // console.log(this.state.current)
    }

    handleGetTelphone = (telphone) => {
        console.log("telphone,,", telphone);
        this.setState({
            telphone: telphone
        })
    }

    handleSubmit = (e) => {

        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                console.log('Received values of form: ', data);

            }
        });
    }

    getCode = () => {
        // const { telphone } = this.state; 
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let telphone = getFieldValue('telphone');
        console.log(telphone)
        //发送短信验证码
        httpRequestPost(SERVICE_URL + "/user/getCode", { telphone: telphone }, (resData) => {
            this.setState({ showLoading: false });
            message.success("发送成功");
        }, (errorData) => {
            console.log(errorData);
            this.setState({ showLoading: false })
            message.error("发送短信验证码失败");
        })
    }

    checkConfirmPassword = (rule, value, callback) => {
        const form = this.props.form;
        var password = form.getFieldValue('password')
        if (value != password) {
            callback("确认密码不一致");
        } else {
            callback();
        }
    }

    handleRegister = (e) => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let telphone = getFieldValue('telphone');
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                httpRequestPost(SERVICE_URL + "/user/verifyCode", { data }, (resData) => {
                    this.setState({ showLoading: false });
                    if (resData == true) {
                        httpRequestPost(SERVICE_URL + "/user/addUser", { data }, (resData) => {
                            this.setState({ showLoading: false });
                            if (resData == true) {
                                message.success("注册成功");
                                browserHistory.push(BASE_URL + "/login");
                            } else {
                                message.error("注册失败");
                            }
                        }, (errorData) => {
                            this.setState({ showLoading: false })
                            message.error("注册失败");
                        })
                    }
                }, (errorData) => {
                    console.log(errorData);
                    this.setState({ showLoading: false })
                    message.error("验证码不正确");
                })
            }
        });
    }

    // handleFirstStep = (e) => {
    //     e.preventDefault();
    //     // 支付宝调用失败
    //     // axios.get(SERVICE_URL + "/pay")
    //     //     .then(response => {
    //     //         console.log("aaaa", response.data);
    //     //     }).catch(error => {
    //     //         console.log(error);
    //     //     });
    //     // const { telphone } = this.state;
    //     const { getFieldDecorator, getFieldValue } = this.props.form;
    //     let telphone = getFieldValue('telphone');
    //     console.log(telphone)
    //     this.props.handleGetTelphone(telphone);
    //     let addUserFlag = false;
    //     // let telphone = 0;
    //     this.props.form.validateFieldsAndScroll((err, data) => {
    //         if (!err) {
    //             this.setState({ submitLoading: false });
    //             // telphone = data.telphone;
    //             httpRequestPost(SERVICE_URL + "/user/verifyCode", { data }, (resData) => {
    //                 this.setState({ showLoading: false });
    //                 console.log("ddddresData", resData)
    //                 if (resData == true) {
    //                     this.props.next();
    //                 }
    //             }, (errorData) => {
    //                 console.log();
    //                 this.setState({ showLoading: false })
    //                 message.error("验证码不正确");
    //             })
    //         }
    //     });
    //     if (addUserFlag == true) {

    //     }
    // }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { submitLoading, telphone } = this.state;
        return (
            <div className="register-bg">
                <div className="register">
                    <div className="register-form">
                        <Form onSubmit={this.handleRegister}>
                            <FormItem
                                {...formItemLayout}
                                label={"手机号码"}
                                required="true"
                            >
                                {getFieldDecorator('telphone', {
                                    rules: [{
                                        required: true, message: "手机号码不能为空"
                                    }, {
                                        eq: 11, message: "手机号码长度不正确"
                                    }],
                                })(
                                    <div className="register-tel">
                                        <Input placeholder={"手机号码"}
                                            setFieldsValue={this.state.telphone}
                                            onChange={(e) => { this.setState({ telphone: e.target.value }) }}
                                            disabled={submitLoading}
                                        />
                                    </div>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"验证码"}
                                required="true"
                            >
                                {getFieldDecorator('validateCode', {
                                    rules: [{
                                        required: true, message: "验证码不能为空"
                                    }],
                                })(
                                    <div className="register-validator">
                                        <Input placeholder={"验证码"} disabled={submitLoading} />
                                        <Button type="primary" onClick={this.getCode} loading={submitLoading}>点击获取验证码</Button>
                                    </div>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"用户名"}
                                required="true"
                            >
                                {getFieldDecorator('userName', {
                                    rules: [{
                                        required: true, message: "用户名不能为空"
                                    }, {
                                        eq: 50, message: "用户名长度过长"
                                    }],
                                })(
                                    <Input placeholder={"用户名"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"邮箱"}
                            >
                                {getFieldDecorator('email', {
                                    rules: [{
                                        required: true, message: "邮箱不能为空",
                                    }, {
                                        type: 'email', message: "邮箱格式不正确"
                                    }, {
                                        max: 50, message: "邮箱长度过长"
                                    }],
                                })(
                                    <Input placeholder="邮箱" />
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
                                        eq: 11, message: "密码长度过长"
                                    }],
                                })(
                                    <Input type="password" placeholder={"密码"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"确认密码"}
                                required="true"
                            >
                                {getFieldDecorator('repassword', {
                                    rules: [{
                                        required: true, message: "请输入确认密码",
                                    }, {
                                        validator: this.checkConfirmPassword,
                                    }],
                                })(
                                    <Input type="password" placeholder={"确认密码"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem>
                                <div className="footer-btn">
                                    <Button type="primary" onClick={this.handleRegister} loading={submitLoading}>注册</Button>
                                </div>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

    renderLogin() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your telphone!' }],
                        })(
                            <div className="register-input">
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            </div>
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <div className="register-input">
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            </div>
                        )}
                    </FormItem>
                    <FormItem>
                        <div className="register-forget">
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(
                                <Checkbox>Remember me</Checkbox>
                            )}
                            <a className="login-form-forgot" href="">Forgot password</a>
                        </div>
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSubmit}>
                            Log in
                        </Button>
                        Or <a href="">register now!</a>
                    </FormItem>
                </Form>
            </div>
        );

    }

    renderSecondStep() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading } = this.state;
        return (
            <div>
                <Form onSubmit={this.handleRegister}>
                    <FormItem
                        {...formItemLayout}
                        label={"用户名"}
                        required="true"
                    >
                        {getFieldDecorator('userName', {
                            rules: [{
                                required: true, message: "用户名不能为空"
                            }, {
                                eq: 50, message: "用户名长度过长"
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
                                eq: 11, message: "密码长度过长"
                            }],
                        })(
                            <Input placeholder={"密码"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"确认密码"}
                        required="true"
                    >
                        {getFieldDecorator('repassword', {
                            rules: [{
                                required: true, message: "确认密码不能为空"
                            }],
                        })(
                            <Input placeholder={"确认密码"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handleRegister} loading={submitLoading}>{intl.get("login")}</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }

}

export default Form.create()(Register);