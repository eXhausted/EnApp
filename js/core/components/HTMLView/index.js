import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Linking, WebView } from 'react-native';
import { Spinner } from 'native-base';
import Helper from '../../../util/helper';
import Colors from '../../../constants/colors';

@observer
class HTMLView extends Component {

    state = {
        webViewHeight: 1,
    };

    componentWillReceiveProps(nextProps) {
        this.injectHTML(nextProps.html, nextProps.shouldReplaceNlToBr);
    }

    onMessage(data) {
        if (data.type === 'viewHeight') {
            this.setState({
                webViewHeight: data.data,
            });
        }
    }

    injectHTML(html, shouldReplaceNlToBr) {
        this.webView.postMessage(JSON.stringify({
            type: 'setHTML',
            data: Helper.normalizeHTML(html, shouldReplaceNlToBr),
        }));
    }

    render() {
        return (
            <WebView
              ref={(view) => { this.webView = view; }}
              source={{ uri: 'file:///android_asset/HTMLView/defaultHTML.html' }}
              automaticallyAdjustContentInsets={false}
              renderLoading={() => <Spinner color="blue" />}
              onLoadEnd={() => { this.injectHTML(this.props.html, this.props.shouldReplaceNlToBr); }}
              javaScriptEnable
              startInLoadingState
              onNavigationStateChange={(event) => {
                  const protocol = event.url.split('://')[0];

                  if (protocol !== 'file') {
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
              }}
              style={{ height: this.state.webViewHeight, backgroundColor: Colors.background }}
            />
        );
    }
}

HTMLView.defaultProps = {
    shouldReplaceNlToBr: true,
};

export default HTMLView;
