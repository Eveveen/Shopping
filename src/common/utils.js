import axios from 'axios';
import { SERVICE_URL } from '../../conf/config';

export const httpRequestGet = (path, cbEnd, cbError) => {
    axios.get(path)
        .then(response => {
            const resData = response.data;
            if (!resData.error) {
                cbEnd(resData);
            } else {
                if (resData.error.code == -1) {
                    cbError("");
                } else {
                    cbError(resData.error);
                }
            }
        })
        .catch(error => {
            const resError = error.response;
            if (resError && resError.status == 403) {
                location.href = SERVICE_URL;
            }
            console.log(error);
        });
}

export const httpRequestPost = (path, data, cbEnd, cbError) => {
    axios.post(path, data)
        .then(response => {
            const resData = response.data;
            if (!resData.error) {
                cbEnd(resData);
            } else {
                if (resData.error.code == -1) {
                    cbError("");
                } else {
                    cbError(resData.error);
                }
            }
        })
        .catch(error => {
            const resError = error.response;
            if (resError && resError.status == 403) {
                location.href = SERVICE_URL;
            }
            console.log(error);
        });
}