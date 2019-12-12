/**
 * User: puti.
 * Time: 2018/12/6 1:47 PM.
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Overlay} from 'teaset';
import {theme} from '../../config/theme';

const {width, height} = Dimensions.get('window');

export function SelectView(props) {
  const {
    items = [],
    title = '标题',
    onClose,
    onSelected,
    modal,
    getItemText,
    getItemDetail,
    index,
  } = props;
  const [selectedIndex, setSelectedIndex] = useState(index);
  return (
    <Overlay.PopView
      containerStyle={{
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      overlayOpacity={0.7}
      onCloseRequest={onClose}
      modal={modal}>
      <View style={styles.container}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        <ScrollView style={{flex: 1, width: '100%'}}>
          {items.map((item, i) => (
            <SelectItem
              key={item + i}
              value={item}
              getItemText={getItemText}
              getItemDetail={getItemDetail}
              selected={selectedIndex === i}
              onPress={() => {
                onSelected && onSelected(item, i);
                setSelectedIndex(i);
              }}
            />
          ))}
        </ScrollView>
      </View>
    </Overlay.PopView>
  );
}

const SelectItem = ({selected, value, onPress, getItemText, getItemDetail}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        height: px2dp(90),
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: px2dp(20),
        backgroundColor: selected ? theme.backgroundColor : 'white',
        borderBottomColor: theme.borderColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
      onPress={onPress}>
      <Text style={styles.text}>
        {getItemText ? getItemText(value) : value}
      </Text>
      {!!getItemDetail && (
        <Text style={styles.detail}>{getItemDetail(value)}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: px2dp(650),
    minHeight: px2dp(550),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px2dp(8),
    paddingBottom: px2dp(20),
  },
  title: {
    fontSize: 17,
    marginVertical: px2dp(20),
    fontWeight: 'bold',
    color: 'black',
  },
  text: {
    color: '#999',
    fontSize: 14,
    flex: 1,
  },
  detail: {
    color: '#aaa',
    maxWidth: '50%',
    textAlign: 'right',
    fontSize: 12,
  },
});
