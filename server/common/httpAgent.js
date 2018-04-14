const http = require("http"),
    https = require("https"),
    querystring = require("querystring");
const request = require('request');
const fs = require('fs');
const log4js = require('log4js');
const logger = log4js.getLogger();

exports.httpRequest = function (data, dataType, type, host, port, path, method, cbEnd, cbError) {
    var contentType = dataType.toLowerCase() == "json" ? 'application/json' : 'application/x-www-form-urlencoded';
    var headers = {};
    method = method.toLowerCase();
    switch (method) {
        case "post":
            data = JSON.stringify(data);
            headers = {
                "Content-Type": contentType,
                "Content-Length": Buffer.byteLength(data, 'utf-8')
            }
            break;
        case "put":
            data = JSON.stringify(data);
            headers = {
                "Content-Type": contentType,
                "Content-Length": Buffer.byteLength(data, 'utf-8')
            }
            break;
        case "delete":
            data = JSON.stringify(data);
            headers = {
                "Content-Type": contentType,
                "Content-Length": Buffer.byteLength(data, 'utf-8')
            }
            break;
        default:
            data = querystring.stringify(data);
            path = path + '?' + data;
            headers = {
                "Content-Type": contentType,
                "Content-Length": Buffer.byteLength(data, 'utf-8')
            }
            break;
    }
    var opt = {
        host: host,
        method: method,
        path: path,
        headers: headers
    },
        fnReq = eval(type + ".request");
    if (port) {
        opt.port = port;
    }
    var req = fnReq(opt, function (resHttp) {
        var body = "";
        resHttp.on('data', function (data) {
            body += data;
        }).on('end', function () {
            if (resHttp.statusCode == 200) {
                try {
                    const json = JSON.parse(body);
                    cbEnd(json);
                } catch (e) {
                    cbEnd(body);
                }
            } else {
                try {
                    const json = JSON.parse(body);
                    if (json.error && json.error.code) {
                        cbEnd(json);
                    } else {
                        logger.error('request not 200 but no error or errorCode with: ' + body);
                        cbError(resHttp.statusCode, body);
                    }
                } catch (e) {
                    logger.error('request not 200 and format json error with: ' + body);
                    cbError(resHttp.statusCode, body);
                }
            }
        });
    }).on('error', function (err) {
        logger.error('request error with: ' + err);
    });
    req.write(data);
    req.end();
}

exports.uploadFiles = function (files, data, type, host, port, path, method, cbEnd, cbError) {
    var boundaryKey = '----' + new Date().getTime();
    var headers = {
        "Content-Type": 'multipart/form-data; boundary=' + boundaryKey,
        'Connection': 'keep-alive'
    }
    var opt = {
        host: host,
        method: method,
        path: path,
        headers: headers
    },
        fnReq = eval(type + ".request");
    if (port) {
        opt.port = port;
    }
    var req = fnReq(opt, function (resHttp) {
        resHttp.setEncoding('utf8');
        var body = "";
        resHttp.on('data', function (data) {
            body += data;
        }).on('end', function () {
            if (resHttp.statusCode == 200) {
                cbEnd(body);
            } else {
                logger.error('problem with request: ' + body);
                cbError(resHttp.statusCode, body);
            }
        });
    }).on('error', function (err) {
        logger.error('problem with request: ' + err);
    });
    (function next(i, length) {
        if (i < length) {
            req.write(
                '--' + boundaryKey + '\r\n' +
                'Content-Disposition: form-data; name="file"; filename="' + files[i].originalname + '"\r\n' +
                'Content-Type: ' + files[i].mimetype + '\r\n\r\n'
            );
            var fileStream = fs.createReadStream(files[i].path);
            fileStream.pipe(req, {
                end: false
            });
            fileStream.on('end', function () {
                fs.unlink(files[i].path);
                req.write('\r\n')
                next(++i, length);
            });
        } else {
            if (data) {
                for (var i in data) {
                    req.write(
                        '--' + boundaryKey + '\r\n' +
                        'Content-Disposition: form-data; name="' + i + '"\r\n\r\n' +
                        data[i]
                    );
                }
                req.end('\r\n--' + boundaryKey + '-–');
            } else {
                req.end('\r\n--' + boundaryKey + '-–');
            }
        }
    })(0, files.length);
}