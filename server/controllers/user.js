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
// const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'xx'
const secretAccessKey = 'xx'
//初始化sms_client
// let smsClient = new SMSClient({ accessKeyId, secretAccessKey })

/**
 * 登录
 */
router.post("/login", function (req, res) {
    const path = utils.PROJECT + "/login";
    const { data } = req.body;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        req.session.user = req.body.data;
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
    // logger.error('no permission to get "/getChannel"');
    // res.sendStatus(403);
});

/**
 * 获取验证码
 */
router.post("/getCode", function (req, res) {
    var code = parseInt(Math.random() * 100000)
    const { telphone } = req.body;
    const path = utils.PROJECT + "/saveCode";
    //num.substring(0,s.indexOf(".")+3);
    var sendCode = `` + code.toString().slice(0, 4) + ``;
    console.log(sendCode)
    var sendData = {
        PhoneNumbers: telphone,
        SignName: 'xx',
        TemplateCode: 'SMS_130840278',
        TemplateParam: '{"code":' + '"' + sendCode + '"' + '}'
    }
    // res.send(sendCode)
    httpAgent.httpRequest({ telphone: telphone, validateCode: sendCode }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
    // smsClient.sendSMS(sendData).then(function (data) {
    //     let { Code } = data
    //     if (Code === 'OK') {
    //         //处理返回参数
    //         console.log(data)
    //         res.send(data)
    //     }
    // }, function (err) {
    //     res.send({ error: { code: -1, msg: err } });
    // })
});

/**
 * 验证验证码
 */
router.post("/verifyCode", function (req, res) {
    const path = utils.PROJECT + "/verifyCode";
    const { data } = req.body;
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
    // logger.error('no permission to get "/getChannel"');
    // res.sendStatus(403);
});

/**
 * 注册新用户
 */
router.post("/addUser", function (req, res) {
    const { data } = req.body;
    const path = utils.PROJECT + "/addUser";
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 根据用户姓名获取用户信息
 */
router.get("/getUserInfo", function (req, res) {
    const path = utils.PROJECT + "/getUserInfo";
    httpAgent.httpRequest({ userName: req.session.user.userName }, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        req.session.user = data;
        res.send(data);
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});

/**
 * 更新用户信息
 */
// router.post("/updateUser", function (req, res) {
//     const path = utils.PROJECT + "/updateUser";
//     const { data } = req.body;
//     console.log("ddd----", data);
//     httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (data) {
//         res.send(data);
//     }, function (statusCode, msg) {
//         res.send({ error: { code: -1, msg: msg } });
//     })
// });

router.post("/updateUser", function (req, res) {
    const { data } = req.body;
    console.log("111,,,", data)
    const path = utils.PROJECT + "/updateUser";
    httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "get", function (data) {
        // res.send(data);
        console.log(data)
        res.send(data);
        // res.status(200).send(data)
    }, function (statusCode, msg) {
        res.send({ error: { code: -1, msg: msg } });
    })
});


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

// router.post("/createChannel", function (req, res) {
//     const { channelName, rules } = req.body;
//     const path = utils.PROJECT + "/channel";
//     const data = {
//         "createBy": req.session.cas.user,
//         "channelName": channelName,
//         "rules": rules
//     }
//     httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "post", function (data) {
//         res.send(data);
//     }, function (statusCode, msg) {
//         res.send({ error: { code: -1, msg: msg } });
//     })
//     // logger.error('no permission to get "/createChannel"');
//     // res.sendStatus(403);
// });

// router.post("/editChannel/:id", function (req, res) {
//     if (checkIsRole(req) == true) {
//         const { channelName, rules } = req.body;
//         const path = utils.BASE_URL_V2 + "/channel/" + req.params.id;
//         const data = {
//             "createBy": req.session.cas.user,
//             "channelName": channelName,
//             "rules": rules
//         }
//         httpAgent.httpRequest(data, "json", config.BACKEND_API.TYPE, config.BACKEND_API.HOST, config.BACKEND_API.PORT, path, "put", function (data) {
//             res.send(data);
//         }, function (statusCode, msg) {
//             res.send({ error: { code: -1, msg: msg } });
//         })
//     } else {
//         logger.error('no permission to get "/editChannel"');
//         res.sendStatus(403);
//     }
// });

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