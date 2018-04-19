import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Layout, AutoComplete } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/orderItem.sass';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class OrderItem extends Component {

    handleRemark = () => {
        browserHistory.push(BASE_URL + "/remark");
    }

    render() {
        return (
            <div className="order-item">
                <Layout>
                    <Header>{this.renderHeader()}</Header>
                    <Content>{this.renderOrderItem()}</Content>
                    <Footer>Footer</Footer>
                </Layout>

            </div >
        )
    }

    renderHeader() {
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        return (
            <div className="global-search-wrapper">
                <AutoComplete
                    style={{ width: 200 }}
                    dataSource={dataSource}
                    placeholder="try to type `b`"
                    className="global-search"
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                >
                    <Input
                        suffix={(
                            <Button className="search-btn" type="primary">
                                <Icon type="search" />
                            </Button>
                        )}
                    />
                </AutoComplete>
            </div>
        )
    }

    renderOrderItem() {
        let titleDiv =
            <div className="card-title">
                <div className="card-title-text">2018-04-15</div>
                <div className="card-title-text">订单号: 134936846902892832</div>
                <div className="card-title-text">阿福家萌物</div>
            </div>
        return (
            <div className="card">
                <Card title={titleDiv} extra={<Icon type="delete" />}>
                    <div className="card-item-content">
                        <div className="left-img">
                            <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                        </div>
                        <div className="item-info">
                            韩国Laneige兰芝雪凝雪纱双重防晒隔离霜 SPF22 30ML紫色绿色正品
                        </div>
                        <div className="item-price">
                            ￥151.90
                        </div>
                        <div className="item-count">
                            1
                        </div>
                        <div className="item-total-price">
                            ￥151.90
                        </div>
                        <div className="item-status">
                            交易成功<br />
                            订单详情
                        </div>
                        <div className="item-remark">
                            <Button onClick={this.handleRemark}>评价</Button>
                        </div>
                    </div>
                </Card>
            </div>
        )
    }
}

export default OrderItem;