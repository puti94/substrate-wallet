/**
 * @flow
 */
import React, {Component, useEffect} from 'react';
import {View, StyleSheet, StatusBar, Platform} from 'react-native';
import NavBar, {Props as NavBarProps} from './NavBar';
import {theme} from '../config/theme';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = {
  fitIPhoneX?: boolean,
  navBar?: null | Component,
  contentContainerStyle?: any,
  useScrollView?: boolean,
} & NavBarProps;

function BaseContainer(props: Props) {
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, []);
  const {style, ...otherProps} = props;
  return (
    <View style={[styles.container, style]}>
      <NavView {...otherProps} />
      <Content {...otherProps} />
    </View>
  );
}

function Content(props) {
  const {children, useScrollView, contentContainerStyle, fitIPhoneX} = props;
  const Contain = useScrollView ? KeyboardAwareScrollView : View;
  let containProps = {};
  if (useScrollView) {
    containProps.style = {flex: 1};
    containProps.contentContainerStyle = {
      paddingBottom: px2dp(60) + theme.bottomHeight,
      ...contentContainerStyle,
    };
  } else {
    containProps.style = [
      {flex: 1, paddingBottom: fitIPhoneX ? theme.bottomHeight : 0},
      contentContainerStyle,
    ];
  }
  return <Contain {...containProps}>{children}</Contain>;
}

function NavView(props) {
  const {navBar, ...navProps} = props;
  let navView = null;
  if (typeof navBar === 'undefined') {
    navView = <NavBar {...navProps} />;
  } else {
    navView = navBar;
  }
  return navView;
}

export default BaseContainer;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.backgroundColor},
});
