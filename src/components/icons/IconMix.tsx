import React from 'react';
import Feather from '@react-native-vector-icons/feather';
import {useThemeStore} from '../../stores';
import {sizeConverter} from '../../utils';
import {StyleProp, StyleSheet, TextStyle, View} from 'react-native';

type IconProps = {
  style?: StyleProp<TextStyle>;
  size?: number;
};

const IconMix: React.FC<IconProps> = ({style, size = sizeConverter(10)}) => {
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
  });

  return (
    <View>
      <View style={styles.container}>
        <Feather
          style={style}
          name={'plus'}
          color={selectedTheme.textColor}
          size={size}
        />
        <Feather
          style={style}
          name={'x'}
          color={selectedTheme.textColor}
          size={size}
        />
      </View>
      <View style={styles.container}>
        <Feather
          style={style}
          name={'minus'}
          color={selectedTheme.textColor}
          size={size}
        />
        <Feather
          style={style}
          name={'divide'}
          color={selectedTheme.textColor}
          size={size}
        />
      </View>
    </View>
  );
};

export default IconMix;
