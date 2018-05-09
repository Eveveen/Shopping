import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Steps, Checkbox } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/register.sass';
import { httpRequestGet, httpRequestPost } from '../../common/utils';
import { SERVICE_URL } from '../../../conf/config';

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

class FirstStep extends Component {
    state = {
        submitLoading: false,
        telphone: 0
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


    handleFirstStep = (e) => {
        e.preventDefault();
        // 支付宝调用失败
        // axios.get(SERVICE_URL + "/pay")
        //     .then(response => {
        //         console.log("aaaa", response.data);
        //     }).catch(error => {
        //         console.log(error);
        //     });
        // const { telphone } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let telphone = getFieldValue('telphone');
        console.log(telphone)
        this.props.handleGetTelphone(telphone);
        let addUserFlag = false;
        // let telphone = 0;
        this.props.form.validateFieldsAndScroll((err, data) => {
            if (!err) {
                this.setState({ submitLoading: false });
                // telphone = data.telphone;
                httpRequestPost(SERVICE_URL + "/user/verifyCode", { data }, (resData) => {
                    this.setState({ showLoading: false });
                    console.log("ddddresData", resData)
                    if (resData == true) {
                        this.props.next();
                    }
                }, (errorData) => {
                    this.setState({ showLoading: false })
                    message.error("验证码不正确");
                })
            }
        });
        if (addUserFlag == true) {

        }
    }

    render() {
        return (
            <div>
                {this.renderFirstStep()}
            </div >
        )
    }

    renderFirstStep() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { submitLoading, telphone } = this.state;
        return (
            <div className="first-step">
                <Form onSubmit={this.handleSubmit}>
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
                            <Input placeholder={"手机号码"}
                                setFieldsValue={this.state.telphone}
                                onChange={(e) => { this.setState({ telphone: e.target.value }) }}
                                disabled={submitLoading}
                            />
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
                            <div>
                                <Input placeholder={"验证码"} disabled={submitLoading} />
                                <Button type="primary" onClick={this.getCode} loading={submitLoading}>点击获取验证码</Button>
                            </div>
                        )}
                    </FormItem>
                    <FormItem>
                        <div className="footer-btn">
                            <Button type="primary" onClick={this.handleFirstStep} loading={submitLoading}>下一步</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(FirstStep);