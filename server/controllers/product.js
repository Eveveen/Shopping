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

router.post("/addProduct", function (req, res) {
    const { data } = req.body;
    const path = utils.PROJECT + "/addProduct";
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (resData) {
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

router.post("/changeAddressStatus", function (req, res) {
    const path = utils.PROJECT + "/changeAddressStatus";
    httpAgent.httpRequest({ userId: req.session.user.userId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/editAddress", function (req, res) {
    const path = utils.PROJECT + "/editAddress";
    const { data } = req.body;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/deleteAddress/:id", function (req, res) {
    const path = utils.PROJECT + "/deleteAddress";
    httpAgent.httpRequest({ addressId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

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

router.get("/getProduct/:id", function (req, res) {
    const path = utils.PROJECT + "/getAllProduct";
    httpAgent.httpRequest({ shopId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/deleteOneCart/:cartId", function (req, res) {
    const path = utils.PROJECT + "/deleteCart";
    httpAgent.httpRequest({ cartId: req.params.cartId }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/deleteMoreCart", function (req, res) {
    const path = utils.PROJECT + "/deleteCarts";
    const { selectedCartIds } = req.body;
    console.log("selectedCartIds", selectedCartIds)
    httpAgent.httpRequest({ cartIds: selectedCartIds }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/editCartNum", function (req, res) {
    const path = utils.PROJECT + "/editCart";
    let data = req.body;
    console.log(data);
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getAllShop", function (req, res) {
    const path = utils.PROJECT + "/getAllShop";
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