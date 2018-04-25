import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
// import './Style/main.sass';
import { getBase64, contains, messageText, getCookie } from '../../data/tools';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class UploadItem extends Component {
    state = {
        imgId: "",
        imgCode: "",
        loading: false,
        submitLoading: false
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
        const { imgCode, loading, submitLoading } = this.state;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{intl.get("upload")}</div>
            </div>
        );
        return (
            <div>
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
            </div >
        )
    }
}

export default UploadItem;