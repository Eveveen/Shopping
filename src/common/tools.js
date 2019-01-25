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

export const contains = (arr, obj) => {
    if (arr) {
        var i = arr.length;
        while (i--) {
            if (arr[i] == obj) {
                return true;
            }
        }
    }
    return false;
}

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

export const unique = (array) => {
    var r = [];
    for (var i = 0, l = array.length; i < l; i++) {
        for (var j = i + 1; j < l; j++)
            if (array[i] === array[j]) j = ++i;
        r.push(array[i]);
    }
    return r;
}

export const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// get error message
export const messageText = (code, msg) => {
    let codeMsg = code && code != "" ? intl.get(code) : "";
    msg = codeMsg && codeMsg != "" ? codeMsg : msg;
    return msg;
}


export const datacache = {};