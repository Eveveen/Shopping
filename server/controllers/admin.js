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
 * 管理员登录
 */
router.post("/login", function (req, res) {
    const path = utils.PROJECT + "/admin/login";
    const { data } = req.body;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        req.session.admin = data;
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
        delete req.session.admin;
        res.send(true);
    } else {
        logger.error('no permission to get "/logout"');
        res.sendStatus(403);
    }
});

/**
 * 获取所有的卖家
 */
router.get("/getAllSeller", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/seller/getAllSeller";
        httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getAllSeller"');
        res.sendStatus(403);
    }
});

/**
 * 根据卖家编号获取卖家信息
 */
router.get("/getSeller/:id", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/seller/getSeller";
        httpAgent.httpRequest({ sellerId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getSeller"');
        res.sendStatus(403);
    }
});

/**
 * 添加卖家
 */
router.post("/addSeller", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/seller/addSeller";
        const { data } = req.body;
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/addSeller"');
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
 * 删除卖家，应该级联删除店铺
 */
router.get("/deleteSeller/:id", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/seller/deleteSeller";
        httpAgent.httpRequest({ sellerId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/deleteSeller"');
        res.sendStatus(403);
    }
});

/**
 * 获取所有的店铺
 */
router.get("/getAllShop", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/getAllShop";
        httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getAllShop"');
        res.sendStatus(403);
    }
});

/**
 * 获取卖家的店铺
 */
router.get("/getSellerShop/:id", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/getSellerShop";
        httpAgent.httpRequest({ sellerId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
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
 * 根据店铺的状态查询店铺
 */
router.get("/getShopByShopStatus/:shopStatus", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/getShopByShopStatus";
        httpAgent.httpRequest({ shopStatus: req.params.shopStatus }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getShopByShopStatus"');
        res.sendStatus(403);
    }
});

/**
 * 添加店铺，一个卖家只能有一个店铺
 */
router.post("/addShop", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/addShop";
        const { data } = req.body;
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/addShop"');
        res.sendStatus(403);
    }
});

/**
 * 编辑店铺
 */
router.post("/editShop", function (req, res) {
    if (checkIsRole(req) == true) {
        const { data } = req.body;
        const path = utils.PROJECT + "/editShop";
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/editShop"');
        res.sendStatus(403);
    }
});

/**
 * 删除店铺
 */
router.get("/deleteShop/:id", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/deleteShop";
        httpAgent.httpRequest({ shopId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/deleteShop"');
        res.sendStatus(403);
    }
});


/**
 * 获取所有的买家
 */
router.get("/getAllUser", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/getAllUser";
        httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getAllUser"');
        res.sendStatus(403);
    }
});

/**
 * 根据买家编号获取买家信息
 */
router.get("/getUser/:id", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/getUser";
        httpAgent.httpRequest({ userId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/getUser"');
        res.sendStatus(403);
    }
});

/**
 * 添加买家
 */
router.post("/addUser", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/addUser";
        const { data } = req.body;
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/addUser"');
        res.sendStatus(403);
    }
});


/**
 * 编辑买家信息
 */
router.post("/editUser", function (req, res) {
    if (checkIsRole(req) == true) {
        const { data } = req.body;
        const path = utils.PROJECT + "/editUser";
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/editUser"');
        res.sendStatus(403);
    }
});

/**
 * 删除买家
 */
router.get("/deleteUser/:id", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.PROJECT + "/deleteUser";
        httpAgent.httpRequest({ userId: req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/deleteUser"');
        res.sendStatus(403);
    }
});

function checkIsRole(req) {
    let flag = false;
    if (req.session.admin && req.session.admin.name != null) {
        flag = true;
    }
    return flag;
}

module.exports = router;