import React, { Component } from 'react';
import { Layout, Table, Button, List, message, Avatar, Spin, Card, Icon, Input, Checkbox } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/cartPage.sass';
const CheckboxGroup = Checkbox.Group;




class CartPage extends Component {
    state = {
        count: 1,
        checkedList: [],
        indeterminate: true,
        checkAll: false,
    };
    plainOptions = ['apple', 'PERA'];

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

    handleDeleteItem = () => {
        console.log("delete");
    }

    onChange = (checkedList) => {
        this.setState({
            checkedList,
            indeterminate: !!checkedList.length && (checkedList.length < this.plainOptions.length),
            checkAll: checkedList.length === this.plainOptions.length,
        });
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ? this.plainOptions : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    render() {
        const defaultCheckedList = [this.renderItem()];
        const plainOptions = ['apple', 'PERA'];
        return (
            <div className="cart-page">
                <Layout>
                    <Header>Header</Header>
                    <Content>
                        <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={this.onCheckAllChange}
                            checked={this.state.checkAll}
                        >
                            Check all
                        </Checkbox>
                        <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                        {this.renderItem()}
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>
            </div >
        )
    }


    renderItem = () => {
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
                <Card title={titleDiv} extra={<Icon type="delete" />}>
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
                        </div>
                    </div>
                </Card>
            </div >
        );
    }
}

export default CartPage;