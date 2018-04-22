const router = require("express").Router();
const path = require('path');
const utils = require('../common/utils');

router.get('/beats', function (req, res) {
    res.send("ok");
});


var express = require('express');
var Alipay = require('../../assets/lib/alipay');
var utl = require('../../assets/lib/utl');

var outTradeId = Date.now().toString();

var ali = new Alipay({
    appId: '2017060207410259',
    notifyUrl: 'http://127.0.0.1:3000/',
    rsaPrivate: path.resolve('assets/pem/alipay_private_key_nonjava.pem'),
    rsaPublic: path.resolve('assets/pem/alipay_public_key_nonjava.pem'),
    sandbox: true,
    signType: 'RSA2'
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/pay', function (req, res, next) {
    var url = ali.webPay({
        body: "ttt",
        subject: "ttt1",
        outTradeId: "201503200101010222",
        timeout: '90m',
        amount: "0.1",
        sellerId: '',
        product_code: 'FAST_INSTANT_TRADE_PAY',
        goods_type: "1",
        return_url: "127.0.0.1:3000",
    })

    var url_API = 'https://openapi.alipay.com/gateway.do?' + url;
    res.json({ url: url_API })
});

module.exports = router;