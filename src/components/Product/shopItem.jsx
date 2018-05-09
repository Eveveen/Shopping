import React, { Component } from 'react';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/shopItem.sass';
// import './Style/main.sass';
import { Card, Layout, AutoComplete, Input, Button, Icon, Menu, Avatar, message, Popconfirm } from 'antd';
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class ShopItem extends Component {
    state = {
        shopInfo: {},
        productList: [],
        imgCode: '',
    }

    componentWillMount() {
        this.handleGetSellerShop();
    }

    handleGetSellerShop = () => {
        axios.get(SERVICE_URL + "/product/getShop/" + this.props.params.id)
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

    handleEditProduct = (proId) => {
        browserHistory.push(BASE_URL + "/shop/editProduct/" + proId);
    }

    handleDeleteProduct = (proId) => {
        axios.get(SERVICE_URL + "/product/deleteProduct/" + proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    message.success('删除成功');
                    this.setState({ showLoading: false });
                    this.handleGetSellerShop();
                } else {
                    this.setState({ showLoading: false })
                    message.error(intl.get("editFailed"));
                }
            }).catch(error => {
                console.log(error);
                message.error(intl.get("editFailed"));
                this.setState({ showLoading: false });
            });
    }

    handleCancelDelete = () => {
        console.log("canceldelte");
    }

    handleShowProductDetail = (proId) => {
        browserHistory.push(BASE_URL + "/item/" + proId);
    }

    render() {
        return (
            <div className="shop-item">
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
                        onClick={this.handleShowProductDetail.bind(this, product.proId)}
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

export default ShopItem;