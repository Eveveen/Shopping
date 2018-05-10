import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Cascader } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/editProduct.sass';
import { getBase64, contains, messageText, getCookie } from '../../data/tools';
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

class EditProduct extends Component {
    state = {
        submitLoading: false,
        loading: false,
        productInfo: {}
    }

    componentWillMount() {
        const { proId } = this.props.params;
        axios.get(SERVICE_URL + "/product/getProductByProId/" + proId)
            .then(response => {
                const resData = response.data;
                console.log(resData);
                if (response.status == 200 && !resData.error) {
                    this.handleGetImg(resData);
                    this.setState({ showLoading: false, productInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            })
    }

    handleGetImg = (product) => {
        axios.get(SERVICE_URL + "/shop/getImg/" + product.imgId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    product.imgCode = resData.imgCode;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleEditProduct = (e) => {
        e.preventDefault();
        const { productInfo } = this.state;
        this.props.form.validateFields((err, data) => {
            if (!err) {
                data.proId = productInfo.proId;
                data.imgId = productInfo.imgId;
                axios.post(SERVICE_URL + '/product/editProduct', { data })
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
            }
        });
    }

    handleBackToIndex = () => {
        browserHistory.push(BASE_URL + '/shop');
    }

    beforeUpload = () => {
        this.state.productInfo.imgCode = "";
        this.setState({ loading: false });
    }

    handleIconDelete = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.state.productInfo.imgCode = null;
        this.state.productInfo.imgId = null;
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
                this.state.productInfo.imgId = info.file.response.imgId;
                this.handleGetImg(this.state.productInfo);
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
        const { loading, submitLoading, productInfo } = this.state;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{intl.get("upload")}</div>
            </div>
        );
        return (
            <div className="personal-info">
                <Form onSubmit={this.handleEditProduct} className="personal-info-form">
                    <FormItem
                        {...formItemLayout}
                        label={"商品名称"}
                    >
                        {getFieldDecorator('proName', {
                            rules: [],
                            initialValue: productInfo.proName
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
                            initialValue: productInfo.description
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
                            initialValue: productInfo.price
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
                            initialValue: productInfo.proStatus
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
                                {productInfo.imgCode ? <img src={productInfo.imgCode} alt="" style={{ maxWidth: 383 }} /> : uploadButton}
                                {productInfo.imgCode && <Icon style={{ fontSize: 16 }} type="close" onClick={this.handleIconDelete} />}
                            </Upload>
                        )}
                    </FormItem>
                    <FormItem>
                        <div className="edit-product-footer">
                            <Button type="primary" htmlType="submit" className="login-form-button" onClick={this.handleEditProduct}>
                                保存
                        </Button>
                            <Button className="login-form-button" onClick={this.handleBackToIndex}>
                                取消
                        </Button>
                        </div>
                    </FormItem>
                </Form>
            </div>
        )
    }

}

export default Form.create()(EditProduct);