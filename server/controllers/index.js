const router = require("express").Router();
const path = require('path');

const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'LTAI4U9l91SizWvG'
const secretAccessKey = 'x9Bp7LYdvUCOPHOTqU3otr0itlJJtn'
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})

router.get('/beats', function (req, res) {
    res.send("ok");
});

router.post("/getCode", function (req, res) {
    var code = parseInt(Math.random() * 100000)
    
    //num.substring(0,s.indexOf(".")+3);
    var code2 = `` + code.toString().slice(0,4) + ``;
    var sendData = {
        PhoneNumbers: '18206295937',
        SignName: '孙梦娟',
        TemplateCode: 'SMS_130840278',
        TemplateParam: '{"code":' + '"' + code2 + '"' + '}'
    }
    console.log(code2);
    smsClient.sendSMS(sendData).then(function (data) {
        let {Code}=data
        if (Code === 'OK') {
            //处理返回参数
            console.log(data)
            res.send(data)
        }
    }, function (err) {
        res.send({ error: { code: -1, msg: err } });
    })
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
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/pay', function(req, res, next) {
    var url=  ali.webPay({
        body: "ttt",
        subject: "ttt1",
        outTradeId: "201503200101010222",
        timeout: '90m',
        amount: "0.1",
        sellerId: '',
        product_code: 'FAST_INSTANT_TRADE_PAY',
        goods_type: "1",
        return_url:"127.0.0.1:3000",
    })

    var url_API = 'https://openapi.alipay.com/gateway.do?'+url;
    res.json({url:url_API})
});

module.exports = router;