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
        //发送短信验证码
        httpRequestPost(SERVICE_URL + "/user/getCode", { telphone: telphone }, (resData) => {
            this.setState({ showLoading: false });
        }, (errorData) => {
            this.setState({ showLoading: false })
            message.error(intl.get("createApplicationFailed"));
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
                    message.error(intl.get("createApplicationFailed"));
                })
            }
            console.log("addUserFlag", typeof addUserFlag)
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
                            <Input placeholder={intl.get("telphone")}
                                setFieldsValue={this.state.telphone}
                                onChange={(e) => { this.setState({ telphone: e.target.value }) }}
                                disabled={submitLoading}
                            />
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
                            <Button type="primary" onClick={this.handleFirstStep} loading={submitLoading}>{intl.get("login")}</Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

export default Form.create()(FirstStep);