import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Card, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/buyItem.sass';
// import './Style/main.sass';

class BuyItem extends Component {
    render() {
        return (
            <div className="buy-item">
                <Layout>
                    <Header>Header</Header>
                    <Content>{this.renderBuyItem()}</Content>
                    <Footer>Footer</Footer>
                </Layout>

            </div >
        )
    }

    renderBuyItem() {
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

export default BuyItem;