import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Layout, Card, Avatar, Checkbox } from 'antd';
const { Meta } = Card;
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/shopProduct.sass';
const Search = Input.Search;
const { Header, Footer, Content } = Layout;
const CheckboxGroup = Checkbox.Group;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class ShopProduct extends Component {
    state = {
        count: 1
    }

    handleEditItem = () => {
        console.log("edit");
        browserHistory.push(BASE_URL + "/openShop/editProduct");
    }

    render() {
        return (
            <div className="shop-product">
                <Layout>
                    <Header>{this.renderShopHeader()}</Header>
                    <Content>{this.renderShopContent()}</Content>
                    <Footer></Footer>
                </Layout>
            </div >
        )
    }
    renderShopHeader() {
        return (
            <div className="shop-search-header">
                <Search
                    placeholder="input search text"
                    onSearch={value => console.log(value)}
                    enterButton
                />
            </div>
        )
    }

    renderShopContent() {
        const { count } = this.state;
        let titleDiv =
            <div className="card-title">
                <div className="card-title-text">
                    <CheckboxGroup options={this.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                </div>
                <div className="card-title-text">店铺：</div>
                <div className="card-title-text">阿福家萌物</div>
            </div>
        return (
            <div className="cart-card" >
                <Card title={titleDiv} extra={<div><Icon type="delete" /> <Icon type="plus-circle-o" onClick={this.handleEditItem} /></div>}>
                    <div className="card-item-content">
                        <div className="left-img">
                            <img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                        </div>
                        <div className="item-info">
                            韩国Laneige兰芝雪凝雪纱双重防晒隔离霜 SPF22 30ML紫色绿色正品
                            </div>
                        <div className="item-status">
                            颜色分类：白色<br />
                            尺码：均码
                            </div>
                        <div className="item-price">
                            ￥151.90
                            </div>
                        <div className="item-count">
                            <Button onClick={this.decreaseCount}>-</Button>
                            <Input value={count} onChange={this.changeCount} />
                            <Button onClick={this.increaseCount}>+</Button>
                        </div>
                        <div className="item-total-price">
                            ￥151.90
                            </div>
                        <div className="item-operation">
                            <span onClick={this.handleDeleteItem}>删除</span>
                            <span onClick={this.handleEditItem}>编辑</span>
                        </div>
                    </div>
                </Card>
            </div >
        );
    }
}

export default ShopProduct;