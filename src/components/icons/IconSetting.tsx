import React from 'react';
import Feather from '@react-native-vector-icons/feather';
import {useThemeStore} from '../../stores';
import {sizeConverter} from '../../utils';

const IconSetting = () => {
  const {selectedTheme} = useThemeStore();
  return (
    <Feather
      name={'settings'}
      color={selectedTheme.textColor}
      size={sizeConverter(20)}
    />
  );
};

export default IconSetting;
