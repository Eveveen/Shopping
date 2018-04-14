const router = require("express").Router();
const path = require('path');
const fs = require('fs');
const multer = require("multer"),
    paramsMulter = multer({ dest: 'uploads/' });
const config = require('../../conf/config');
const httpAgent = require('../common/httpAgent');
const utils = require('../common/utils');
const log4js = require('log4js');
const logger = log4js.getLogger();
const request = require('request');

router.get("/getTenantList", function (req, res) {
    const path = "/tenants/all/" + req.session.principal.userId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
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

router.post("/createTenant", function (req, res) {
    const path = utils.BASE_URL_V2 + "/tenant";
    let data = {};
    data.createdBy = req.session.principal.userId;
    data.tenantSysName = req.body.tenantSysName;
    data.displayName = req.body.tenantDisplayName ? req.body.tenantDisplayName : "";
    data.iconId = req.body.iconId;
    data.activeFlag = req.body.activeFlag;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/editTenant/:tenantId", function (req, res) {
    const path = utils.BASE_URL_V2 + "/tenant/" + req.params.tenantId;
    let data = {};
    data.updateBy = req.session.principal.userId;
    data.tenantSysName = req.body.tenantSysName;
    data.displayName = req.body.tenantDisplayName ? req.body.tenantDisplayName : "";
    data.iconId = req.body.iconId;
    data.activeFlag = req.body.activeFlag;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getTenantById/:tenantId", function (req, res) {
    const path = "/tenants/" + req.params.tenantId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getApplications", function (req, res) {
    const path = "/applications";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getChosenApplicationsByTenantId/:tenantId", function (req, res) {
    const path = "/tenants/" + req.params.tenantId + "/applications";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/updateTenantAppLink", function (req, res) {
    const path = utils.BASE_URL_V2 + "/tenant-app/" + req.body.tenantId;
    httpAgent.httpRequest({ appIdList: req.body.selectApplicationIds }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getUsers/:tenantId", function (req, res) {
    const path = "/tenants/" + req.params.tenantId + "/users";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getAllUsers", function (req, res) {
    const path = "/users/" + req.session.principal.userId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/updateTenantUserLink", function (req, res) {
    const path = utils.BASE_URL_V2 + "/tenant-user/" + req.body.tenantId;
    httpAgent.httpRequest({ userIdList: req.body.userKeys }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getAllExtension/:tenantId", function (req, res) {
    const path = "/tenants-ext/tid/" + req.params.tenantId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/updateExtension", function (req, res) {
    const path = "/tenants-ext/tid/" + req.body.tenantId;
    let extensionList = req.body.extensionList;
    let tenantExtList = [];
    for (let i = 0; i < extensionList.length; i++) {
        if ((extensionList[i].key && extensionList[i].key !== "") || (extensionList[i].value && extensionList[i].value !== "")) {
            tenantExtList.push(extensionList[i]);
        }
    }
    httpAgent.httpRequest({ tenantExtList: tenantExtList }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/downloadFile/:sysName", function (req, res) {
    let path = config.BACKEND_API.TYPE + "://" + config.BACKEND_API.HOST;
    if (config.BACKEND_API.PORT && config.BACKEND_API.PORT != "") {
        path += ":" + config.BACKEND_API.PORT;
    }
    path += utils.BASE_URL_V2 + "/tenant/file/" + req.params.sysName;
    request(path).pipe(res);
});

router.post("/updatePgpKey", function (req, res) {
    const path = utils.BASE_URL_V2 + "/tenant/pgp/key/" + encodeURI(req.body.systemName);
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/deleteTenantById", function (req, res) {
    const path = "/tenants/" + req.body.tenantId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "delete", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getAppsAndRolesByTenantId/:tenantId", function (req, res) {
    const path = utils.BASE_URL_V2 + "/tenant/" + req.params.tenantId + "/apps-and-roles";
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getPermissionByTenantUser/:tenantId/:userId", function (req, res) {
    const path = "/permissions/" + req.params.tenantId + "/" + req.params.userId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.get("/getUserRoleInfoList/:tenantId/:userId", function (req, res) {
    const path = "/user-roles/uid/" + req.params.userId + "/tid/" + req.params.tenantId;
    httpAgent.httpRequest({}, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/updateUserRoleInfo", function (req, res) {
    const path = utils.BASE_URL_V2 + "/user-roles/uid/" + req.body.userId + "/tid/" + req.body.tenantId;
    httpAgent.httpRequest({ roleIds: req.body.roleIds }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

router.post("/updatePermission", function (req, res) {
    const path = utils.BASE_URL_V2 + "/permissions/" + req.body.tenantId + "/" + req.body.userId;
    httpAgent.httpRequest({ permissionParamList: req.body.permissionList }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (resData) {
        res.send(resData);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

module.exports = router;