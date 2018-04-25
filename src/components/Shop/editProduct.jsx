import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Cascader } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
// import './Style/main.sass';
import { getBase64, contains, messageText, getCookie } from '../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

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

class EditProduct extends Component {
    state = {
        submitLoading: false,
        imgId: "",
        imgCode: "",
        loading: false,
    }

    handleSavePersonInfo = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                console.log('Received values of form: ', data);
                data.shopId = 1;
                axios.post(SERVICE_URL + '/product/addProduct', { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            message.success(intl.get("editSuccess"));
                        } else {
                            message.error(messageText(resData.error.code, intl.get("editFailed")));
                        }
                        this.setState({ submitLoading: false });
                    }).catch(error => {
                        console.log(error);
                        message.error(intl.get("editFailed"));
                        this.setState({ submitLoading: false });
                    });
                // this.next();
            }
        });
    }

    eforeUpload = () => {
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
        return (
            <div>
                {this.renderEditProduct()}
            </div >
        )
    }

    renderEditProduct() {
        const { getFieldDecorator } = this.props.form;
        const { imgCode, loading, submitLoading } = this.state;
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
                        label={"商品名称"}
                    >
                        {getFieldDecorator('proName', {
                            rules: [],
                        })(
                            <Input placeholder={"商品名称"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"商品描述"}
                        required="true"
                    >
                        {getFieldDecorator('description', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }, {
                                eq: 11, message: intl.get("telphoneLength")
                            }],
                        })(
                            <Input placeholder={"description"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="价格"
                    >
                        {getFieldDecorator('price', {
                            rules: [{
                                required: true, message: intl.get("telphoneNotnull")
                            }],
                        })(
                            <Input placeholder={"price"} disabled={submitLoading} />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"商品状态"}
                        required="true"
                    >
                        {getFieldDecorator('proStatus', {
                            rules: [],
                            initialValue: "0"
                        })(
                            <Select disabled={submitLoading}>
                                <Option value="1">Active</Option>
                                <Option value="0">Inactive</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label={"商品图片"}
                    >
                        {getFieldDecorator('imgCodes', {
                            rules: [],
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

export default Form.create()(EditProduct);