import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Menu, Icon } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/main.sass';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
const SubMenu = Menu.SubMenu;
import { Link, browserHistory } from 'react-router';

class AdminIndex extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default AdminIndex;