import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Radio } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
import './Style/addressItem.sass';
import { Link, browserHistory } from 'react-router';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
const RadioGroup = Radio.Group;

class AddressItem extends Component {

    state = {
        addressData: [],
    }

    componentWillMount() {
        this.setState({
            addressData: this.props.addressData,
        })
    }

    handleEditAddress = () => {
        browserHistory.push(BASE_URL + "/account/user/editAddress");
    }

    handleChageAddress = (e) => {
        // this.setState({
        //     orderAddressId: e.target.value
        // })
        this.props.handleChageAddress(e);
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
        const { addressData } = this.state;
        const { orderAddressId } = this.props;
        let addressDiv = [];
        let tempAddressDiv = [];
        let defaultAddressId = '';
        addressData.forEach(address => {
            if (address.addressStatus == 1) {
                defaultAddressId = address.addressId;
            }
            tempAddressDiv.push(
                <div className="address-radio">
                    <Radio value={address.addressId}>
                        {address.area} {address.addressName} （{address.consignee} 收） {address.telphone}
                        <div className="adddress-operation">
                            <div className="address-status">
                                默认地址
                            </div>
                            <div className="address-edit" onClick={this.handleEditAddress}>
                                修改本地址
                            </div>
                        </div>
                    </Radio>
                </div >)
        });
        addressDiv = (
            <RadioGroup onChange={this.handleChageAddress} value={orderAddressId}>{tempAddressDiv}</RadioGroup>
        );
        return (
            <div>{addressDiv}</div>
        )

    }
}

export default AddressItem;