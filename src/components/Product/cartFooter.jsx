import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';
import intl from 'react-intl-universal';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
import './Style/cartFooter.sass';
import { Menu, Icon, Form, Input, Checkbox, Button, Cascader, Select, Table, Divider } from 'antd';

class CartFooter extends Component {
    state = {

    }

    render() {
        const { footerContent, footerShow } = this.props;
        return (
            <div className="footer-main" style={{ display: footerShow ? 'block' : 'none' }}>
                {footerContent}
                <div className="balance">
                    <Button onClick={this.props.handleBuy}>结算</Button>
                    {/* <div className="button">结算</div> */}
                </div>
            </div>
        )
    }

}

export default CartFooter;