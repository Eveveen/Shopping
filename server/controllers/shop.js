const router = require("express").Router();
const path = require('path');
const config = require('../../conf/config');
const utils = require('../common/utils');
const httpAgent = require('../common/httpAgent');
const log4js = require('log4js');
const logger = log4js.getLogger();
const fs = require('fs');
const multer = require('multer')
const paramsMulter = multer({ dest: 'upload/' });

/**
 * 卖家登录
 */
router.post("/login", function (req, res) {
    const path = utils.PROJECT + "/seller/login";
    const { data } = req.body;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        req.session.seller = data;
        res.send(data);

    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 获取卖家的店铺
 */
router.get("/getSellerShop", function (req, res) {
    const path = utils.PROJECT + "/getSellerShop";
    httpAgent.httpRequest({ sellerId: req.session.seller.sellerId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 获取商品首页图片
 */
router.get("/getImg/:id", function (req, res) {
    const path = utils.PROJECT + "/getImg";
    httpAgent.httpRequest({ imgId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});


function checkIsRole(req) {
    const roles = req.session.principal && req.session.principal.roles ? req.session.principal.roles : [];
    for (var i = 0; i < roles.length; i++) {
        if (roles[i] == 'admin') {
            break;
        }
    }
    let flag = i < roles.length ? true : false;
    return flag;
}

module.exports = router;