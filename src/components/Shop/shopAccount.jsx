import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon, Form, Input, Button, Cascader, Upload, message, Spin } from 'antd';
import './Style/account.sass';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import AccountMenu from '../Menu/accountMenu';
// import UploadItem from './uploadItem';
import { getBase64, getCookie } from '../../data/tools';

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

class ShopAccount extends Component {
    state = {
        submitLoading: false,
        showAddAddress: false,
        addressAction: "list",
        userInfo: {},
        imgId: "",
        imgCode: "",
        loading: false,
        showLoading: true
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/checkIsSeller")
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    if (data == false) {
                        browserHistory.push(BASE_URL);
                    } else {
                        axios.get(SERVICE_URL + "/shop/getSellerInfo")
                            .then(response => {
                                const resData = response.data;
                                if (response.status == 200 && !resData.error) {
                                    // resData.imgId = resData.avatar;
                                    this.handleGetImg(resData);
                                    this.setState({ showLoading: false, userInfo: resData, imgCode: resData.imgCode, imgId: resData.avatar });
                                } else {
                                    this.setState({ showLoading: false })
                                    message.error("获取个人信息失败");
                                }
                            }).catch(error => {
                                console.log(error);
                                message.error("获取个人信息失败");
                                this.setState({ showLoading: false });
                            })
                    }
                }
            });
    }

    handleGetImg = (sellerInfo) => {
        // this.state.showLoading = true;
        axios.get(SERVICE_URL + "/shop/getImg/" + sellerInfo.avatar)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    sellerInfo.imgCode = resData.imgCode;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取图片失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取图片失败");
                this.setState({ showLoading: false });
            });
    }

    handleSavePersonInfo = (e) => {
        e.preventDefault();
        const { userInfo } = this.state;
        const { role } = this.props.params;
        this.state.showLoading = true;
        this.props.form.validateFields((err, data) => {
            data.userId = userInfo.userId;
            data.imgId = userInfo.avatar;
            data.avatar = userInfo.avatar;
            data.role = 1;
            if (!err) {
                axios.post(SERVICE_URL + "/shop/editSeller", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            message.success("保存成功");
                        } else {
                            message.error("编辑失败");
                        }
                        this.setState({ showLoading: false });
                    }).catch(error => {
                        console.log(error);
                        message.error("编辑失败");
                        this.setState({ showLoading: false });
                    });
            }
        });
    }

    beforeUpload = () => {
        this.setState({ imgCode: "", loading: false });
    }

    handleIconDelete = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.state.userInfo.imgCode = null;
        this.state.userInfo.avatar = null;
        this.setState({})
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imgCode => this.setState({
                imgCode,
                loading: false,
            }));
            if (!info.file.response.error) {
                this.state.userInfo.avatar = info.file.response.imgId;
                this.handleGetImg(this.state.userInfo);
            }
        }
    }

    render() {
        return (
            <Spin size="large" spinning={this.state.showLoading}>
                <div className="manage">
                    <div className="manage-menu">
                        <AccountMenu
                            keyMenu="user/member"
                            pathname="shop"
                        />
                    </div>
                    <div className="manage-menu-content">
                        {this.renderPersonalInfo()}
                    </div>
                </div>
            </Spin>
        )
    }

    renderPersonalInfo() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading, imgCode, loading, userInfo } = this.state;
        const { role } = this.props.params;
        console.log("userInfo,", userInfo);
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        return (
            <div className="personal-info">
                <Form onSubmit={this.handleSavePersonInfo} className="personal-info-form">
                    <FormItem
                        {...formItemLayout}
                        label={"用户头像"}
                    >
                        {getFieldDecorator('avatar', {
                            rules: [],
                            // initialValue: userInfo == {} ? null : userInfo.imgCode
                        })(
                            <Upload
                                listType="picture-card"
                                showUploadList={false}
                                withCredentials={true}
                                headers={{ 'X-XSRF-TOKEN': getCookie("XSRF-TOKEN") }}
                                action={SERVICE_URL + "/user/uploadImg"}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChange}
                                disabled={submitLoading}
                            >
                                {userInfo.imgCode ? <img src={userInfo.imgCode} alt="" /> : uploadButton}
                                {userInfo.imgCode && <Icon style={{ fontSize: 16 }} type="close" onClick={this.handleIconDelete} />}
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"手机号码"}
                    >
                        {getFieldDecorator('telphone', {
                            rules: [],
                            initialValue: userInfo.telphone
                        })(
                            <Input placeholder={"手机号码"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"昵称"}
                        required="true"
                    >
                        {getFieldDecorator(role == "user" ? 'userName' : 'sellerName', {
                            rules: [{
                                required: true, message: "用户名不能为空"
                            }, {
                                eq: 50, message: "用户名长度过长"
                            }],
                            initialValue: role == "user" ? userInfo.userName : userInfo.sellerName
                        })(
                            <Input placeholder={"用户名"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"密码"}
                        required="true"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: "密码不能为空"
                            }, {
                                eq: 50, message: "密码长度过长"
                            }],
                            initialValue: userInfo.password
                        })(
                            <Input placeholder={"密码"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"邮箱"}
                        required="true"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                required: true, message: "邮箱不能为空"
                            }, {
                                type: 'email', message: "邮箱格式不正确"
                            }, , {
                                eq: 50, message: "邮箱长度过长"
                            }],
                            initialValue: userInfo.email
                        })(
                            <Input placeholder={"email"} disabled={submitLoading} />
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
                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleSavePersonInfo}>
                            保存
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }

}

export default Form.create()(ShopAccount);