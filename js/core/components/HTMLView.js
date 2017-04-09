import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { Linking, View, WebView } from 'react-native';
import Helper from '../../util/helper';
import Colors from 'EnApp/js/constants/colors';

@observer
class HTMLView extends Component {

    state = {
        webViewHeight: 1,
    };

    getHTML(html) {
        return (`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font: 15px Verdana, Helvetica, sans-serif;
                            color: ${Colors.white};
                            background-color: ${Colors.background}
                        }
                        
                        a {
                            color:#86a486;
                            cursor: pointer;
                            text-decoration: underline;
                        }
                        
                        img {
                            max-width: 100vw;
                        }
                    </style>
                </head>
                <body>
                    <div id="wrapper">
                        ${html}
                    </div>
                    <script>
                    
                        function awaitPostMessage() {
                            var isReactNativePostMessageReady = !!window.originalPostMessage;
                            var queue = [];
                            var currentPostMessageFn = function store(message) {
                              if (queue.length > 100) queue.shift();
                              queue.push(message);
                            };
                            if (!isReactNativePostMessageReady) {
                              Object.defineProperty(window, 'postMessage', {
                                configurable: true,
                                enumerable: true,
                                get() {
                                  return currentPostMessageFn;
                                },
                                set(fn) {                               
                                  currentPostMessageFn = fn;
                                  isReactNativePostMessageReady = true;
                                  setTimeout(sendQueue, 0);
                                }
                              });
                            }
                        
                            function sendQueue() {
                              while (queue.length > 0) window.postMessage(queue.shift());
                            }
                        }
                        
                        awaitPostMessage();

                        function sendMessage(type, data) {
                            window.postMessage(JSON.stringify({
                                type: type,
                                data: data
                            }), "*");
                        };
                        
                        function sendContentHeight() {
                            sendMessage('viewHeight', document.querySelector('#wrapper').scrollHeight);
                        }
                                                
                        document.addEventListener('message', function(e) {
                            var data = JSON.parse(e.data);

                            if (data.type === 'setHTML') {
                                document.getElementById('wrapper').innerHTML = data.data;
                                sendContentHeight();
                                setInterval(function() {
                                    sendContentHeight()
                                }, 1000);
                            }
                        });
                    </script>
                </body>
            </html>
        `);
    }

    onMessage(data) {
        if (data.type === 'viewHeight') {
            this.setState({
                webViewHeight: data.data,
            });
        }
    }

    componentDidMount() {
        this.injectHTML(this.props.html, this.props.shouldReplaceNlToBr);
    }

    componentWillReceiveProps(nextProps) {
        this.injectHTML(nextProps.html, nextProps.shouldReplaceNlToBr);
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
              ref={view => this.webView = view}
              source={{
                  html: this.getHTML(''),
              }}
              onMessage={event => this.onMessage(JSON.parse(event.nativeEvent.data))}
              automaticallyAdjustContentInsets={false}
              javaScriptEnable
              onNavigationStateChange={(event) => {
                  Linking.canOpenURL(event.url).then((isCan) => {
                      if (isCan) {
                          this.webView.stopLoading();
                          Linking.openURL(event.url);
                      }
                  });
              }}
              style={{ height: this.state.webViewHeight }}
            />
        );
    }
}

HTMLView.defaultProps = {
    shouldReplaceNlToBr: true,
};

export default HTMLView;
