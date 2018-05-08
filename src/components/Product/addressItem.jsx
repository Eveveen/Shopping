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
        orderAddressId: ''
    }

    componentWillMount() {
        axios.get(SERVICE_URL + "/product/getAllAddress")
            .then(response => {
                const resData = response.data;
                if (response.status == 200 && !resData.error) {
                    resData.forEach(address => {
                        if (address.addressStatus == 1) {
                            this.state.orderAddressId = address.addressId;
                        }
                    });
                    this.setState({ showLoading: false, addressData: resData });
                } else {
                    message.error("获取地址失败");
                    this.setState({ showLoading: false })
                }
            }).catch(error => {
                console.log(error);
                this.setState({ showLoading: false })
                message.error("获取地址失败");
            });
    }

    handleEditAddress = () => {
        browserHistory.push(BASE_URL + "/account/user/editAddress");
    }

    handleChageAddress = (e) => {
        this.setState({
            orderAddressId: e.target.value
        })
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
        const { addressData, orderAddressId } = this.state;
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