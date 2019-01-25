const express = require('express');
const ConnectCas = require('connect-cas2');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MemoryStore = require('session-memory-store')(session);
const short = require('short-uuid');
const translator = short();
const path = require('path');
const config = require('../conf/config.js');
const utils = require('./common/utils');
const httpAgent = require('./common/httpAgent.js');
const log4js = require('log4js');
const logger = log4js.getLogger();
const csrf = require('csurf');
var outTradeId = Date.now().toString();

var crypto = require("crypto");
var Buffer = require("buffer").Buffer;
md5 = function (data, codeBase) { //MD5加密
  var buf = typeof data == "string" ? codeBase == 'gbk' ? iconv.encode(data, 'gbk') : new Buffer(data) : data;
  var str = buf.toString("binary");
  return crypto.createHash("md5").update(str).digest("hex");
}


log4js.configure({
  appenders: {
    dateFile: {
      type: 'dateFile',
      filename: config.LOGGER_PATH + "/logger",
      "pattern": "-yyyy-MM-dd.log",
      alwaysIncludePattern: true
    },
    out: {
      type: 'stdout'
    }
  },
  categories: {
    default: {
      appenders: ['dateFile', 'out'],
      level: 'debug'
    }
  }
});

const app = express();

//cross-domain 
const cors = require('cors')
app.use(cors())

app.use(cookieParser());
app.use(session({
  name: 'NSESSIONID',
  secret: 'Hello I am a long long long secret',
  store: new MemoryStore(), // or other session store
}));

// app.use((req, res, next) => {
//   req.sn = translator.uuid();
//   next();
// });


// app.use(csrf({ cookie: true }));

//check and save session
// app.use(function (req, res, next) {
//   let csrf = req.csrfToken();
//   res.cookie('XSRF-TOKEN', csrf);
//   next();
// })


// NOTICE: If you want to enable single sign logout, you must use casClient middleware before bodyParser.
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// 配置favicon
// var favicon = require('serve-favicon');
// app.use(favicon(__dirname + '/favicon.ico'));

app.use(express.static(path.resolve(__dirname + '/../dist')));
app.use('/static', express.static(path.resolve(__dirname + '/static')));

// or do some logic yourself
app.use('/', require("./controllers/index.js"));
app.use('/user', require("./controllers/user.js"));
app.use('/product', require("./controllers/product.js"));
app.use('/shop', require("./controllers/shop.js"));
app.use('/admin', require("./controllers/admin.js"));

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
});

const port = process.env.PORT || 8082;

app.listen(port, () => {
  logger.info('app listening on', port);
});

process.on('uncaughtException', function (err) {
  logger.error('An uncaught error occurred! ', err);
});