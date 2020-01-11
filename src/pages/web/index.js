/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {Platform, BackHandler, View, TouchableOpacity} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import LoadingView from '../../components/LoadingView';
import ErrorView from '../../components/ErrorView';
import WebView from 'react-native-webview';
import {RouteHelper} from 'react-navigation-easy-helper';
import Share from 'react-native-share';
import ProgressBar from './components/ProgressBar';
import {showActionSheet} from '../../utils/dialog';
import Icon from '../../components/Icon';

type Props = {
  url?: string,
  title?: string,
};

class WebPage extends Component<Props> {
  canGoBack = false;

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      errorMessage: '',
      source: {uri: props.url},
      title: props.title,
      firstLoading: true,
    };
  }

  onBackPressed = () => {
    if (this.canGoBack) {
      this.webView.goBack();
      return true;
    } else {
      return false;
    }
  };

  /**
   * 接收从HTML调用window.postMessage('')发来的参数
   * @param msg
   */
  onMessage = msg => {
    //Html传来的字符串
    let data = msg.nativeEvent.data;
    console.log('onMessage', data);
    if (data && data.startsWith('navigationStateChange')) {
      let s = data.substr('navigationStateChange'.length, 1);
      this.canGoBack = !['0', '1'].includes(s);
    }
  };

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onBackPressed);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPressed);
    }
  }

  onLoadStart = () => {
    console.log('onLoadStart');
    this.setState({
      isLoading: true,
    });
  };

  onLoadEnd = () => {
    console.log('onLoadEnd');
    this.setState({
      isLoading: false,
    });
  };

  onNavigationStateChange = navState => {
    console.log('onNavigationStateChange', navState);
    let title = this.state.title;
    if (navState.title && navState.title !== 'about:blank') {
      title = navState.title;
    }
    this.setState({title: title});
  };

  _injectVConsole() {
    this.callJs(this._injectedVConsoleCode());
  }

  /**
   * 调用Html的JS代码
   * @param js  js代码
   */
  callJs(js) {
    if (this.webView) {
      this.webView.injectJavaScript(js);
    }
  }

  /**
   * 添加VConsole的函数
   * @returns {string}
   * @private
   */
  _injectedVConsoleCode() {
    return `(function(){
        var hasVConsole = !!window.VConsole;
        if(hasVConsole)return;
        var timer;
        var script=document.createElement("script");
        script.src = "https://cdn.bootcss.com/vConsole/3.3.4/vconsole.min.js";
        var scriptNode = document.getElementsByTagName("script")[0];
        scriptNode.parentNode.insertBefore(script, scriptNode);
        function handler(){
         if(window.VConsole){
          window.vConsole = new window.VConsole();
          clearInterval(timer);
         }
        }
       timer = setInterval(handler,100);
       handler();
       true;
    })();
    true;
        `;
  }

  _injectHashUrlChangeCode() {
    return ` (function() {
      var number = 1;
      function wrap(fn) {
        return function wrapper() {
          var res = fn.apply(this, arguments);
          number ++;
          window.ReactNativeWebView.postMessage('navigationStateChange'+number);
          return res;
        }
      }

      history.pushState = wrap(history.pushState);
      window.addEventListener('popstate', function() {
        number -= 1;
        window.ReactNativeWebView.postMessage('navigationStateChange'+number);
      });
      true;
    })();
    true;
    `;
  }

  /**
   * 返回一个网页加载错误的视图
   * @returns {XML}
   */
  renderError = () => {
    return <ErrorView />;
  };

  render() {
    return (
      <BaseContainer
        leftView={
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                if (!this.onBackPressed()) {
                  RouteHelper.goBack();
                }
              }}>
              <Icon icon={'left'} size={px2dp(40)} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                RouteHelper.goBack();
              }}
              style={{marginLeft: px2dp(30)}}>
              <Icon icon={'close'} size={px2dp(40)} />
            </TouchableOpacity>
          </View>
        }
        rightIcon={'MaterialIcons/more-horiz'}
        rightPress={() => {
          let options = ['刷新', '调试', '分享', i18n('Base.Cancel')];
          showActionSheet({
            options: options,
            cancelButtonIndex: options.length - 1,
            onPress: index => {
              switch (index) {
                case 0:
                  this.webView.reload();
                  break;
                case 1:
                  this._injectVConsole();
                  break;
                case 2:
                  Share.open({url: this.props.url});
                  break;
                default:
                  break;
              }
            },
          });
        }}
        title={this.state.title}>
        <WebView
          originWhitelist={['*']}
          source={this.state.source}
          injectedJavaScript={this._injectHashUrlChangeCode()}
          ref={ref => (this.webView = ref)}
          style={{flex: 1, overflow: 'hidden', backgroundColor: '#0000'}}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          onNavigationStateChange={this.onNavigationStateChange}
          javaScriptEnabled={true}
          renderError={this.renderError}
          startInLoadingState={true}
          onMessage={this.onMessage}
        />
        {this.state.isLoading && <ProgressBar />}
      </BaseContainer>
    );
  }
}

export default WebPage;
