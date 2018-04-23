import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Steps, Checkbox } from 'antd';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import './Style/register.sass';
import { SERVICE_URL } from '../../../conf/config';
const FormItem = Form.Item;
const Step = Steps.Step;
import { httpRequestGet, httpRequestPost } from '../../common/utils';
import { guid, contains } from '../../common/tools';
import { getCookie, messageText, getBase64 } from '../../data/tools';
import FirstStep from './firstStep';

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

    alertMsg = (msg) => {
        var alert = { isShow: true, type: "error", message: msg }
        this.setState({ alert: alert })
    }

    next = () => {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
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

    handleSubmitSecond = (e) => {
        const { telphone } = this.state;
        console.log(telphone)
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                console.log('Received values of form: ', data);
                data.telphone = telphone;
                httpRequestPost(SERVICE_URL + "/user/addUser", { data }, (resData) => {
                    // this.setState({ showLoading: false });
                    console.log("addU", resData)
                    if (resData == true) {
                        console.log("true");
                        this.next();
                    } else {
                        message.error(intl.get("createApplicationFailed"));
                    }
                }, (errorData) => {
                    // this.setState({ showLoading: false })
                    message.error(intl.get("createApplicationFailed"));
                })
                // this.next();
            }
        });
    }

    render() {
        const { current } = this.state;
        const steps = [{
            title: 'First',
            content: <FirstStep next={this.next} handleGetTelphone={this.handleGetTelphone} />,
        }, {
            title: 'Second',
            // content: this.renderSecondStep(),
            content: current == 1 ? this.renderSecondStep() : null,
        }, {
            title: 'Last',
            content: 'Last-content',
        }];
        return (
            <div>
                <div className="step-content">
                    <Steps current={current}>
                        {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                </div>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {
                        current < steps.length - 1
                        &&
                        <Button type="primary" onClick={() => this.next()}>Next</Button>
                    }
                    {
                        current === steps.length - 1
                        &&
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                    }
                    {
                        this.state.current > 0
                        &&
                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                            Previous
                </Button>
                    }
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
                <Form onSubmit={this.handleSubmitSecond}>
                    <FormItem
                        {...formItemLayout}
                        label={intl.get("loginName")}
                        required="true"
                    >
                        {getFieldDecorator('userName', {
                            rules: [{
                                required: true, message: intl.get("loginNameNotnull")
                            }, {
                                eq: 11, message: intl.get("loginNameLength")
                            }],
                        })(
                            <Input placeholder={intl.get("loginName")} disabled={submitLoading} />
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
                                eq: 11, message: intl.get("passwordLength")
                            }],
                        })(
                            <Input placeholder={intl.get("password")} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={intl.get("repassword")}
                        required="true"
                    >
                        {getFieldDecorator('repassword', {
                            rules: [{
                                required: true, message: intl.get("repasswordNotnull")
                            }, {
                                eq: 11, message: intl.get("repasswordLength")
                            }],
                        })(
                            <Input placeholder={intl.get("repassword")} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handleSubmitSecond} loading={submitLoading}>{intl.get("login")}</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }

}

export default Form.create()(Register);