import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
// import './Style/main.sass';
import HomePage from './homePage';

class ProductIndex extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div >
        )
    }
}

export default ProductIndex;