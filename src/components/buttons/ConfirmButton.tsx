import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTextStyles} from '../../styles';
import {useThemeStore} from '../../stores';
import {sizeConverter} from '../../utils';

type ButtonProps = {
  onPress: () => void;
  text: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

const ConfirmButton: React.FC<ButtonProps> = ({
  onPress,
  text,
  style,
  textStyle,
  disabled,
  contentContainerStyle,
}) => {
  const {font18Bold} = useTextStyles();
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: selectedTheme.backgourndColor,
      height: sizeConverter(44),
      justifyContent: 'center',
      width: sizeConverter(320),
    },
    text: {
      ...font18Bold,
      color: disabled
        ? selectedTheme.placeholderColor
        : selectedTheme.textColor,
      fontSize: sizeConverter(24),
    },
  });

  return (
    <View style={contentContainerStyle}>
      <TouchableOpacity
        disabled={disabled}
        style={[styles.container, style]}
        onPress={onPress}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmButton;
