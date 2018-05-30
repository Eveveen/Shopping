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

class EditProduct extends Component {
    state = {
        submitLoading: false,
        loading: false,
        productInfo: {},
        previewVisible: false,
        previewImage: '',
        fileList: [],
        imgIdList: [],
        deleteImgIdList: [],
        tempIdList: []
    }

    componentWillMount() {
        let tempIdList = [];
        axios.get(SERVICE_URL + "/checkIsSeller")
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    if (data == false) {
                        browserHistory.push(BASE_URL);
                    } else {
                        const { proId } = this.props.params;
                        axios.get(SERVICE_URL + "/product/getProductByProId/" + proId)
                            .then(response => {
                                const resData = response.data;
                                console.log(resData);
                                if (response.status == 200 && !resData.error) {
                                    this.handleGetImg(resData);
                                    this.state.imgIdList = resData.imgIdList;
                                    resData.imgIdList.forEach(id => {
                                        tempIdList.push(id)
                                    });
                                    console.log("this.state.fileList.,", this.state.fileList);
                                    this.setState({ showLoading: false, productInfo: resData, tempIdList: tempIdList });
                                } else {
                                    this.setState({ showLoading: false })
                                    message.error("获取商品失败");
                                }
                            }).catch(error => {
                                message.error("获取商品失败");
                                this.setState({ showLoading: false });
                            })
                    }
                }
            });
    }

    handleCancelViewImg = () => this.setState({ previewVisible: false });
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleGetImg = (product) => {
        product.imgIdList.forEach(imgId => {
            axios.get(SERVICE_URL + "/shop/getImg/" + imgId)
                .then(response => {
                    const resData = response.data;
                    if (response.status == 200 && !resData.error) {
                        product.imgCode = resData.imgCode;
                        this.state.fileList.push({ url: resData.imgCode, uid: imgId });
                        this.setState({ showLoading: false });
                    } else {
                        this.setState({ showLoading: false })
                        message.error("获取图片失败");
                    }
                }).catch(error => {
                    message.error("获取图片失败");
                    this.setState({ showLoading: false });
                });
        });
    }

    handleEditProduct = (e) => {
        e.preventDefault();
        const { productInfo, imgIdList, deleteImgIdList, tempIdList } = this.state;
        let tList = [];
        tempIdList.forEach(id => {
            tList.push(id);
        });
        tList.forEach((id, index) => {
            if (_.contains(imgIdList, id)) {
                tList = _.without(tList, id);
            }
        });
        this.props.form.validateFields((err, data) => {
            if (!err) {
                data.proId = productInfo.proId;
                data.imgId = productInfo.imgId;
                data.deleteImgIdList = tList;
                data.imgIdList = imgIdList;
                axios.post(SERVICE_URL + '/product/editProduct', { data })
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            message.success("编辑成功");
                        } else {
                            message.error("编辑失败");
                        }
                        this.setState({ submitLoading: false });
                    }).catch(error => {
                        message.error("编辑失败");
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
        this.setState({})
    }

    handleChangeImgList = ({ fileList }) => {
        let imgIdList = this.state.imgIdList;
        if (fileList.length != 0) {
            fileList.forEach(file => {
                console.log("file,", file);
                if (file.response) {
                    imgIdList.push(file.response.imgId);
                    this.state.productInfo.imgId = file.response.imgId;
                    // this.handleGetImg(this.state.productInfo);
                    this.setState({ imgId: file.response.imgId });
                }
            });
        }
        console.log(imgIdList);
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
        const { loading, submitLoading, productInfo, previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{"上传"}</div>
            </div>
        );
        return (
            <div className="personal-info">
                <Form onSubmit={this.handleEditProduct} className="personal-info-form">
                    <FormItem
                        {...formItemLayout}
                        required="true"
                        label={"商品名称"}
                    >
                        {getFieldDecorator('proName', {
                            rules: [{
                                required: true, message: "商品名称不能为空"
                            }],
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
                                required: true, message: "描述不能为空"
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
                                required: true, message: "价格不能为空"
                            }],
                            initialValue: productInfo.price
                        })(
                            <Input placeholder={"price"} disabled={submitLoading} />
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
                            initialValue: productInfo.proNum
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
                            initialValue: productInfo.proStatus == 0 ? "0" : "1"
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
                                    {fileList.length >= 4 ? null : uploadButton}
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
                            //     {productInfo.imgCode ? <img src={productInfo.imgCode} alt="" style={{ maxWidth: 383 }} /> : uploadButton}
                            //     {productInfo.imgCode && <Icon style={{ fontSize: 16 }} type="close" onClick={this.handleIconDelete} />}
                            // </Upload>
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