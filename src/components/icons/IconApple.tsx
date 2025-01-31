import React from 'react';
import {sizeConverter} from '../../utils';
import {Image, ImageStyle, StyleProp, StyleSheet} from 'react-native';
import {images} from '../../resources';

type IconProps = {
  style?: StyleProp<ImageStyle>;
  size?: number;
};

const IconApple: React.FC<IconProps> = ({style, size = sizeConverter(24)}) => {
  const styles = StyleSheet.create({
    container: {
      height: size,
      width: size,
    },
  });
  return <Image style={[styles.container, style]} source={images.icon_apple} />;
};

export default IconApple;
