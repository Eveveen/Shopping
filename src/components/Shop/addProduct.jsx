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

class AddProduct extends Component {
    state = {
        submitLoading: false,
        loading: false,
        imgId: '',
        imgCode: ''
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

    handleAddProduct = (e) => {
        e.preventDefault();
        const { imgId } = this.state;
        const { shopInfo } = this.props;
        this.props.form.validateFields((err, data) => {
            if (!err) {
                data.imgId = imgId;
                data.shopId = shopInfo.shopId;
                axios.post(SERVICE_URL + '/product/addProduct', { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            this.handleCancel();
                            this.props.handleGetSellerShop();
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

    beforeUpload = () => {
        this.setState({ loading: false });
        this.setState({ imgCode: "" });
    }

    handleIconDelete = (e) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            imgCode: null,
            imgId: null
        })
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
                this.setState({
                    imgId: info.file.response.imgId
                });
            }
        }
    }

    handleCancel = () => {
        if (!this.state.submitLoading) {
            this.setState({ loading: false })
            this.props.handleCancel();
        }
    }

    render() {
        return (
            <div>
                {this.renderAddProduct()}
            </div >
        )
    }

    renderAddProduct() {
        const { visible } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { loading, submitLoading, imgCode } = this.state;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{intl.get("upload")}</div>
            </div>
        );
        return (
            <Modal
                title={"Add Porduct"}
                visible={visible}
                onCancel={this.handleCancel}
                width={850}
                destroyOnClose={true}
                maskClosable={false}
                footer={<div>
                    <Button type="primary" onClick={this.handleAddProduct} loading={submitLoading}>保存</Button>
                    <Button onClick={this.handleCancel} disabled={submitLoading} >取消</Button>
                </div>}
            >
                <div className="personal-info">
                    <Form onSubmit={this.handleAddProduct} className="personal-info-form">
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
                    </Form>
                </div>
            </Modal>
        )
    }

}

export default Form.create()(AddProduct);