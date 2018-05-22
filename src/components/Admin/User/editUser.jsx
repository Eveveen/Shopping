import React, { Component } from 'react';
import axios from 'axios';
import { Button, Input, Upload, Modal, message, Icon, Form, Select, Cascader, Checkbox } from 'antd';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import { getCookie, messageText, getBase64 } from '../../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../../conf/config';
import './Style/editUser.sass'
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

class EditUser extends Component {
    state = {
        iconImg: '',
        loading: false,
        submitLoading: false,
        userInfo: {}
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/checkIsAdmin")
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    if (data == false) {
                        browserHistory.push(BASE_URL);
                    } else {
                        const { id } = this.props.params;
                        axios.get(SERVICE_URL + "/admin/getUser/" + id)
                            .then(response => {
                                const resData = response.data;
                                if (response.status == 200 && !resData.error) {
                                    this.setState({ showLoading: false, userInfo: resData });
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
                }
            });
    }

    handleCancel = () => {
        browserHistory.push(BASE_URL + "/admin/user");
    }

    handleChageAddressStatus = () => {
        axios.post(SERVICE_URL + "/product/changeAddressStatus")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("更改默认地址失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("更改默认地址失败");
                this.setState({ showLoading: false });
            });
    }

    handleEditUser = (e) => {
        e.preventDefault();
        const { userInfo } = this.state;
        this.props.form.validateFields((err, data) => {
            data.userId = userInfo.userId;
            if (!err) {
                axios.post(SERVICE_URL + "/admin/editUser", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            message.success("保存成功");
                            this.setState({ showLoading: false });
                        } else {
                            this.setState({ showLoading: false })
                            message.error("编辑失败");
                        }
                    }).catch(error => {
                        console.log(error);
                        message.error("编辑失败");
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
            callback("确认密码不一致");
        } else {
            callback();
        }
    }

    render() {
        const { visible } = this.props;
        const { iconImg, loading, submitLoading, userInfo } = this.state;
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
                    <Form onSubmit={this.handleEditUser} className="personal-info-form">
                        <FormItem
                            {...formItemLayout}
                            label={"姓名"}
                            required="true"
                        >
                            {getFieldDecorator('userName', {
                                rules: [{
                                    required: true, message: "userName不能为空"
                                }],
                                initialValue: userInfo.userName
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
                                initialValue: userInfo.telphone
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
                                    required: true, message: "邮箱不能为空",
                                }, {
                                    type: 'email', message: "邮箱格式不正确"
                                }, {
                                    max: 50, message: "邮箱长度过长"
                                }],
                                initialValue: userInfo.email
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem>
                            <div className="edit-user-footer">
                                <Button type="primary" onClick={this.handleEditUser} loading={submitLoading}>保存</Button>
                                <Button onClick={this.handleCancel} disabled={submitLoading} >取消</Button>
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(EditUser);