import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {
    App, LoginIndex, Login, Register, ProductIndex, HomePage, DetailInfo, Remark,
    OrderItem, MenuIndex, CartPage, Account, Collect, BuyItem, AddressList, AccountMenu,
    EditAddress, EditProduct, UploadItem, AdminHeader, User, Seller, ShopProduct, ShopIndex,
    ShopMenu
} from '../components';
import { BASE_URL } from '../../conf/config';
import { adminOperationTypeEnum } from '../data/enum';
import Success from '../components/common/Success/success';

const baseUrl = BASE_URL.substring(1);

const routes = (
    <Router history={browserHistory}>
        <Route path={"/"} component={App} >
            <IndexRoute component={Login} />
            <Route path={"/upload"} component={UploadItem} />

            <Route path={baseUrl} component={MenuIndex}>
                <Route path={"/register"} component={Register} />
                <IndexRoute component={HomePage} />
                <Route path={"/home"} component={HomePage} />
                <Route path={"/buy/:id"} component={BuyItem} />
                <Route path={"/item"} component={DetailInfo} />
                {/* <Route path={"/account"} component={Account} /> */}
                {/* <Route path={"/address"} component={AddressList} /> */}
                <Route path={"/collectTreasure"} component={Collect} />
                <Route path={"/collectShop"} component={Collect} />
                <Route path={"/order"} component={OrderItem} />
                <Route path={"/cart"} component={CartPage} />
                <Route path={"/remark"} component={Remark} />
                <Route path={"/success"} component={Success} />

                <Route path={"/account/:role"} component={App}>
                    <IndexRoute component={Account} />
                    <Route path="member" component={Account} />
                    <Route path="address" component={AddressList} />
                    <Route path="editAddress/:id" component={EditAddress} />
                </Route>
            </Route>
            <Route path={"/shop"} component={ShopMenu}>
                <IndexRoute component={ShopIndex} />
                <Route path="product" component={ShopProduct} />
                <Route path="editProduct" component={EditProduct} />
            </Route>
            <Route path={"/admin"} component={AdminHeader}>
                <IndexRoute component={Seller} />
                <Route path="seller" component={Seller} />
                <Route path="user" component={User} />
            </Route>
        </Route>
    </Router >
);

export default routes;