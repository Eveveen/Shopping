import React, { Component } from 'react';
import { Button, Input, AutoComplete, Upload, Modal, message, Icon, Form, Tabs, Layout } from 'antd';
const TabPane = Tabs.TabPane;
const { Header, Footer, Sider, Content } = Layout;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import './Style/category.sass';

class Category extends Component {

    callback = (key) => {
        console.log(key);
    }

    render() {
        return (
            <div className="category">
                <Layout>
                    <Header>{this.renderCategoryHeader()}</Header>
                    <Layout>
                        <Sider>Sider</Sider>
                        <Content>{this.renderThemeMarket()}</Content>
                    </Layout>
                    <Footer></Footer>
                </Layout>
            </div >
        )
    }

    renderCategoryHeader() {
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

    renderThemeMarket() {
        return (
            <div>
                <Tabs onChange={this.callback} type="card">
                    <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
                    <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                </Tabs>
            </div>
        )
    }
}

export default Category;