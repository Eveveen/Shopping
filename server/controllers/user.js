const router = require("express").Router();
const path = require('path');
const config = require('../../conf/config');
const utils = require('../common/utils');
const httpAgent = require('../common/httpAgent');
const log4js = require('log4js');
const logger = log4js.getLogger();

router.post("/login", function (req, res) {
    const path = utils.PROJECT + "/login";
    const { data } = req.body;
    console.log(req.body)
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
    // logger.error('no permission to get "/getChannel"');
    // res.sendStatus(403);
});

router.post("/createChannel", function (req, res) {
    const { channelName, rules } = req.body;
    const path = utils.PROJECT + "/channel";
    const data = {
        "createBy": req.session.cas.user,
        "channelName": channelName,
        "rules": rules
    }
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
    // logger.error('no permission to get "/createChannel"');
    // res.sendStatus(403);
});

router.post("/editChannel/:id", function (req, res) {
    if (checkIsRole(req) == true) {
        const { channelName, rules } = req.body;
        const path = utils.BASE_URL_V2 + "/channel/" + req.params.id;
        const data = {
            "createBy": req.session.cas.user,
            "channelName": channelName,
            "rules": rules
        }
        httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/editChannel"');
        res.sendStatus(403);
    }
});

router.post("/deleteChannel/:id", function (req, res) {
    if (checkIsRole(req) == true) {
        const path = utils.BASE_URL_V2 + "/channel/" + req.params.id;

        httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "delete", function (data) {
            res.send(data);
        }, function (statusCode, msg) {
            res.send({ error: { code: -1, msg: msg } });
        })
    } else {
        logger.error('no permission to get "/deleteChannel"');
        res.sendStatus(403);
    }
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