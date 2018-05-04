import React, { Component } from 'react';
import axios from 'axios';
import { Button, Input, Upload, Modal, message, Icon, Form, Select, Cascader, Checkbox } from 'antd';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import { getCookie, messageText, getBase64 } from '../../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
import './Style/addAddress.sass'

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

class SellerShop extends Component {
    state = {
        iconImg: '',
        loading: false,
        submitLoading: false
    }

    handleCancel = () => {
        if (!this.state.submitLoading) {
            this.setState({ loading: false })
            this.props.handleCancel();
        }
    }

    handleChageAddressStatus = () => {
        axios.post(SERVICE_URL + "/product/changeAddressStatus")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    console.log("--", resData);
                    this.setState({ showLoading: false });
                } else {
                    // this.setState({ showLoading: false })
                    // message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                // message.error(intl.get("editFailed"));
                // this.setState({ showLoading: false });
            });
    }

    handleAddAddress = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                console.log(data);
                if (data.addressStatus == true) {
                    this.handleChageAddressStatus();
                    data.addressStatus = 1;
                } else {
                    data.addressStatus = 0;
                }
                axios.post(SERVICE_URL + "/product/addAddress", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            console.log("--", resData);
                            this.setState({ showLoading: false });
                            this.handleCancel();
                            this.props.handleGetAllAddress();
                        } else {
                            // this.setState({ showLoading: false })
                            // message.error(intl.get("editFailed"));
                        }
                    }).catch(error => {
                        console.log(error);
                        // message.error(intl.get("editFailed"));
                        // this.setState({ showLoading: false });
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
        const { visible } = this.props;
        const { iconImg, loading, submitLoading } = this.state;
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
                    <Form onSubmit={this.handleAddAddress} className="personal-info-form">
                        <FormItem
                            {...formItemLayout}
                            label={"店铺名称"}
                            required="true"
                        >
                            {getFieldDecorator('sellerName', {
                                rules: [{
                                    required: true, message: "sellerName不能为空"
                                }],
                            })(
                                <Input placeholder={"姓名"} disabled={submitLoading} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="描述"
                        >
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="评分"
                        >
                            {getFieldDecorator('rate', {
                                rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="店铺状态"
                        >
                            {getFieldDecorator('shopStatus', {
                                rules: [{ required: true, message: 'Please input your phone number!' }],
                            })(
                                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                            )}
                        </FormItem>
                        <FromItem>
                            <Button type="primary" onClick={this.handleAddAddress} loading={submitLoading}>{intl.get("save")}</Button>
                            <Button onClick={this.handleCancel} disabled={submitLoading} >{intl.get("cancel")}</Button>
                        </FromItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(SellerShop);