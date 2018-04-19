import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Rate } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/remark.sass';
const { TextArea } = Input;
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import { Link, browserHistory } from 'react-router';

class Remark extends Component {

    handlePostComment = () => {
        browserHistory.push(BASE_URL + "/success");
    }

    render() {
        return (
            <div className="remark">
                <div className="remark-card">
                    <Card title="评价宝贝" extra={<a href="#">More</a>}>
                        <div className="remark-content">
                            <div className="left-content">
                                <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                                <div className="left-text">日程本记事 </div>
                            </div>
                            <div className="right-content">
                                <div className="remark-rate">
                                    店铺评分：<Rate allowHalf defaultValue={2.5} />
                                </div>
                                <div className="remark-text">
                                    <TextArea rows={4} />
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