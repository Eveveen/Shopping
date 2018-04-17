import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Avatar, Tabs } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import './Style/detailInfo.sass';
const { Meta } = Card;
const TabPane = Tabs.TabPane;

class DetailInfo extends Component {
    state = {
        count: 1
    }

    handleImgFocus = () => {
        console.log("focus");
    }

    changeCount = (e) => {
        console.log(e.target.value);
        this.setState({
            count: e.target.value
        })
    }

    decreaseCount = () => {
        this.setState({ count: this.state.count - 1 })
    }

    increaseCount = () => {
        this.setState({ count: this.state.count + 1 })
    }

    callback = (key) => {
        console.log(key);
    }

    render() {
        const { count } = this.state;
        return (
            <div className="detail">
                <div className="summary-info">
                    <div className="card-info">
                        <Card
                            style={{ width: 400, height: 400 }}
                            cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                            actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                        >
                            <div className="detail-info-img">
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                                <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" onClick={this.handleImgFocus} />
                            </div>
                        </Card>
                    </div>
                    <div className="text-info">
                        <div className="text-title">
                            微服务架构实战
                    </div>
                        <div className="text-detail text-price">
                            <div className="left-text">价格</div>
                            <div className="right-text">￥18</div>
                        </div>
                        <div className="text-detail">
                            <div className="left-text">配送</div>
                            <div className="right-text">河南洛阳 至 江苏南通</div>
                        </div>
                        <div className="text-detail">
                            <div className="left-text">数量</div>
                            <div className="right-text">
                                <Button onClick={this.decreaseCount}>-</Button>
                                <Input value={count} onChange={this.changeCount} />
                                <Button onClick={this.increaseCount}>+</Button>
                            </div>
                        </div>
                        <div className="text-detail">
                            <div className="left-btn">
                                <Button onClick={this.decreaseCount}>立即购买</Button>
                            </div>
                            <div className="right-btn">
                                <Button onClick={this.decreaseCount}>加入购物车</Button>
                            </div>
                        </div>
                    </div>
                </div >
                <div className="detailed-info">
                    <Tabs onChange={this.callback} type="card">
                        <TabPane tab="宝贝详情" key="1">
                            <div className="detailed-header">商品基本信息</div>
                        </TabPane>
                        <TabPane tab="累计评论" key="2">
                            <div className="comment">
                                <div className="user-info">
                                    <Avatar shape="square" size="large" icon="user" />
                                    <div className="user-name">匿名</div>
                                </div>
                                <div className="comment-info">
                                    <div className="comment-text">好评</div>
                                    <div className="comment-time">2018年04月17日 09:52</div>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default DetailInfo;