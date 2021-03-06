import React, { Component } from 'react';
import axios from 'axios';
import { Button, Input, Upload, Modal, message, Icon, Form, Select, Cascader, Checkbox } from 'antd';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import { getCookie, messageText, getBase64 } from '../../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
// import './Style/addAddress.sass'

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

class AddUser extends Component {
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

    handleAddUser = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                axios.post(SERVICE_URL + "/admin/addUser", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            this.setState({ showLoading: false });
                            this.handleCancel();
                            message.success("添加成功");
                            this.props.handleGetAllUser();
                        } else {
                            this.setState({ showLoading: false })
                            message.error("添加用户失败");
                        }
                    }).catch(error => {
                        console.log(error);
                        message.error("添加用户失败");
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
            callback("密码不一致");
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
                <Modal
                    title={"添加用户"}
                    visible={visible}
                    onCancel={this.handleCancel}
                    width={850}
                    destroyOnClose={true}
                    maskClosable={false}
                    footer={<div>
                        <Button type="primary" onClick={this.handleAddUser} loading={submitLoading}>保存</Button>
                        <Button onClick={this.handleCancel} disabled={submitLoading} >取消</Button>
                    </div>}
                >
                    <div className="personal-info">
                        <Form onSubmit={this.handleAddUser} className="personal-info-form">
                            <FormItem
                                {...formItemLayout}
                                label={"姓名"}
                                required="true"
                            >
                                {getFieldDecorator('userName', {
                                    rules: [{
                                        required: true, message: "用户名不能为空"
                                    }],
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
                                })(
                                    <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"密码"}
                            >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true, message: "请输入密码",
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
                                        required: true, message: "请输入确认密码",
                                    }, {
                                        validator: this.checkConfirmPassword,
                                    }],
                                })(
                                    <Input type="password" onBlur={this.handleConfirmBlur} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={"邮箱"}
                            >
                                {getFieldDecorator('email', {
                                    rules: [{
                                        required: true, message: "请输入邮箱",
                                    }, {
                                        type: 'email', message: "邮箱格式不正确"
                                    }, {
                                        max: 50, message: "邮箱长度过长"
                                    }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                        </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create()(AddUser);