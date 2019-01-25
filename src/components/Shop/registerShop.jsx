import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Steps, Checkbox } from 'antd';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import './Style/registerShop.sass';
const FormItem = Form.Item;
const Step = Steps.Step;
import { httpRequestGet, httpRequestPost } from '../../common/utils';
import { guid, contains } from '../../common/tools';
import { getCookie, messageText, getBase64 } from '../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { Link, browserHistory } from 'react-router';

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

class RegisterShop extends Component {
    state = {
        submitLoading: false,
        current: 0,
        telphone: '',
        alert: {},
        sellerId: ''
    }

    componentWillMount() {
        // console.log(this.state.current)
        this.state.sellerId = this.props.params.sellerId;
        console.log(this.props.params.sellerId);
    }

    handleRegister = (e) => {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        let telphone = getFieldValue('telphone');
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                this.setState({ showLoading: false });
                data.sellerId = this.state.sellerId;
                data.shopStatus = 0;
                data.rate = 0;
                httpRequestPost(SERVICE_URL + "/admin/addShop", { data }, (res) => {
                    message.success("注册成功，等待管理员认证");
                    browserHistory.push(BASE_URL + "/shop");
                }, (errorData) => {
                    this.setState({ showLoading: false })
                    message.error("注册失败");
                })
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { submitLoading, telphone } = this.state;
        return (
            <div className="register-shop-bg">
                <div className="register">
                    <div className="register-form">
                        <Form onSubmit={this.handleRegister}>
                            <FormItem
                                {...formItemLayout}
                            >
                                <div className="add-shop">添加店铺：</div>
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"店铺名称"}
                                required="true"
                            >
                                {getFieldDecorator('shopName', {
                                    rules: [{
                                        required: true, message: "店铺名称不能为空"
                                    }],
                                })(
                                    <Input placeholder={"店铺名称"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="描述"
                            >
                                {getFieldDecorator('description', {
                                    rules: [{ required: true, message: '请输入店铺描述' }],
                                })(
                                    <Input placeholder={"描述"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="店铺地址"
                            >
                                {getFieldDecorator('addressArea', {
                                    rules: [{ required: true, message: "请输入店铺地址" }],
                                })(
                                    <Input placeholder={"店铺地址"} disabled={submitLoading} />
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
}

export default Form.create()(RegisterShop);