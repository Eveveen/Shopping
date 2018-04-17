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

class Collect extends Component {
    state = {
        pageStatus: this.props.pageStatus,
        current: this.props.pageStatus
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
                    <Content>{this.props.pageStatus == "collectTreasure" ?
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
                <div className="collect-card">
                    <Card
                        style={{ width: 300 }}
                        cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                        actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
                    >
                        <div className="card-text">
                            <Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title="Card title"
                                description="This is the description"
                            />
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    renderCollectShopContent() {
        return (
            <div>
                <CollectShopChild />
            </div>
        )
    }
}

export default Collect;