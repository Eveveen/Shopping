import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { App, LoginIndex, Login, Register } from '../components';
import { BASE_URL } from '../../conf/config';
import { adminOperationTypeEnum } from '../data/enum';

const baseUrl = BASE_URL.substring(1);

const routes = (
    <Router history={browserHistory}>
        <Route path={"/"} component={App} >
            <IndexRoute component={Login} />
            <Route path={"/register"} component={Register} />
        </Route>
    </Router >
);

export default routes;