import React, { Component } from 'react';
import axios from 'axios';
import { Button, Input, Upload, Modal, message, Icon, Form, Select, Cascader, Checkbox, Tabs } from 'antd';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import { getCookie, messageText, getBase64 } from '../../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
import './Style/editSeller.sass'
import { Link, browserHistory } from 'react-router';
const TabPane = Tabs.TabPane;
import SellerShop from './shop';

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

class EditSeller extends Component {
    state = {
        iconImg: '',
        loading: false,
        submitLoading: false,
        sellerInfo: {}
    }

    componentWillMount() {
        const { sellerId } = this.props.params;
        axios.get(SERVICE_URL + "/admin/getSeller/" + sellerId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false, sellerInfo: resData });
                } else {
                    message.error("获取用户失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取用户失败");
            });
    }

    handleCancel = () => {
        browserHistory.push(BASE_URL + "/admin/seller");
    }

    handlEditSeller = (e) => {
        e.preventDefault();
        const { sellerInfo } = this.state;
        this.props.form.validateFields((err, data) => {
            data.sellerId = sellerInfo.sellerId;
            data.password = sellerInfo.password;
            if (!err) {
                axios.post(SERVICE_URL + "/admin/editSeller", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            message.success("编辑成功");
                            this.setState({ showLoading: false });
                        } else {
                            this.setState({ showLoading: false })
                            message.error("编辑卖家失败");
                        }
                    }).catch(error => {
                        console.log(error);
                        message.error("编辑卖家失败");
                        this.setState({ showLoading: false });
                    });
            }
        });
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirmPassword'], { force: true });
        }
        callback();
    }

    checkConfirmPassword = (rule, value, callback) => {
        const form = this.props.form;
        var password = form.getFieldValue('password')
        if (value != password) {
            callback(intl.get("samepassword"));
        } else {
            callback();
        }
    }

    render() {
        const { shopId, sellerId } = this.props.params;
        return (
            <Tabs defaultActiveKey="seller" onChange={this.callback}>
                <TabPane tab={<span><Icon type="apple" />卖家</span>} key="seller">
                    {this.renderEditSeller()}
                </TabPane>
                <TabPane tab={<span><Icon type="android" />店铺</span>} key="shop">
                    {/* {this.renderLogin()} */}
                    <SellerShop shopId={shopId} sellerId={sellerId} />
                </TabPane>
            </Tabs>
        )
    }

    renderEditSeller() {
        const { visible } = this.props;
        const { iconImg, loading, submitLoading, sellerInfo } = this.state;
        const { getFieldDecorator } = this.props.form;
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );
        return (
            <div className="add-address">
                <div className="personal-info">
                    <Form onSubmit={this.handlEditSeller} className="personal-info-form">
                        <FormItem
                            {...formItemLayout}
                            label={"姓名"}
                            required="true"
                        >
                            {getFieldDecorator('sellerName', {
                                rules: [{
                                    required: true, message: "sellerName不能为空"
                                }],
                                initialValue: sellerInfo.sellerName
                            })(
                                <Input placeholder={"姓名"} disabled={submitLoading} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="手机号码"
                        >
                            {getFieldDecorator('telphone', {
                                rules: [{ required: true, message: 'Please input your phone number!' }],
                                initialValue: sellerInfo.telphone
                            })(
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        {/* <FormItem
                            {...formItemLayout}
                            label={"密码"}
                        >
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: intl.get("passwordrequire"),
                                }, {
                                    validator: this.validateToNextPassword,
                                }],
                            })(
                                <Input type="password" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={"确认密码"}
                        >
                            {getFieldDecorator('confirmPassword', {
                                rules: [{
                                    required: true, message: intl.get("verifypasswordrequire"),
                                }, {
                                    validator: this.checkConfirmPassword,
                                }],
                            })(
                                <Input type="password" onBlur={this.handleConfirmBlur} />
                            )}
                        </FormItem> */}
                        <FormItem
                            {...formItemLayout}
                            label={"邮箱"}
                        >
                            {getFieldDecorator('email', {
                                rules: [{
                                    required: true, message: intl.get("requireemail"),
                                }, {
                                    type: 'email', message: intl.get("formatemail")
                                }, {
                                    max: 50, message: intl.get("emailmax")
                                }],
                                initialValue: sellerInfo.email
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem>
                            <div className="edit-seller-footer">
                                <Button type="primary" onClick={this.handlEditSeller} loading={submitLoading}>{intl.get("save")}</Button>
                                <Button onClick={this.handleCancel} disabled={submitLoading} >{intl.get("cancel")}</Button>
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(EditSeller);