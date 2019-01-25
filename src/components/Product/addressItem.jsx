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

    handleEditAddress = (addressId) => {
        browserHistory.push(BASE_URL + "/account/user/editAddress/" + addressId);
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
                        <div className="radio-text">
                            <div className="address-radio-text">{address.area}</div>
                            <div className="address-radio-text">{address.addressName} </div>
                            <div className="address-radio-text">（{address.consignee} 收） </div>
                            <div className="address-radio-text">{address.telphone}</div>
                            <div className="adddress-operation">
                                <div className="address-edit" onClick={this.handleEditAddress.bind(this, address.addressId)}>
                                    修改本地址
                                </div>
                                <div className="address-status">
                                    {address.addressStatus == 1 ? "默认地址" : ""}
                                </div>
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