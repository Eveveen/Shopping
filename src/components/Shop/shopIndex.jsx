import React, { Component } from 'react';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/shopIndex.sass';
import './Style/main.sass';
import { Card, Layout, AutoComplete, Input, Button, Icon, Menu, Avatar, message } from 'antd';
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class ShopIndex extends Component {
    state = {
        shopInfo: {},
        productList: [],
        imgCode: ''
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/shop/getSellerShop")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    this.handleGetProduct(resData.shopId);
                    this.setState({ showLoading: false, shopInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleGetProduct = (id) => {
        axios.get(SERVICE_URL + "/product/getProduct/" + id)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(product => {
                        if (product.imgId != null) {
                            this.handleGetImg(product);
                        }
                    });
                    this.setState({ showLoading: false, productList: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
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
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleEditProduct = () => {
        browserHistory.push(BASE_URL + "/shop/editProduct");
    }

    render() {
        return (
            <div className="collect">
                <Layout>
                    <Header>{this.renderCollectHeader()}</Header>
                    <Content>
                        {this.renderCollectTreasureContent()}
                    </Content>
                    <Footer>Footer</Footer>
                </Layout>
            </div >
        )
    }

    renderCollectHeader() {
        const { shopInfo } = this.state;
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        return (
            <div className="collect-header">
                店铺名称：{shopInfo.shopName}
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
            </div>
        )
    }

    renderCollectTreasureContent() {
        const { productList } = this.state;
        let productDiv = [];
        productList.forEach(product => {
            productDiv.push(<div className="collect-treasure-content">
                <div className="collect-card">
                    <Card
                        style={{ width: 300 }}
                        cover={<img alt="example" src={product.imgCode} />}
                        actions={[<Icon type="setting" />, <Icon type="edit" onClick={this.handleEditProduct.bind(this, product.proId)} />, <Icon type="ellipsis" />]}
                    >
                        <div className="card-text">
                            <Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={product.proName}
                                description={product.description}
                            />
                        </div>
                    </Card>
                </div>
            </div>);
        });
        return (
            <div>
                {productDiv}
            </div>
        )
    }
}

export default ShopIndex;