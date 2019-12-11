/**
 * User: puti.
 * Time: 2019-12-11 14:29.
 */
import React from 'react';
import {Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Zocial from 'react-native-vector-icons/Zocial';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export default function Icon(props: {
  icon: string | number,
  size: number,
  color?: string,
}) {
  const {icon, size, style = {}, color} = props;
  if (typeof icon === 'string') {
    const [_one, _two] = icon.split('/');
    let fontFamily, name, FontIcon;
    if (!_two) {
      fontFamily = 'AntDesign';
      name = _one;
    } else {
      fontFamily = _one;
      name = _two;
    }
    switch (fontFamily) {
      case 'AntDesign':
        FontIcon = AntDesign;
        break;
      case 'Entypo':
        FontIcon = Entypo;
        break;
      case 'EvilIcons':
        FontIcon = EvilIcons;
        break;
      case 'FontAwesome':
        FontIcon = FontAwesome;
        break;
      case 'Feather':
        FontIcon = Feather;
        break;
      case 'FontAwesome5':
        FontIcon = FontAwesome5;
        break;
      case 'Fontisto':
        FontIcon = Fontisto;
        break;
      case 'Foundation':
        FontIcon = Foundation;
        break;
      case 'Ionicons':
        FontIcon = Ionicons;
        break;
      case 'MaterialIcons':
        FontIcon = MaterialIcons;
        break;
      case 'MaterialCommunityIcons':
        FontIcon = MaterialCommunityIcons;
        break;
      case 'Octicons':
        FontIcon = Octicons;
        break;
      case 'Zocial':
        FontIcon = Zocial;
        break;
      case 'SimpleLineIcons':
        FontIcon = SimpleLineIcons;
        break;
    }
    return <FontIcon {...props} name={name} size={size} />;
  }
  if (size) {
    style.width = size;
    style.height = size;
  }
  if (color) {
    style.tintColor = color;
  }
  return <Image {...props} style={style} source={icon} />;
}
