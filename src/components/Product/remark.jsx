import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Rate } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/remark.sass';
const { TextArea } = Input;
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { Link, browserHistory } from 'react-router';
import moment from 'moment';
import { commentTypeEnum } from './data/enum';

class Remark extends Component {
    state = {
        order: {},
        description: '',
        rate: 5
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/checkIsUser")
            .then(response => {
                const data = response.data;
                if (!data.error) {
                    if (data == false) {
                        browserHistory.push(BASE_URL + "/login");
                    } else {
                        const { order } = this.props.location.state;
                        this.handleGetImg(order.productInfo);
                        this.setState({ order: order });
                    }
                }
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

    handlePostComment = () => {
        const { description, order, rate } = this.state;
        let data = {};
        data.description = description;
        data.shopId = order.productInfo.shopId;
        data.proId = order.productInfo.proId;
        data.rate = rate;
        axios.post(SERVICE_URL + "/product/addComment", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false })
                    this.handleChangeCommentStatus();
                    browserHistory.push(BASE_URL + "/success");
                } else {
                    this.setState({ showLoading: false })
                    message.error("添加评论失败");
                }

            }).catch(error => {
                message.error("添加评论失败");
                this.setState({ showLoading: false });
            });

    }

    handleChangeDescription = (e) => {
        this.setState({ description: e.target.value })
    }

    handleChangeRate = (rate) => {
        this.setState({ rate: rate })
    }

    handleChangeCommentStatus = () => {
        const { order } = this.state;
        let data = {};
        data.orderId = order.orderId;
        data.orderNum = order.orderNum;
        data.commentStatus = commentTypeEnum.COMMENTED;
        axios.post(SERVICE_URL + "/product/editOrderCommentStatus", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.setState({ showLoading: false })
                } else {
                    this.setState({ showLoading: false })
                    message.error("修改失败");
                }

            }).catch(error => {
                message.error("修改失败");
                this.setState({ showLoading: false });
            });
    }

    render() {
        const { order, description } = this.state;
        return (
            <div className="remark">
                <div className="remark-card">
                    <Card title="评价宝贝">
                        <div className="remark-content">
                            <div className="left-content">
                                <img alt={order.productInfo == null ? null : order.productInfo.proName} src={order.productInfo == null ? null : order.productInfo.imgCode} />
                                <div className="left-text">
                                    {order.productInfo == null ? null : order.productInfo.proName}&nbsp;&nbsp;
                                {order.productInfo == null ? null : order.productInfo.description}
                                </div>
                            </div>
                            <div className="right-content">
                                <div className="remark-rate">
                                    店铺评分：<Rate allowHalf defaultValue={5} onChange={this.handleChangeRate} />
                                </div>
                                <div className="remark-text">
                                    <TextArea rows={4} value={description} onChange={this.handleChangeDescription} />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <div className="remark-btn">
                        <Button type="primary" onClick={this.handlePostComment}>发表评论</Button>
                    </div>
                </div>
            </div >
        )
    }
}

export default Remark;