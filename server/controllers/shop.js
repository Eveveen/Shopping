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
 * 登出
 */
router.get("/logout", function (req, res) {
    if (checkIsRole(req) == true) {
        delete req.session.seller;
        res.send(true);
    } else {
        logger.error('no permission to get "/logout"');
        res.sendStatus(403);
    }
});

/**
 * 获取验证码
 */
router.post("/getCode", function (req, res) {
    var code = parseInt(Math.random() * 100000)
    const { telphone } = req.body;
    var sendCode = `` + code.toString().slice(0, 4) + ``;
    const path = utils.PROJECT + "/seller/saveCode/" + sendCode + "/" + telphone;
    //num.substring(0,s.indexOf(".")+3);
    console.log(sendCode)
    console.log(telphone)
    var sendData = {
        PhoneNumbers: telphone,
        SignName: '孙梦娟',
        TemplateCode: 'SMS_130840278',
        TemplateParam: '{"code":' + '"' + sendCode + '"' + '}'
    }
    // res.send(sendCode)
    let data = { telphone: telphone, validateCode: sendCode };
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
    // smsClient.sendSMS(sendData).then(function (data) {
    //     let { Code } = data
    //     if (Code === 'OK') {
    //         //处理返回参数
    //         console.log(data)
    //         // res.send(data)
    //     }
    // }, function (err) {
    //     res.send({ error: { code: -1, msg: err } });
    // })
});

/**
 * 验证验证码
 */
router.post("/verifyCode", function (req, res) {
    const path = utils.PROJECT + "/seller/verifyCode";
    const { data } = req.body;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
    // logger.error('no permission to get "/getChannel"');
    // res.sendStatus(403);
});

/**
 * 获取卖家信息
 */
router.get("/getSellerInfo", function (req, res) {
    if (checkIsRole(req) == true) {
        res.send(req.session.seller);
    } else {
        logger.error('no permission to get "/getSellerInfo"');
        res.sendStatus(403);
    }
});

/**
 * 编辑卖家信息
 */
router.post("/editSeller", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/seller/editSeller";
        const { data } = req.body;
        data.sellerId = req.session.seller.sellerId;
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/editSeller"');
        res.sendStatus(403);
    }
});

/**
 * 获取卖家的店铺
 */
router.get("/getSellerShop", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/getSellerShop";
        httpAgent.httpRequest({ sellerId: req.session.seller.sellerId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getSellerShop"');
        res.sendStatus(403);
    }
});

/**
 * 获取该店铺的所有订单
 */
router.get("/getShopOrder/:shopId", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/getShopOrder";
        httpAgent.httpRequest({ shopId: req.params.shopId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getShopOrder"');
        res.sendStatus(403);
    }
});

/**
 * 根据评价状态查询该店铺的订单
 */
router.post("/getOrderByShopIdAndStatus", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/getOrderByShopIdAndStatus";
        const { data } = req.body;
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getOrderByShopIdAndStatus"');
        res.sendStatus(403);
    }
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

/**
 * 搜索店铺内商品
 */
router.post("/searchShopProduct", function (req, res) {
    if (checkIsRole(req) == true) {
        const { data } = req.body;
        const path = utils.PROJECT + "/searchShopProduct";
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
            res.send(resData);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/searchShopProduct"');
        res.sendStatus(403);
    }
});

function checkIsRole(req) {
    let flag = false;
    if ((req.session.seller && req.session.seller.sellerId != null) || (req.session.admin && req.session.admin.name != null)) {
        flag = true;
    }
    return flag;
}

module.exports = router;