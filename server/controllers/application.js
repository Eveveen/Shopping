const router = require("express").Router();
const path = require('path');
const config = require('../../conf/config');
const utils = require('../common/utils');
const httpAgent = require('../common/httpAgent');
const log4js = require('log4js');
const logger = log4js.getLogger();
const request = require('request');
const fs = require('fs');
const multer = require('multer')
const paramsMulter = multer({ dest: 'upload/' });

router.get("/getApplicationList", function (req, res) {
    const path = "/applications";
    httpAgent.httpRequest({ service: "" }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getApplication/:id", function (req, res) {
    const path = "/applications/" + req.params.id;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getRoles/:id", function (req, res) {
    const path = "/applications/" + req.params.id + "/roles";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/createApplication", function (req, res) {
    const { appSystemName, appDisplayName, appUrl, appInternalUrl, iconId, status } = req.body;
    const path = "/applications";
    const data = {
        "appSysname": appSystemName,
        "displayName": appDisplayName,
        "appUrl": appUrl,
        "appInternalUrl": appInternalUrl,
        "iconId": iconId,
        "activeFlag": status,
        "createdBy": req.session.principal.loginName,
        "createdTime": "2018-02-26T02:14:34.100Z",
        "updateBy": req.session.principal.loginName,
        "updateTime": "2018-02-26T02:14:34.100Z"
    }
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/updateApplicationById/:id", function (req, res) {
    const { appSystemName, appDisplayName, appUrl, appInternalUrl, iconId, status } = req.body;
    const path = "/applications/" + req.params.id;
    const data = {
        "appId": req.params.id,
        "appSysname": appSystemName,
        "displayName": appDisplayName,
        "appUrl": appUrl,
        "appInternalUrl": appInternalUrl,
        "iconId": iconId,
        "activeFlag": status,
        "createdBy": req.session.principal.loginName,
        "createdTime": "2018-02-26T02:14:34.100Z",
        "updateBy": req.session.principal.loginName,
        "updateTime": "2018-02-26T02:14:34.100Z"
    }
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/deleteApplicationById/:id", function (req, res) {
    const { appSystemName, appDisplayName, appUrl, appInternalUrl, iconUrl, status } = req.body;
    const path = "/applications/" + req.params.id;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "delete", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/updateRolesByAppId/:id", function (req, res) {
    const { roles } = req.body;
    const path = "/applications/" + req.params.id + "/roles";
    const data = [];
    roles.map(role => {
        data.push({
            "appId": req.params.id,
            "roleId": role.roleId,
            "roleName": role.roleName
        })
    });

    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/uploadIcon", paramsMulter.any(), function (req, res) {
    if (req.files.length > 0) {
        let filePath = req.files[0].path;
        let fileMimetype = req.files[0].mimetype;
        let data = fs.readFileSync(filePath);
        data = new Buffer(data).toString('base64');
        let base64 = 'data:' + fileMimetype + ';base64,' + data;
        const path = utils.BASE_URL_V2 + "/tenant/upload";
        httpAgent.httpRequest({ iconCode: base64 }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (resData) {
            if (!resData.error) {
                res.send({ iconId: resData });
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

router.get("/getIconById/:id", function (req, res) {
    const path = "/v2/tenant/icon/" + req.params.id;
    httpAgent.httpRequest({ "iconId": req.params.id }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});
module.exports = router;