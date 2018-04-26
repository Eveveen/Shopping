import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider, Upload } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './Style/account.sass';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import AddAddress from './addAddress';
import EditAddress from './editAddress';
import AddressList from './addressList';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import AccountMenu from '../Menu/accountMenu';
// import UploadItem from './uploadItem';
import { getBase64, contains, messageText, getCookie } from '../../data/tools';

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

class Account extends Component {
    state = {
        manageStatus: "member",
        submitLoading: false,
        showAddAddress: false,
        addressAction: "list",
        userInfo: {},
        imgId: "",
        imgCode: "",
        loading: false,
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/user/getUserInfo")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false, userInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleSavePersonInfo = (e) => {
        e.preventDefault();
        const { userInfo } = this.state;
        this.props.form.validateFields((err, data) => {
            data.userId = userInfo.userId;
            data.role = 1;
            console.log("0000");
            if (!err) {
                axios.post(SERVICE_URL + "/user/updateUser", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            message.success(intl.get("editSuccess"));
                        } else {
                            message.error(messageText(resData.error.code, intl.get("editFailed")));
                        }
                        this.setState({ editApplicationLoading: false });
                    }).catch(error => {
                        console.log(error);
                        message.error(intl.get("editFailed"));
                        this.setState({ editApplicationLoading: false });
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
        this.setState({
            imgId: null,
            imgCode: null
        });
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
                this.setState({ imgId: info.file.response.imgId });
            }
        }
    }

    render() {
        console.log("hello");
        const { manageStatus } = this.state;
        return (
            <div className="manage">
                <div className="manage-menu">
                    <AccountMenu
                        keyMenu="member"
                    />
                </div>
                <div className="manage-menu-content">
                    {this.renderPersonalInfo()}
                </div>
            </div>
        )
    }

    renderPersonalInfo() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading, imgCode, loading, userInfo } = this.state;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{intl.get("upload")}</div>
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
                            initialValue: userInfo.avatar
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
                                {imgCode ? <img src={imgCode} alt="" style={{ maxWidth: 383 }} /> : uploadButton}
                                {imgCode && <Icon style={{ fontSize: 16 }} type="close" onClick={this.handleIconDelete} />}
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
                            <Input placeholder={intl.get("telphone")} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"昵称"}
                        required="true"
                    >
                        {getFieldDecorator('userName', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                            initialValue: userInfo.userName
                        })(
                            <Input placeholder={"nickname"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"密码"}
                        required="true"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                            initialValue: userInfo.password
                        })(
                            <Input placeholder={"password"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"邮箱"}
                        required="true"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
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

export default Form.create()(Account);