/**
 * User: puti.
 * Time: 2019-12-17 14:37.
 */
import React from 'react';
import {Text, Clipboard, StyleSheet} from 'react-native';
import BaseContainer from '../../components/BaseContainer';
import CopyText from '../../components/CopyText';
import CommonButton from '../../components/CommonButton';
import Toast from 'teaset/components/Toast/Toast';
import {theme} from '../../config/theme';

const ExportKeystore = ({json}) => {
  return (
    <BaseContainer useScrollView title={i18n('ExportKeystore.Title')}>
      <Text style={[styles.title, {marginTop: px2dp(100)}]}>
        {i18n('ExportKeystore.Title1')}
      </Text>
      <Text style={styles.content}>{i18n('ExportKeystore.Hint1')}</Text>
      <Text style={styles.title}>{i18n('ExportKeystore.Title2')}</Text>
      <Text style={styles.content}>{i18n('ExportKeystore.Hint2')}</Text>
      <Text style={styles.title}>{i18n('ExportKeystore.Title3')}</Text>
      <Text style={styles.content}>{i18n('ExportKeystore.Hint3')}</Text>
      <CopyText style={styles.keystore}>
        {JSON.stringify(json, null, 2)}
      </CopyText>
      <CommonButton
        title={i18n('ExportKeystore.Copy')}
        onPress={() => {
          Clipboard.setString(JSON.stringify(json));
          Toast.success(i18n('Base.CopySuccess'));
        }}
      />
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'flex-start',
    marginHorizontal: px2dp(45),
    color: theme.title,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: px2dp(17),
  },
  content: {
    alignSelf: 'flex-start',
    marginHorizontal: px2dp(45),
    color: theme.content,
    fontSize: 15,
    marginBottom: px2dp(39),
  },
  keystore: {
    backgroundColor: 'white',
    width: px2dp(660),
    alignSelf: 'center',
  },
});
export default ExportKeystore;
