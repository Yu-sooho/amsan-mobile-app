import React from 'react';
import Feather from '@react-native-vector-icons/feather';
import {useThemeStore} from '../../stores';
import {sizeConverter} from '../../utils';
import {StyleProp, TextStyle} from 'react-native';

type IconProps = {
  style?: StyleProp<TextStyle>;
  size?: number;
  isActive?: boolean;
};

const IconBell: React.FC<IconProps> = ({
  style,
  size = sizeConverter(34),
  isActive = true,
}) => {
  const {selectedTheme} = useThemeStore();
  return (
    <Feather
      style={style}
      name={isActive ? 'bell' : 'bell-off'}
      color={selectedTheme.textColor}
      size={size}
    />
  );
};

export default IconBell;
