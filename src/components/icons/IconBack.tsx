import React from 'react';
import Feather from '@react-native-vector-icons/feather';
import {useThemeStore} from '../../stores';
import {sizeConverter} from '../../utils';

const IconBack = () => {
  const {selectedTheme} = useThemeStore();
  return (
    <Feather
      name={'chevron-left'}
      color={selectedTheme.textColor}
      size={sizeConverter(32)}
    />
  );
};

export default IconBack;
