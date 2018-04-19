import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {
    App, LoginIndex, Login, Register, ProductIndex, HomePage, DetailInfo, Remark,
    OrderItem, MenuIndex, CartPage, Account, Collect, BuyItem
} from '../components';
import { BASE_URL } from '../../conf/config';
import { adminOperationTypeEnum } from '../data/enum';
import Success from '../components/common/Success/success'

const baseUrl = BASE_URL.substring(1);

const routes = (
    <Router history={browserHistory}>
        <Route path={"/"} component={App} >
            <IndexRoute component={Login} />
            <Route path={"/register"} component={Register} />
            <Route path={baseUrl} component={MenuIndex}>
                <IndexRoute component={HomePage} />
                <Route path={"/home"} component={HomePage} />
                <Route path={"/buy"} component={BuyItem} />
                <Route path={"/item"} component={DetailInfo} />
                <Route path={"/account"} component={Account} />
                <Route path={"/collectTreasure"} component={Collect} />
                <Route path={"/collectShop"} component={Collect} />
                <Route path={"/order"} component={OrderItem} />
                <Route path={"/cart"} component={CartPage} />
                <Route path={"/remark"} component={Remark} />
                <Route path={"/success"} component={Success} />
            </Route>
        </Route>
    </Router >
);

export default routes;