import React, { Component } from 'react';
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/collect.sass';
import './Style/main.sass';
import { Card, Layout, AutoComplete, Input, Button, Icon, Menu, Avatar } from 'antd';
const { Meta } = Card;
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import CollectShopChild from './collectShopChild';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class Collect extends Component {
    state = {
        pageStatus: this.props.pageStatus,
        current: this.props.pageStatus,
        collectProductList: [],
        productList: [],
        shopList: []
    }

    componentWillMount() {
        console.log(this.props.location.pathname)
        this.handleGetCollectProduct();
        this.setState({ pageStatus: this.props.location.pathname })
    }

    handleGetCollectProduct = () => {
        axios.get(SERVICE_URL + "/product/getCollectProduct")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(collectProduct => {
                        this.handleGetProduct(collectProduct);
                        this.handleGetShopInfo(collectProduct);
                    });
                    this.setState({ showLoading: false, collectProductList: resData });
                } else {
                    console.log(error)
                    this.setState({ showLoading: false })
                    message.error("获取收藏的宝贝失败");
                }
            }).catch(error => {
                message.error("获取收藏的宝贝失败");
                this.setState({ showLoading: false });
            })
    }

    handleGetProduct = (collectProduct) => {
        axios.get(SERVICE_URL + "/product/getProductByProId/" + collectProduct.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    // this.handleGetImg(resData);
                    this.state.productList.push(resData);
                    this.setState({ showLoading: false, productInfo: resData });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取商品失败");
                }
            }).catch(error => {
                message.error("获取商品失败");
                this.setState({ showLoading: false });
            })
    }

    handleGetShopInfo = (collectProduct) => {
        axios.get(SERVICE_URL + "/product/getShop/" + collectProduct.shopId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    product.shopInfo = resData;
                    this.setState({ showLoading: false });
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取店铺信息失败");
                }
            }).catch(error => {
                message.error("获取店铺信息失败");
                this.setState({ showLoading: false });
            })
    }

    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            pageStatus: e.key,
            current: e.key
        });
    }

    render() {
        const { pageStatus } = this.state;
        console.log("prop", this.props.pageStatus);
        console.log("state", this.state.pageStatus);
        return (
            <div className="collect">
                <Layout>
                    <Header>{this.renderCollectHeader()}</Header>
                    <Content>{this.props.location.pathname == "/collectTreasure" ?
                        this.renderCollectTreasureContent() : this.renderCollectShopContent()}</Content>
                    <Footer>Footer</Footer>
                </Layout>
            </div >
        )
    }

    renderCollectHeader() {
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        return (
            <div className="collect-header">
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    theme="dark"
                >
                    <Menu.Item key="treasure">
                        <Icon type="mail" />收藏的宝贝
                    </Menu.Item>
                    <Menu.Item key="shop">
                        <Icon type="appstore" />收藏的店铺
                    </Menu.Item>
                </Menu>
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
        return (
            <div className="collect-treasure-content">
                <div className="collect-card">
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                    >
                        <div className="card-text">
                            <Meta
                                title="Europe Street beat"
                                description="www.instagram.com"
                            />
                        </div>
                    </Card>
                </div>
            </div >
        )
    }

    renderCollectShopContent() {
        return (
            <div>
                <CollectShopChild />aaaa
            </div>
        )
    }
}

export default Collect;