import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider, message } from 'antd';
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

class Pay extends Component {
    state = {
        manageStatus: 1,
        submitLoading: false,
        address: {}
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/product/getAddress/" + this.props.params.id)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    console.log("addressData", resData);
                    this.setState({ showLoading: false, address: resData });
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

    handleSavePersonInfo = (e) => {
        e.preventDefault();
        const { address } = this.state;
        this.props.form.validateFields((err, data) => {
            if (!err) {

                axios.post(SERVICE_URL + "/product/editAddress", { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            console.log("--", resData);
                            this.setState({ showLoading: false, address: resData });
                            message.success("保存成功");
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

    handleCancel = () => {
        browserHistory.push(BASE_URL + "/account/user/address");
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { submitLoading } = this.state;
        return (
            <div className="manage">
                <div className="manage-menu">
                    <AccountMenu
                        keyMenu="user/address"
                    />
                </div>
                <div className="manage-menu-content">
                    <div className="edit-address">
                        <Form onSubmit={this.handleSavePersonInfo} className="personal-info-form">

                            <FormItem
                                {...formItemLayout}
                                label="手机号码"
                            >
                                {getFieldDecorator('telphone', {
                                    rules: [{ required: true, message: "手机号码" }],
                                })(
                                    <Input style={{ width: '100%' }} />
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
                                    <Input placeholder={"密码"} disabled={submitLoading} />
                                )}
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div >
        )
    }
}

export default Form.create()(Pay);