const router = require("express").Router();
const path = require('path');
const config = require('../../conf/config');
const httpAgent = require('../common/httpAgent');
const utils = require('../common/utils');
const log4js = require('log4js');
const logger = log4js.getLogger();

//save to check role

//v2
router.get("/personas", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/personas";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/personas", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/campaign/calculate/" + req.params.destinationId + "/" + req.session.principal.userId;
    const path = "/personas";
    httpAgent.httpRequest(req.body, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/persona/:id", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/personas/" + req.params.id;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/persona/:id", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/personas/" + req.params.id;
    httpAgent.httpRequest(req.body, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
        console.log(data)
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/deletePersona/:id", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/personas/" + req.params.id;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "delete", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/applications", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/applications";
    httpAgent.httpRequest({ service: "" }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/persona/:id/applications", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/personas/" + req.params.id + "/applications";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/persona/:id/applications", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/persona-app/" + req.params.id;
    httpAgent.httpRequest(req.body, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/tenants", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/tenants/all/" + req.session.principal.userId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/tenants/:id/users", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/tenants/" + req.params.id + "/users";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/user/:personalId/:tenantId/users", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/persona-user/" + req.params.personalId + "/" + req.params.tenantId + "/users";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/user/:personalId/:tenantId", function (req, res) {
    // const path = utils.BASE_URL_V2 + "/personas";
    const path = "/persona-user/" + req.params.personalId + "/" + req.params.tenantId;
    httpAgent.httpRequest(req.body, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

module.exports = router;