import React, { Component } from 'react';
import axios from 'axios';
import Account from './account';
import { Layout, Menu, Icon, Carousel, AutoComplete, Input, Button, message, Card, Spin } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './Style/homePage.sass';
import './Style/main.sass';
// import './Style/carousel.css';
import DetailInfo from './detailInfo';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import './Style/antd.sass';

const gridStyle = {
    width: '25%',
    textAlign: 'center',
};
const carouselImgList = [
    { imgId: 34, imgCode: '', shopId: 1 },
    { imgId: 35, imgCode: '', shopId: 6 },
    { imgId: 36, imgCode: '', shopId: 7 }
];

const smallImgList = [
    { imgId: 29, imgCode: '', proId: 15 },
    { imgId: 30, imgCode: '', proId: 16 },
    { imgId: 31, imgCode: '', proId: 17 },
    { imgId: 32, imgCode: '', proId: 18 }
];

const arrangeImgList = [
    { imgId: 20, imgCode: '', proId: 9 },
    { imgId: 23, imgCode: '', proId: 10 },
    { imgId: 24, imgCode: '', proId: 11 },
    { imgId: 26, imgCode: '', proId: 12 },
    { imgId: 27, imgCode: '', proId: 13 },
    { imgId: 28, imgCode: '', proId: 14 }
];

class HomePage extends Component {
    state = {
        searchName: '',
        searchData: [],
        searchProNameList: [],
        imgCode: '',
        img: {},
        carouselImgList: [],
        smallImgList: [],
        arrangeImgList: [],
        showLoading: true
    }
    componentWillMount() {
        let img = { imgId: 33, imgCode: '' }
        this.handleGetImg(img, "img");
        carouselImgList.forEach(cimg => {
            this.handleGetImg(cimg, "carousel");
        });
        smallImgList.forEach(simg => {
            this.handleGetImg(simg, "small");
        });
        arrangeImgList.forEach(aimg => {
            this.handleGetImg(aimg, "arrange");
        });
    }

    handleShowDetail = (proId) => {
        browserHistory.push(BASE_URL + "/item/" + proId);
    }

    handleChangeSelect = (value) => {
        browserHistory.push(BASE_URL + "/searchProduct/" + value);
        this.setState({ searchName: value })
    }

    handleSearchProduct = (value) => {
        let data = {};
        let searchProNameList = [];
        data.proName = value;
        axios.post(SERVICE_URL + "/product/searchProduct", { data })
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(product => {
                        searchProNameList.push(product.proName)
                    });
                    this.setState({ showLoading: false, searchData: resData, searchProNameList: searchProNameList })
                } else {
                    this.setState({ showLoading: false })
                    console.log(resData.error)
                    message.error("搜索失败");
                }
            }).catch(error => {
                message.error("搜索失败");
                console.log(error)
                this.setState({ showLoading: false });
            });
    }

    handleEnter = (e) => {
        if (e.which == 13) {
            this.handleSearchOrder();
        }
    }

    handleGetImg = (img, flag) => {
        console.log(flag);
        let imgCode = '';
        axios.get(SERVICE_URL + "/shop/getImg/" + img.imgId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    if (flag == "carousel") {
                        carouselImgList.forEach(cImg => {
                            if (cImg.imgId == img.imgId) {
                                cImg.imgCode = resData.imgCode
                            }
                        });
                        this.setState({ showLoading: false, carouselImgList: carouselImgList });
                    } else if (flag == "small") {
                        smallImgList.forEach(sImg => {
                            if (sImg.imgId == img.imgId) {
                                sImg.imgCode = resData.imgCode
                                this.handleGetProductInfo(sImg);
                            }
                        });
                        this.setState({ showLoading: false, smallImgList: smallImgList });
                    } else if (flag == "arrange") {
                        arrangeImgList.forEach(aImg => {
                            if (aImg.imgId == img.imgId) {
                                aImg.imgCode = resData.imgCode
                                this.handleGetProductInfo(aImg);
                            }
                        });
                        this.setState({ showLoading: false, arrangeImgList: arrangeImgList });
                    } else {
                        img.imgCode = resData.imgCode;
                        this.setState({ showLoading: false, img: img });
                    }
                } else {
                    this.setState({ showLoading: false })
                    message.error("获取图片失败");
                }
            }).catch(error => {
                console.log(error);
                message.error("获取图片失败");
                this.setState({ showLoading: false });
            });
    }

    handleViewShop = (shopId) => {
        browserHistory.push(BASE_URL + "/viewShop/" + shopId);
    }

    handleGetProductInfo = (img) => {
        axios.get(SERVICE_URL + "/product/getProductByProId/" + img.proId)
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    img.productInfo = resData;
                    this.setState({ showLoading: false });
                } else {
                    message.error("获取商品失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                message.error("获取商品失败");
                this.setState({ showLoading: false });
            })
    }

    render() {
        return (
            <div>
                {/* <Account /> */}
                <Spin size="large" spinning={this.state.showLoading}>
                    {this.renderHomePage()}
                </Spin>
            </div>
        )
    }

    renderHomePage() {
        return (
            <div className="home-page-bg">
                <div className="home-page">
                    <Layout>
                        <Header>{this.renderHeader()}</Header>
                        <Layout>
                            <Content>{this.renderContent()}</Content>
                        </Layout>
                        <Footer>@2018-eshop</Footer>
                    </Layout>
                </div>
            </div>
        )
    }

    renderHeader() {
        const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        const { searchData, searchProNameList } = this.state;
        return (
            <div className="global-search-wrapper">
                <AutoComplete
                    style={{ width: 200 }}
                    onSearch={this.handleSearchProduct}
                    onSelect={this.handleChangeSelect}
                    dataSource={searchProNameList.length == 0 ? null : searchProNameList}
                    placeholder="输入要搜索的词"
                    className="global-search"
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                >
                    <Input onKeyPress={this.handleEnter}
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

    renderContent() {
        const { imgCode, img } = this.state;
        let carouselDiv = [];
        let smallProDiv = [];
        let arrangeProDiv1 = [];
        let arrangeProDiv2 = [];
        this.state.carouselImgList.forEach(img => {
            carouselDiv.push(
                <div className="home-carousel" onClick={this.handleViewShop.bind(this, img.shopId)}>
                    <img src={img.imgCode} />
                </div>
            );
        });
        this.state.smallImgList.forEach(img => {
            smallProDiv.push(
                <div className="pro-item">
                    <div className="left-img" onClick={this.handleShowDetail.bind(this, img.proId)}>
                        <img src={img.imgCode} />
                    </div>
                    <div className="right-text">
                        <div className="pro-name">{img.productInfo == null ? null : img.productInfo.proName}</div>
                        <Button onClick={this.handleShowDetail.bind(this, img.proId)}>购买</Button>
                    </div>
                </div>
            );
        });
        this.state.arrangeImgList.forEach((img, index) => {
            if (index < 3) {
                arrangeProDiv1.push(
                    <div className="arrange-item">
                        <Card.Grid onClick={this.handleShowDetail.bind(this, img.proId)}>
                            <img src={img.imgCode} />
                            <div className="item-title">{img.productInfo == null ? null : img.productInfo.proName}</div>
                            <div className="item-price">￥ {img.productInfo == null ? null : img.productInfo.price}</div>
                        </Card.Grid>
                    </div>
                );
            } else {
                arrangeProDiv2.push(
                    <div className="arrange-item">
                        <Card.Grid onClick={this.handleShowDetail.bind(this, img.proId)}>
                            <img src={img.imgCode} />
                            <div className="item-title">{img.productInfo == null ? null : img.productInfo.proName}</div>
                            <div className="item-price">￥ {img.productInfo == null ? null : img.productInfo.price}</div>
                        </Card.Grid>
                    </div>
                );
            }
        });
        return (
            <div className="home-page-content">
                <Carousel autoplay>
                    {carouselDiv}
                </Carousel>
                <div className="small-product">
                    {smallProDiv}
                </div>
                <div className="line-bg"></div>
                <div className="arrange-product">
                    {arrangeProDiv1}
                </div>
                <div className="arrange-product">
                    {arrangeProDiv2}
                </div>
            </div >
        )
    }
}

export default HomePage;