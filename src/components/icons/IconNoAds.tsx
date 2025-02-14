import React from 'react';
import FontAwesome from '@react-native-vector-icons/fontawesome6';
import {useThemeStore} from '../../stores';
import {sizeConverter} from '../../utils';
import {StyleProp, TextStyle} from 'react-native';

type IconProps = {
  style?: StyleProp<TextStyle>;
  size?: number;
};

const IconNoAds: React.FC<IconProps> = ({style, size = sizeConverter(20)}) => {
  const {selectedTheme} = useThemeStore();
  return (
    <FontAwesome
      iconStyle={'solid'}
      name='video-slash'
      style={style}
      color={selectedTheme.textColor}
      size={size}
    />
  );
};

export default IconNoAds;
