import React, { Component } from 'react';
import axios from 'axios';
import { Button, Input, Modal, message, Form, Select, Cascader, Checkbox, Spin } from 'antd';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import { getCookie, getBase64 } from '../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
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

    handleAddAddress = (e) => {
        e.preventDefault();
        this.state.submitLoading = true;
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
                            this.setState({ submitLoading: false });
                            this.handleCancel();
                            message.success("添加成功");
                            this.props.handleGetAllAddress();
                        } else {
                            this.setState({ submitLoading: false })
                            message.error("添加失败");
                        }
                    }).catch(error => {
                        console.log(error);
                        message.error("添加失败");
                        this.setState({ submitLoading: false });
                    });
            }
        });
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
                <Modal
                    title={"Add Address"}
                    visible={visible}
                    onCancel={this.handleCancel}
                    width={850}
                    destroyOnClose={true}
                    maskClosable={false}
                    footer={<div>
                        <Button type="primary" onClick={this.handleAddAddress} loading={submitLoading}>保存</Button>
                        <Button onClick={this.handleCancel} disabled={submitLoading} >取消</Button>
                    </div>}
                >
                    <Spin size="large" spinning={this.state.submitLoading}>
                        <div className="personal-info">
                            <Form onSubmit={this.handleAddAddress} className="personal-info-form">
                                <FormItem
                                    {...formItemLayout}
                                    label={"收货人姓名"}
                                    required="true"
                                >
                                    {getFieldDecorator('consignee', {
                                        rules: [{
                                            required: true, message: "收货人姓名不能为空"
                                        }, {
                                            eq: 11, message: "长度不正确"
                                        }],
                                    })(
                                        <Input placeholder={"收货人姓名"} disabled={submitLoading} />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label="手机号码"
                                >
                                    {getFieldDecorator('telphone', {
                                        rules: [{ required: true, message: '请输入手机号码' }],
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
                                            required: true, message: "所在地区不能为空"
                                        }],
                                    })(
                                        <Input placeholder={"所在地区"} disabled={submitLoading} />
                                    )}
                                </FormItem>
                                {/* <FormItem
                        {...formItemLayout}
                        label="所在地区"
                    >
                        {getFieldDecorator('area', {
                            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                            rules: [{ type: 'array', required: true, message: 'Please select your habitual residence!' }],
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
                                            required: true, message: "详细地址不能为空"
                                        }],
                                    })(
                                        <Input placeholder={"详细地址"} disabled={submitLoading} />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                    label={"邮政编码"}
                                >
                                    {getFieldDecorator('zipCode', {
                                        rules: [],
                                    })(
                                        <Input placeholder={"邮政编码"} disabled={submitLoading} />
                                    )}
                                </FormItem>
                                <FormItem
                                    {...formItemLayout}
                                // label={" "}
                                >
                                    {getFieldDecorator('addressStatus', {
                                        valuePropName: 'checked',
                                        initialValue: true,
                                    })(
                                        // <div className="add-address-checkbox">
                                        <Checkbox>设为默认地址</Checkbox>
                                        // </div>
                                    )}
                                    {/* <div>
                                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleAddAddress}>
                                        保存
                                    </Button>
                                </div> */}
                                </FormItem>
                            </Form>
                        </div>
                    </Spin>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(AddAddress);