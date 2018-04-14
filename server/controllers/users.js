const router = require("express").Router();
const path = require('path');
const config = require('../../conf/config');
const utils = require('../common/utils');
const httpAgent = require('../common/httpAgent');
const log4js = require('log4js');
const logger = log4js.getLogger();
const request = require('request');
const fs = require('fs');

router.get("/getlist", function (req, res) {
    const path = "/users/" + req.session.principal.userId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        const sendData = {};
        sendData.currentUserRole = req.session.principal.roleFlag;
        sendData.data = data;
        res.send(sendData);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.get("/getTenant/:id", function (req, res) {
    const {
        id
    } = req.params;
    const path = "/users/" + id + "/tenants";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.get("/getPermission/:id", function (req, res) {
    const {
        id
    } = req.params;
    const path = "/users/" + id + "/permissions";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.get("/getUser/:id", function (req, res) {
    const {
        id
    } = req.params;
    const path = "/users/uid/" + id;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        data.currentUserRole = req.session.principal.roleFlag;
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.get("/getUserExt/:id", function (req, res) {
    const {
        id
    } = req.params;
    const path = "/users-ext/uid/" + id;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.post("/editUserExt", function (req, res) {
    const {
        userId,
        list
    } = req.body;
    const data = { "userExtList": list };
    const path = "/users-ext/uid/" + userId;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.post("/addUser", function (req, res) {
    const {
        loginName,
        password,
        firstName,
        lastName,
        email,
        timezone,
        passwordQuestion,
        passwordAnswer,
        activeFlag,
        roleFlag
    } = req.body;
    const data = {
        "loginName": loginName,
        "password": password,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "timezone": timezone,
        "passwordQuestion": passwordQuestion,
        "passwordAnswer": passwordAnswer,
        "activeFlag": activeFlag,
        "createdBy": req.session.principal.userId,
        "updateBy": req.session.principal.userId,
        "roleFlag": roleFlag
    }
    const path = utils.BASE_URL_V2 + "/users";
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.post("/editUser", function (req, res) {
    const {
        firstName,
        lastName,
        email,
        timezone,
        passwordQuestion,
        passwordAnswer,
        activeFlag,
        userId,
        roleFlag
    } = req.body;
    const data = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "timezone": timezone,
        "passwordQuestion": passwordQuestion,
        "passwordAnswer": passwordAnswer,
        "activeFlag": activeFlag,
        "updateBy": req.session.principal.userId,
        "roleFlag": roleFlag
    }
    const path = "/users/" + userId;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.post("/delUser", function (req, res) {
    const {
        userId
    } = req.body;
    const data = {
        "userIds": [userId]
    }
    const path = utils.BASE_URL_V2 + "/users";
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "delete", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

router.post("/updateUserPwd", function (req, res) {
    const {
        userId,
        loginName,
        password
    } = req.body;
    const data = {
        "loginName": loginName,
        "password": password
    }
    const path = utils.BASE_URL_V2 + "/users/password/" + userId;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({
            error: {
                code: -1,
                msg: msg
            }
        });
    })
});

module.exports = router;