import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {sizeConverter} from '../../utils';
import {useTextStyles} from '../../styles';
import {useThemeStore} from '../../stores';

type ButtonProps = {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  Icon: JSX.Element;
};

const PlayButton: React.FC<ButtonProps> = ({text, style, onPress, Icon}) => {
  const {selectedTheme} = useThemeStore();
  const textStyles = useTextStyles();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: selectedTheme.backgourndColor,
      borderRadius: sizeConverter(12),
      elevation: 5,
      flexDirection: 'row',
      height: sizeConverter(44),
      justifyContent: 'space-between',
      paddingLeft: sizeConverter(12),
      paddingRight: sizeConverter(20),
      shadowColor: selectedTheme.textColor,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.4,
      shadowRadius: 4,
      width: sizeConverter(320),
    },
    text: {
      ...textStyles.font16Bold,
    },
  });
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {Icon}
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default PlayButton;
