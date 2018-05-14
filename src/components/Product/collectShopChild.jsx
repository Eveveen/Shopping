import React, { Component } from 'react';
import {
    Button, Input, Select, Upload, Modal, message, Icon, Form,
    Avatar, Card, Col, Row
} from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/collectShopChild.sass';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class CollectShopChild extends Component {
    render() {
        return (
            <div className="collect-shop">
                <div className="left-shop">
                    <div className="left-shop-avatar">
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                        {/* <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar> */}
                    </div>
                    <div className="left-shop-text">
                        书店
                    </div>
                </div>
                <div className="right-treasure">
                    <div style={{ background: '#ECECEC', padding: '30px' }}>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Card title="Card title" bordered={false}>Card content</Card>
                            </Col>
                            <Col span={6}>
                                <Card title="Card title" bordered={false}>Card content</Card>
                            </Col>
                            <Col span={6}>
                                <Card title="Card title" bordered={false}>Card content</Card>
                            </Col>
                            <Col span={6}>
                                <Card title="Card title" bordered={false}>Card content</Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div >
        )
    }
}

export default CollectShopChild;