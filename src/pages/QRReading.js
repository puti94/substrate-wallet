import React, {Component} from 'react';
import {View} from 'react-native';
import QRScannerView, {BarcodeUtil} from 'react-native-smart-barcode';
import BaseContainer from '../components/BaseContainer';
import {checkPermission} from '../utils/PromiseUtils';
import {showAlert} from '../utils/dialog';

class QRReading extends Component {
  componentDidMount() {
    this.timeout = setTimeout(() => {
      this._barCode && this._barCode.startScan();
    }, 100);
  }

  componentWillUnmount() {
    try {
      clearTimeout(this.timeout);
      this._barCode && this._barCode.stopScan();
    } catch (e) {}
  }

  _chooseCodeInLib = async () => {
    try {
      await checkPermission({promise: 'photo'});
      const code = await BarcodeUtil.decodePictureFromPhotos();
      if (!code) {
        showAlert('未发现二维码');
        return;
      }
      this.barcodeReceived({data: code});
    } catch (e) {
      showAlert('未发现二维码');
    }
  };

  render() {
    return (
      <BaseContainer
        title={'扫码'}
        // navStyle={{backgroundColor: '#0000', position: 'absolute', top: 0}}
        rightTitle={'相册'}
        rightPress={this._chooseCodeInLib}>
        <View style={{flex: 1}}>
          <QRScannerView
            style={{flex: 1}}
            scannerRectCornerColor={'#ffffff'}
            scannerRectWidth={px2dp(486)}
            scannerRectHeight={px2dp(486)}
            ref={ref => (this._barCode = ref)}
            onBarCodeRead={e =>
              this.barcodeReceived({
                data: e.nativeEvent.data.code,
                type: e.nativeEvent.data.type,
              })
            }
          />
        </View>
      </BaseContainer>
    );
  }

  barcodeReceived = e => {
    const {success, navigation} = this.props;
    if (this.processing) {
      return;
    }
    this.processing = true;
    let {data} = e;
    success(data);
    navigation.goBack();
  };
}

export default QRReading;
