import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Steps,Checkbox  } from 'antd';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import './Style/register.sass';
import { SERVICE_URL } from '../../../conf/config';
const FormItem = Form.Item;
const Step = Steps.Step;

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
    }

    componentWillMount() {
        console.log(this.state.current)
    }

    next = () => {
        const current = this.state.current + 1;
        console.log("current",current)
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }

    getCode = () => {
        // 发送短信验证码
        axios.post(SERVICE_URL + "/getCode")
        .then(response => {
            console.log("aaaa",response.data);
            // const resData = response.data;
            // if (!resData.error) {
            //     this.props.handleShowList();
            //     this.props.handleCancel();
            // } else {
            //     message.error(messageText(resData.error.code, intl.get("createApplicationFailed")));
            // }
            // this.setState({ iconImg: "", iconId: "", submitLoading: false });
        }).catch(error => {
            console.log(error);
            // message.error(intl.get("createApplicationFailed"));
            // this.setState({ iconImg: "", iconId: "", submitLoading: false });
        });
    }

    handleNextStep = (e) => {
        e.preventDefault();
        // 支付宝调用失败
        axios.get(SERVICE_URL + "/pay")
        .then(response => {
            console.log("aaaa",response.data);
        }).catch(error => {
            console.log(error);
        });
        this.props.form.validateFieldsAndScroll((err, data) => {
            if (!err) {
                this.setState({ submitLoading: false });
                console.log("hhhel  ",err)
                this.next()
            }
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
        if (!err) {
            console.log('Received values of form: ', values);
            this.next();
        }
        });
    }

    render() {
        const { current } = this.state;
        console.log("current,",current)
        const steps = [{
            title: 'First',
            content: this.renderFirstStep(),
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
            <div className="steps-content">{steps[this.state.current].content}</div>
            <div className="steps-action">
              {
                this.state.current < steps.length - 1
                &&
                <Button type="primary" onClick={() => this.next()}>Next</Button>
              }
              {
                this.state.current === steps.length - 1
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

    renderLogin(){
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

    renderFirstStep() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading } = this.state;
        return(
            <div className="first-step">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label={intl.get("telphone")}
                        required="true"
                    >
                        {getFieldDecorator('telphone', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                        })(
                            <Input placeholder={intl.get("telphone")} disabled={submitLoading} />
                            )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={intl.get("validateCode")}
                        required="true"
                    >
                        {getFieldDecorator('validateCode', {
                            rules: [{
                                required: true, message: intl.get("validateCodeNotnull")
                            }],
                        })(
                            <div>
                            <Input placeholder={intl.get("validateCode")} disabled={submitLoading} />
                            <Button type="primary" onClick={this.getCode} loading={submitLoading}>点击获取验证码</Button>
                            </div>
                            )}
                    </FormItem>
                    <FormItem>
                        <div className="footer-btn">
                            <Button type="primary" onClick={this.handleNextStep} loading={submitLoading}>{intl.get("login")}</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        )
    }

    renderSecondStep() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading } = this.state;
        return(
            <div>
                <Form onSubmit={this.handleSubmit2}>
                    <FormItem
                        {...formItemLayout}
                        label={intl.get("loginName")}
                        required="true"
                    >
                        {getFieldDecorator('loginName', {
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
                        <Button type="primary" onClick={this.next} loading={submitLoading}>{intl.get("login")}</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
    
}

export default Form.create()(Register);