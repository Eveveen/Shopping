// uc api
exports.BACKEND_API = {
    TYPE: 'http',
    HOST: 'localhost',
    PORT: '7777'
};
// base url, the same as nginx
exports.BASE_URL = '';
// this service url
exports.SERVICE_URL = 'http://localhost:8082' + this.BASE_URL;
// cas url
exports.CAS_URL = 'https://sso.amsqa.com/cas';
// logger path
exports.LOGGER_PATH = '/tmp/uc-ui';