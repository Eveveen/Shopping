import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Cascader } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/editProduct.sass';
import { getBase64, contains, messageText, getCookie } from '../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { Link, browserHistory } from 'react-router';
import { _ } from 'underscore';

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
        imgCode: '',
        previewVisible: false,
        previewImage: '',
        fileList: [],
        imgIdList: []
    }

    handleCancelViewImg = () => this.setState({ previewVisible: false });
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
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
                    message.error("获取图片失败");
                }
            }).catch(error => {
                message.error("获取图片失败");
                this.setState({ showLoading: false });
            });
    }

    handleAddProduct = (e) => {
        e.preventDefault();
        const { imgId, imgIdList } = this.state;
        const { shopInfo } = this.props;
        this.props.form.validateFields((err, data) => {
            if (!err) {
                data.imgId = imgId;
                data.shopId = shopInfo.shopId;
                data.imgIdList = imgIdList;
                axios.post(SERVICE_URL + '/product/addProduct', { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            this.handleCancel();
                            this.props.handleGetSellerShop();
                        } else {
                            message.error("添加商品失败");
                        }
                        this.setState({ submitLoading: false });
                    }).catch(error => {
                        console.log(error);
                        message.error("添加商品失败");
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

    // handleChangeImgList = (fileList) => {
    //     console.log(fileList);
    //     this.setState({ fileList })
    // }
    handleChangeImgList = ({ fileList }) => {
        let imgIdList = this.state.imgIdList;
        if (fileList.length != 0) {
            fileList.forEach(file => {
                console.log(file);
                if (file.response) {
                    if (!_.contains(imgIdList, file.response.imgId)) {
                        imgIdList.push(file.response.imgId);
                    }
                    this.setState({ imgId: file.response.imgId });
                }
            });
        }
        this.setState({ fileList: fileList, imgIdList: imgIdList })
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
        const { loading, submitLoading, imgCode, previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">upload</div>
            </div>
        );
        console.log("fileList", fileList);
        return (
            <Modal
                title={"添加商品"}
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
                            required="true"
                        >
                            {getFieldDecorator('proName', {
                                rules: [{
                                    required: true, message: "商品名称不能为空"
                                }],
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
                                    required: true, message: "商品描述不能为空"
                                }],
                            })(
                                <Input placeholder={"商品描述"} disabled={submitLoading} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="价格"
                            required="true"
                        >
                            {getFieldDecorator('price', {
                                rules: [{
                                    required: true, message: "价格不能为空"
                                }],
                            })(
                                <Input placeholder={"价格"} disabled={submitLoading} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="库存"
                            required="true"
                        >
                            {getFieldDecorator('proNum', {
                                rules: [{
                                    required: true, message: "库存不能为空"
                                }],
                            })(
                                <Input placeholder={"库存"} disabled={submitLoading} />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={"商品状态"}
                            required="true"
                        >
                            {getFieldDecorator('proStatus', {
                                rules: [],
                                initialValue: "1"
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
                                <div className="clearfix">
                                    <Upload
                                        action={SERVICE_URL + "/user/uploadImg"}
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChangeImgList}
                                    >
                                        {fileList.length >= 3 ? null : uploadButton}
                                    </Upload>
                                    <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelViewImg}>
                                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                    </Modal>
                                </div>
                                // <Upload
                                //     listType="picture-card"
                                //     showUploadList={false}
                                //     withCredentials={true}
                                //     headers={{ 'X-XSRF-TOKEN': getCookie("XSRF-TOKEN") }}
                                //     action={SERVICE_URL + "/user/uploadImg"}
                                //     beforeUpload={this.beforeUpload}
                                //     onChange={this.handleChange}
                                //     disabled={submitLoading}
                                // >
                                //     {imgCode ? <img src={imgCode} alt="" style={{ maxWidth: 383 }} /> : uploadButton}
                                //     {imgCode && <Icon style={{ fontSize: 16 }} type="close" onClick={this.handleIconDelete} />}
                                // </Upload>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }

}

export default Form.create()(AddProduct);