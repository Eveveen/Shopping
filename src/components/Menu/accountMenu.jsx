import React, { Component } from 'react';
import axios from 'axios';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import './accountMenu.sass';
const FormItem = Form.Item;
import intl from 'react-intl-universal';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class AccountMenu extends Component {
    state = {
        current: "user/member"
    }

    handleClick = (e) => {
        console.log('click ', e);
        if (this.props.pathname == "shop") {
            browserHistory.push(BASE_URL + "/shop/" + e.key);
        } else {
            browserHistory.push(BASE_URL + "/account/" + e.key);
        }

    }

    render() {
        return (
            <div className="account-munu">
                <div className="manage-menu">
                    <Menu
                        onClick={this.handleClick}
                        style={{ width: 256 }}
                        // defaultSelectedKeys={[this.state.current]}
                        defaultSelectedKeys={[this.props.keyMenu]}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="light"
                    >
                        <SubMenu key="sub1" title={<span><Icon type="mail" /><span>帐号管理</span></span>}>
                            <Menu.Item key="user/member">个人资料</Menu.Item>
                            {this.props.pathname == "shop" ? null : <Menu.Item key="user/address">收货地址</Menu.Item>}
                        </SubMenu>
                    </Menu>
                </div>
            </div>
        )
    }
}

export default Form.create()(AccountMenu);