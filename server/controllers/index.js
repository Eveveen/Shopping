const router = require("express").Router();
const path = require('path');
const utils = require('../common/utils');

router.get('/beats', function (req, res) {
    res.send("ok");
});
var express = require('express');
var outTradeId = Date.now().toString();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/checkIsAdmin', function (req, res) {
    let flag = false;
    if (req.session.admin && req.session.admin.name != null) {
        flag = true;
    }
    res.send(flag);
});

router.get('/checkIsSeller', function (req, res) {
    let flag = false;
    if (req.session.seller && req.session.seller.sellerId != null) {
        flag = true;
    }
    res.send(flag);
});

module.exports = router;