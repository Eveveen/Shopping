import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { Button, Input, Select, Upload, Modal, message, Icon, Form } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import { httpRequestGet, httpRequestPost } from '../../common/utils';
import { guid, contains, messageText } from '../../common/tools';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

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
        submitLoading: false
    }

    handleLogin = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, data) => {
            console.log(data);
            if (!err) {
                this.setState({ submitLoading: true });
                httpRequestPost(SERVICE_URL + "/user/login", { data }, (resData) => {
                    this.setState({ showLoading: false });
                }, (errorData) => {
                    this.setState({ showLoading: false })
                    this.alertMsg(messageText(errorData.code, intl.get("initSourceFailedTip")));
                })
            }
        });

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading } = this.state;
        return (
            <div className="login-background" style={{
                backgroundImage: "url(assets/img/login.jpg)", height: "100%",
                backgroundRepeat: "no-repeat", backgroundSize: "100% 100%", MozBackgroundSize: "100% 100%"
            }}>
                <div className="login">
                    &nbsp;
                    <div className="login-form">
                        <Form>
                            <FormItem
                                {...formItemLayout}
                                label={intl.get("username")}
                                required="true"
                            >
                                {getFieldDecorator('userName', {
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
                                    <Input placeholder={intl.get("password")} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" onClick={this.handleLogin} loading={submitLoading}>{intl.get("login")}</Button>
                            </FormItem>
                        </Form>
                        <hr />
                        <Link to="register">点击注册</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(Login);