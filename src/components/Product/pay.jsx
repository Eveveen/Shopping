import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider, message } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './Style/pay.sass';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import AccountMenu from '../Menu/accountMenu';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { Link, browserHistory } from 'react-router';
import { commentTypeEnum } from './data/enum';

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

class Pay extends Component {
    state = {
        manageStatus: 1,
        submitLoading: false,
        address: {}
    }

    componentWillMount() {
        // axios.get(SERVICE_URL + "/product/getAddress/" + this.props.params.id)
        //     .then(response => {
        //         const resData = response.data;
        //         if (response.status == 200 && !resData.error) {
        //             console.log("addressData", resData);
        //             this.setState({ showLoading: false, address: resData });
        //         } else {
        //             // this.setState({ showLoading: false })
        //             // message.error(intl.get("editFailed"));
        //         }
        //     }).catch(error => {
        //         console.log(error);
        //         // message.error(intl.get("editFailed"));
        //         // this.setState({ showLoading: false });
        //     });
    }

    handlePay = (e) => {
        const { totalPrice } = this.props.location.state;
        e.preventDefault();
        const { address } = this.state;
        this.props.form.validateFields((err, data) => {
            if (!err) {
                axios.post(SERVICE_URL + "/product/verifyCard", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error && resData != "") {
                            console.log("success");
                            if (totalPrice > resData.balance) {
                                message.warning("余额不足");
                            } else {
                                console.log(resData);
                                this.handleUpdataCardBalance(resData.balance);
                            }
                            this.setState({ showLoading: false });
                        } else if (resData == "") {
                            message.error("帐号或密码错误");
                        } else {
                            console.log(resData.error);
                            this.setState({ showLoading: false })
                            message.error("付款失败");
                        }
                    }).catch(error => {
                        console.log(error);
                        message.error("付款失败");
                        this.setState({ showLoading: false });
                    });
            }
        });
    }

    handleUpdataCardBalance = (balance) => {
        const { totalPrice } = this.props.location.state;
        const { getFieldValue } = this.props.form;
        let data = {};
        data.telphone = getFieldValue('telphone');
        data.balance = balance - totalPrice;
        axios.post(SERVICE_URL + "/product/updateCardBalance", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleChangeCommentStatus();
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("付款失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("付款失败");
                this.setState({ showLoading: false });
            });
    }

    handleChangeCommentStatus = () => {
        const { order } = this.state;
        const { orderNum } = this.props.params;
        let data = {};
        data.orderNum = orderNum;
        data.commentStatus = commentTypeEnum.WAITSEND;
        axios.post(SERVICE_URL + "/product/editOrderCommentStatus", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    browserHistory.push(BASE_URL + "/success");
                    this.setState({ showLoading: false })
                } else {
                    this.setState({ showLoading: false })
                    message.error("修改失败");
                }

            }).catch(error => {
                console.log(error);
                message.error("修改失败");
                this.setState({ showLoading: false });
            });
    }

    handleCancel = () => {
        browserHistory.push(BASE_URL + "/account/user/address");
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading } = this.state;
        return (
            <div className="pay">
                <Form onSubmit={this.handlePay} className="personal-info-form">
                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                    >
                        {getFieldDecorator('telphone', {
                            rules: [{ required: true, message: "手机号码" }],
                        })(
                            <Input placeholder={"手机号码"} style={{ width: '100%' }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"密码"}
                        required="true"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: "请输入密码"
                            }],
                        })(
                            <Input placeholder={"密码"} type="password" disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.handlePay}>确认付款</Button>
                    </FormItem>
                </Form>
            </div >
        )
    }
}

export default Form.create()(Pay);