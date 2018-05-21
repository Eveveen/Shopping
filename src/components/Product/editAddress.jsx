import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Form, Input, Checkbox, Button, Cascader, Select, message, Spin } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './Style/editAddress.sass';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import AccountMenu from '../Menu/accountMenu';
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

class EditAddress extends Component {
    state = {
        manageStatus: 1,
        submitLoading: false,
        address: {},
        showLoading: true
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/product/getAddress/" + this.props.params.id)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false, address: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取地址失败");
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取地址失败");
            });
    }

    handleChageAddressStatus = () => {
        axios.post(SERVICE_URL + "/product/changeAddressStatus")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                } else {
                    message.error("更改默认地址失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("更改默认地址失败");
            });
    }

    handleSavePersonInfo = (e) => {
        e.preventDefault();
        const { address } = this.state;
        this.state.showLoading = true;
        this.props.form.validateFields((err, data) => {
            if (!err) {
                data.addressId = this.props.params.id;
                if (data.addressStatus == true && address.addressStatus == 1) {
                    data.addressStatus = 1;
                } else if (data.addressStatus == true && address.addressStatus != 1) {
                    data.addressStatus = 1;
                    this.handleChageAddressStatus();
                } else {
                    data.addressStatus = 0;
                }
                axios.post(SERVICE_URL + "/product/editAddress", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            this.setState({ showLoading: false });
                            message.success("保存成功");
                        } else {
                            this.setState({ showLoading: false })
                            message.error("保存失败");
                        }
                    }).catch(error => {
                        console.log(error);
                        this.setState({ showLoading: false })
                        message.error("保存失败");
                    });
            }
        });
    }

    handleCancel = () => {
        browserHistory.push(BASE_URL + "/account/user/address");
    }

    render() {
        return (
            <Spin size="large" spinning={this.state.showLoading}>
                <div className="manage">
                    <div className="manage-menu">
                        <AccountMenu
                            keyMenu="user/address"
                        />
                    </div>
                    <div className="manage-menu-content">
                        {this.renderEditAddress()}
                    </div>
                </div >
            </Spin>
        )
    }

    renderEditAddress() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading, address } = this.state;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        return (
            <div className="edit-address">
                <Form onSubmit={this.handleSavePersonInfo} className="personal-info-form">
                    <FormItem
                        {...formItemLayout}
                        label={"收货人姓名"}
                        required="true"
                    >
                        {getFieldDecorator('consignee', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                            initialValue: address.consignee
                        })(
                            <Input placeholder={"nickname"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                    >
                        {getFieldDecorator('telphone', {
                            rules: [{ required: true, message: 'Please input your phone number!' }],
                            initialValue: address.telphone
                        })(
                            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"所在地区"}
                        required="true"
                    >
                        {getFieldDecorator('area', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                            initialValue: address.area
                        })(
                            <Input placeholder={"nickname"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    {/* <FormItem
                        {...formItemLayout}
                        label="所在地区"
                    >
                        {getFieldDecorator('area', {
                            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                            rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
                            // initialValue: address.area
                        })(
                            <Cascader options={residences} />
                        )}
                    </FormItem> */}
                    <FormItem
                        {...formItemLayout}
                        label={"详细地址"}
                        required="true"
                    >
                        {getFieldDecorator('addressName', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                            initialValue: address.addressName
                        })(
                            <Input placeholder={"nickname"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"邮政编码"}
                        required="true"
                    >
                        {getFieldDecorator('zipCode', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }],
                            initialValue: address.zipCode
                        })(
                            <Input placeholder={"nickname"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <div className="footer-checkbox">
                        <FormItem
                            {...formItemLayout}
                        >
                            {getFieldDecorator('addressStatus', {
                                valuePropName: 'checked',
                                initialValue: address.addressStatus == 1 ? true : false,
                            })(
                                <Checkbox>{address.addressStatus == 1 ? "默认地址" : "设为默认"}</Checkbox>
                            )}

                            {/* <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSavePersonInfo}>
                                保存
                            </Button> */}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                        >
                            <div>
                                <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSavePersonInfo}>
                                    保存
                                </Button>
                                <Button onClick={this.handleCancel}>
                                    取消
                                </Button>
                            </div>
                        </FormItem>
                    </div>
                </Form>
            </div>
        )
    }
}

export default Form.create()(EditAddress);