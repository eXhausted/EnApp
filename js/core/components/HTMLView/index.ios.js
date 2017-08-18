import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Linking, WebView } from 'react-native';
import { Spinner } from 'native-base';
import parseUrl from 'parse-url';
import Helper from '../../../util/helper';
import Colors from '../../../constants/colors';

@observer
class HTMLView extends Component {
    state = {
        webViewHeight: 1,
    };

    // eslint-disable-next-line
    DEFAULT_HTML_URI = require('./defaultHTML.html');

    isStillOpeningCustomTub = false;

    componentWillReceiveProps(nextProps) {
        this.injectHTML(nextProps.html, nextProps.shouldReplaceNlToBr);
    }

    onMessage = (data) => {
        if (data.type === 'viewHeight') {
            this.setState({
                webViewHeight: data.data,
            });
        } else if (data.type === 'locationUrl') {
        // some debounce
            if (!this.isStillOpeningCustomTub) {
                this.isStillOpeningCustomTub = true;

                setTimeout(() => {
                    this.isStillOpeningCustomTub = false;
                }, 100);

                Helper.openCustomTab(data.data);
            }
        }
    };

    injectHTML = (html, shouldReplaceNlToBr) => {
        this.webView.postMessage(JSON.stringify({
            type: 'setHTML',
            data: Helper.normalizeHTML(html, shouldReplaceNlToBr),
        }));
    };

    onNavigationStateChange = (event) => {
        const parsedUrl = parseUrl(event.url);
        const splitedPathName = parsedUrl.pathname.split('/');

        console.log(Date.now());
        console.log('change');
        console.log(event);

        if (splitedPathName[splitedPathName.length - 1] !== 'defaultHTML.html') {
            Linking.canOpenURL(event.url).then((isCan) => {
                if (isCan) {
                    this.webView.stopLoading();
                    Linking.openURL(event.url);
                }
            });
        } else {
            try {
                const messageData = JSON.parse(event.title);
                this.onMessage(messageData);
            } catch (e) {

            }
        }
    };

    render() {
        return (
            <WebView
                ref={(view) => { this.webView = view; }}
                source={this.DEFAULT_HTML_URI}
                automaticallyAdjustContentInsets={false}
                renderLoading={() => <Spinner color={Colors.blue} />}
                onLoadEnd={() => { this.injectHTML(this.props.html, this.props.shouldReplaceNlToBr); }}
                javaScriptEnable
                startInLoadingState
                onNavigationStateChange={this.onNavigationStateChange}
                style={{ height: this.state.webViewHeight, backgroundColor: Colors.background }}
            />
        );
    }
}

HTMLView.defaultProps = {
    shouldReplaceNlToBr: true,
};

export default HTMLView;
