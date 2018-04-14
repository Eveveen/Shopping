import intl from 'react-intl-universal';

export const thousands_format = (num) => {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
export const guid = () => {
    let S4 = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}

// charge object is in arr
export const contains = (arr, obj) => {
    if (arr) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
    }
    return false;
}

// remove object from arr
export const remove = (arr, obj) => {
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == obj) {
                arr.splice(i, 1);
                break;
            }
        }
    }
    return arr;
}

export const getCookie = (name) => {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

export const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

// get error message
export const messageText = (code, msg) => {
    let codeMsg = code && code != "" ? intl.get(code) : "";
    msg = codeMsg && codeMsg != "" ? codeMsg : msg;
    return msg;
}

export const datacache = {};