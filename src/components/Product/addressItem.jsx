import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Radio } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/addressItem.sass';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';

class AddressItem extends Component {

    handleEditAddress = () => {
        browserHistory.push(BASE_URL + "/account/editAddress");
    }

    render() {
        return (
            <div className="confirm-address">
                <div className="confirm-address-title">
                    确认收货地址
               </div>
                {this.renderAddressItem()}
            </div >
        )
    }
    renderAddressItem() {
        return (
            <div className="address-radio">
                <Radio>
                    江苏省 南通市 崇川区 狼山镇街道 啬园路9号南通大学主校区（孙梦娟 收）
                    18206295937

                </Radio>
                <div className="adddress-operation">
                    <div className="address-status">
                        默认地址
                    </div>
                    <div className="address-edit" onClick={this.handleEditAddress}>
                        修改本地址
                    </div>
                </div>
            </div >
        )
    }
}

export default AddressItem;