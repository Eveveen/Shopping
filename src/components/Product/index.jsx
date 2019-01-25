import React, { Component } from 'react';
import { Button, Input, Select, Upload, Modal, message, Icon, Form, Row, Col } from 'antd';
const FormItem = Form.Item;
import axios from 'axios';
import intl from 'react-intl-universal';
// import './Style/main.sass';
import HomePage from './homePage';
import { SERVICE_URL, BASE_URL } from '../../../conf/config';
const ColProps = {
    xs: 6,
    sm: 6,
}
class ProductIndex extends Component {
    constructor(props) {
        super(props)
        this.state = {
            city: ''
        }
    }
    componentWillMount() {
        var map = new BMap.Map("allmap");
        var point = new BMap.Point(116.331398, 39.897445);
        map.centerAndZoom(point, 12);

        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                console.log("r,", r.address.province);
                console.log("r,", r.address.city);
                // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
                //getPosition(r.point.lat, r.point.lng);
                axios.get("http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + r.point.lat + "," + r.point.lng + "&output=json&pois=1&ak=GVZwC3LiVb2DKqw5rRGrcUP97qj4cHYP")
                    .then(response => {
                        const resData = response.data;
                        if (response.status == 200 && !resData.error) {
                            console.log(resData.slice(0, 28));
                            console.log("post,", resData)
                            // console.log("post,", JSON.parse(resData))
                            console.log("post,", resData.formatted_address)
                            // console.log("post,", resData.RW.address.province)
                            // console.log("post,", resData.RW.address.city)
                        } else {
                            message.error("退出失败");
                        }
                    }).catch(error => {
                        console.log(error);
                        message.error("退出失败");
                    });
            }
            else {
                alert('failed' + this.getStatus());
            }
        }, { enableHighAccuracy: true })

    }
    componentDidMount() {


        // 获取地理位置
    }
    render() {
        return (
            <div>
                aa
            </div >
        )
    }
}

export default ProductIndex;