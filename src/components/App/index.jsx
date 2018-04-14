import React, { Component } from 'react';
import intl from 'react-intl-universal';

import '../../../node_modules/liveramp-ui-toolkit/vendor/css/react-select.min.css';
import '../../../node_modules/liveramp-ui-toolkit/sass/ui_toolkit.sass';
import '../../../node_modules/liveramp-ui-toolkit/docs.sass';
import 'antd/dist/antd.css';
import './app.sass'
import './overwrite.sass'
import './overwrite-antd.css'

// locale data
const locales = {
    "en_US": require('../../locale/en_US.json'),
    "zh_CN": require('../../locale/zh_CN.json'),
};

class App extends Component {
    state = { initDone: false };

    getCookie = (name) => {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }


    componentDidMount() {
        var coolieLocale = this.getCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE");
        var language = coolieLocale ? coolieLocale : "en_US";
        this.loadLocales(language);
    }

    loadLocales(locale) {
        // init method will load CLDR locale data according to currentLocale
        // react-intl-universal is singleton, so you should init it only once in your app
        intl.init({
            currentLocale: locale, // TODO: determine locale here
            locales,
        })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({ initDone: true });
            });
    }

    render() {
        return (
            this.state.initDone &&
            <div className="ui-content">
                {this.props.children}
            </div>
        );
    }
}

export default App;