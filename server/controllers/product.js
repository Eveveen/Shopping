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