import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {
    App, LoginIndex, Login, Register, ProductIndex, HomePage, DetailInfo, Remark,
    OrderItem, MenuIndex, CartPage, Account, Collect, BuyItem, AddressList, AccountMenu,
    EditAddress, EditProduct, UploadItem, AdminHeader, User, Seller, ShopProduct, ShopIndex,
    ShopMenu, BuyNow, EditUser, EditSeller, SellerShop, ShopItem, SearchProductItem, Pay
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
                <Route path={"/buyNow/:id"} component={BuyNow} />
                <Route path={"/item/:proId"} component={DetailInfo} />
                {/* <Route path={"/account"} component={Account} /> */}
                {/* <Route path={"/address"} component={AddressList} /> */}
                <Route path={"/collectTreasure"} component={Collect} />
                <Route path={"/collectShop"} component={Collect} />
                <Route path={"/order"} component={OrderItem} />
                <Route path={"/cart"} component={CartPage} />
                <Route path={"/remark/:id"} component={Remark} />
                <Route path={"/searchProduct/:name"} component={SearchProductItem} />
                <Route path={"/success"} component={Success} />
                <Route path={"/viewShop/:id"} component={ShopItem} />

                <Route path={"/account/:role"} component={App}>
                    <IndexRoute component={Account} />
                    <Route path="member" component={Account} />
                    <Route path="address" component={AddressList} />
                    <Route path="editAddress/:id" component={EditAddress} />
                </Route>
            </Route>

            <Route path={"/pay/:orderNum"} component={Pay} />

            <Route path={"/shop"} component={ShopMenu}>
                <IndexRoute component={ShopIndex} />
                <Route path="product" component={ShopProduct} />
                <Route path="editProduct/:proId" component={EditProduct} />
            </Route>
            <Route path={"/admin"} component={AdminHeader}>
                <IndexRoute component={Seller} />
                <Route path="seller" component={Seller} />
                <Route path="editSeller/:sellerId/:shopId" component={EditSeller} />
                <Route path="editShop/:id" component={SellerShop} />
                <Route path="user" component={User} />
                <Route path="editUser/:id" component={EditUser} />
            </Route>
        </Route>
    </Router >
);

export default routes;