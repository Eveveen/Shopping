import React, { Component } from 'react';
import axios from 'axios';
import Account from './account';
import { Button, Input, Upload, Modal, message, Icon, Form, Select, Cascader, Checkbox } from 'antd';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import { getCookie, messageText, getBase64 } from '../../data/tools';

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

class AddAddress extends Component {
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
            <div>
                <Modal
                    title={"Add Address"}
                    visible={visible}
                    onCancel={this.handleCancel}
                    width={850}
                    destroyOnClose={true}
                    maskClosable={false}
                    footer={<div>
                        <Button type="primary" onClick={this.handleSave} loading={submitLoading}>{intl.get("save")}</Button>
                        <Button onClick={this.handleCancel} disabled={submitLoading} >{intl.get("cancel")}</Button>
                    </div>}
                >
                    <div className="personal-info">
                        <Form onSubmit={this.handleSavePersonInfo} className="personal-info-form">
                            <FormItem
                                {...formItemLayout}
                                label="手机号码"
                            >
                                {getFieldDecorator('phone', {
                                    rules: [{ required: true, message: 'Please input your phone number!' }],
                                })(
                                    <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"所在地区"}
                                required="true"
                            >
                                {getFieldDecorator('nickname', {
                                    rules: [{
                                        required: true, message: intl.get("telphoneNotnull")
                                    }, {
                                        eq: 11, message: intl.get("telphoneLength")
                                    }],
                                })(
                                    <Input placeholder={"nickname"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"详细地址"}
                                required="true"
                            >
                                {getFieldDecorator('nickname', {
                                    rules: [{
                                        required: true, message: intl.get("telphoneNotnull")
                                    }, {
                                        eq: 11, message: intl.get("telphoneLength")
                                    }],
                                })(
                                    <Input placeholder={"nickname"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"邮政编码"}
                            >
                                {getFieldDecorator('nickname', {
                                    rules: [],
                                })(
                                    <Input placeholder={"nickname"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"收货人姓名"}
                                required="true"
                            >
                                {getFieldDecorator('nickname', {
                                    rules: [{
                                        required: true, message: intl.get("telphoneNotnull")
                                    }, {
                                        eq: 11, message: intl.get("telphoneLength")
                                    }],
                                })(
                                    <Input placeholder={"nickname"} disabled={submitLoading} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="居住地"
                            >
                                {getFieldDecorator('residence', {
                                    initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                                    rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
                                })(
                                    <Cascader options={residences} />
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox>设为默认地址</Checkbox>
                                )}
                                <div>
                                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSavePersonInfo}>
                                        保存
                            </Button>
                                </div>
                            </FormItem>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(AddAddress);