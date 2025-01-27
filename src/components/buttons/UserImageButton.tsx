import React from 'react';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {sizeConverter} from '../../utils';
import FastImage from 'react-native-fast-image';
import {IconUser} from '../icons';
import {useThemeStore} from '../../stores';

type ImageProps = {
  url?: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  size?: number;
  onPress?: () => void;
};

const UserImageButton: React.FC<ImageProps> = ({
  style,
  size,
  containerStyle,
  url,
  onPress,
}) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: size || sizeConverter(120),
      justifyContent: 'center',
      paddingHorizontal: sizeConverter(20),
      width: size || sizeConverter(120),
    },
    image: {},
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle]}>
      {url ? (
        <FastImage style={[styles.image, style]} />
      ) : (
        <DefaultUserIcon size={size} />
      )}
    </TouchableOpacity>
  );
};

const DefaultUserIcon: React.FC<{size?: number}> = ({size}) => {
  const {selectedTheme} = useThemeStore();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: selectedTheme.textColor,
      borderRadius: sizeConverter(60),
      borderWidth: sizeConverter(1),
      height: size || sizeConverter(120),
      justifyContent: 'center',
      paddingHorizontal: sizeConverter(20),
      width: size || sizeConverter(120),
    },
    image: {
      color: selectedTheme.backgourndColor,
    },
  });
  return (
    <View style={styles.container}>
      <IconUser size={sizeConverter(60)} style={styles.image} />
    </View>
  );
};

export default UserImageButton;
