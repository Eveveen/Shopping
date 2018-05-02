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

router.post("/uploadImg", paramsMulter.any(), function (req, res) {
    if (req.files.length > 0) {
        let filePath = req.files[0].path;
        let fileMimetype = req.files[0].mimetype;
        let data = fs.readFileSync(filePath);
        data = new Buffer(data).toString('base64');
        let base64 = 'data:' + fileMimetype + ';base64,' + data;
        const path = utils.PROJECT + "/uploadImg";
        const sendData = { imgCode: base64 }
        httpAgent.httpRequest(sendData, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (resData) {
            if (!resData.error) {
                res.send({ imgId: resData });
            } else {
                res.send(resData);
            }
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        res.send({ error: { code: -1, msg: "no files" } });
    }
});

/**
 * 添加商品
 */
router.post("/addProduct", function (req, res) {
    const { data } = req.body;
    data.userId = req.session.user.userId;
    const path = utils.PROJECT + "/addProduct";
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 编辑商品
 */
router.post("/editProduct", function (req, res) {
    const { data } = req.body;
    data.userId = req.session.user.userId;
    const path = utils.PROJECT + "/editProduct";
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 删除商品
 */
router.get("/deleteProduct/:id", function (req, res) {
    const path = utils.PROJECT + "/deleteProduct";
    httpAgent.httpRequest({ proId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 获取所有的地址
 */
router.get("/getAllAddress", function (req, res) {
    const path = utils.PROJECT + "/getAllAddress";
    httpAgent.httpRequest({ userId: req.session.user.userId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 根据地址id获取地址
 */
router.get("/getAddress/:id", function (req, res) {
    const path = utils.PROJECT + "/getAddress";
    httpAgent.httpRequest({ addressId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 添加地址
 */
router.post("/addAddress", function (req, res) {
    const path = utils.PROJECT + "/addAddress";
    const { data } = req.body;
    data.userId = req.session.user.userId;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 更改默认地址
 */
router.post("/changeAddressStatus", function (req, res) {
    const path = utils.PROJECT + "/changeAddressStatus";
    httpAgent.httpRequest({ userId: req.session.user.userId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 编辑地址
 */
router.post("/editAddress", function (req, res) {
    const path = utils.PROJECT + "/editAddress";
    const { data } = req.body;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 删除地址
 */
router.get("/deleteAddress/:id", function (req, res) {
    const path = utils.PROJECT + "/deleteAddress";
    httpAgent.httpRequest({ addressId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 获取当前用户的购物车
 */
router.get("/getAllCart", function (req, res) {
    const path = utils.PROJECT + "/getAllCart";
    httpAgent.httpRequest({ userId: req.session.user.userId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getShop/:id", function (req, res) {
    const path = utils.PROJECT + "/getShop";
    httpAgent.httpRequest({ shopId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 根据店铺编号和商品编号获取商品信息
 */
router.get("/getProduct/:shopId/:proId", function (req, res) {
    const path = utils.PROJECT + "/getProduct";
    let data = {}
    data.shopId = req.params.shopId;
    data.proId = req.params.proId;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 店铺中的商品
 */
router.get("/getProduct/:id", function (req, res) {
    const path = utils.PROJECT + "/getAllProduct";
    httpAgent.httpRequest({ shopId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 删除购物车的一条记录
 */
router.get("/deleteOneCart/:cartId", function (req, res) {
    const path = utils.PROJECT + "/deleteCart";
    httpAgent.httpRequest({ cartId: req.params.cartId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 删除购物车中的多条记录
 */
router.post("/deleteMoreCart", function (req, res) {
    const path = utils.PROJECT + "/deleteCarts";
    const { selectedCartIds } = req.body;
    httpAgent.httpRequest({ cartIds: selectedCartIds }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 编辑购物车中商品数量
 */
router.post("/editCartNum", function (req, res) {
    const path = utils.PROJECT + "/editCart";
    let data = req.body;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 获取该用户的所有订单
 */
router.get("/getAllOrder", function (req, res) {
    const path = utils.PROJECT + "/getAllOrder";
    httpAgent.httpRequest({ userId: req.session.user.userId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 删除订单的一条记录
 */
router.get("/deleteOrder/:id", function (req, res) {
    const path = utils.PROJECT + "/deleteOrder";
    httpAgent.httpRequest({ orderId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 添加评论
 */
router.post("/addComment", function (req, res) {
    const path = utils.PROJECT + "/addComment";
    const { data } = req.body;
    data.userId = req.session.user.userId;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 获取该商品的所有评论
 */
router.get("/getAllComment", function (req, res) {
    const path = utils.PROJECT + "/getAllComment";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
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