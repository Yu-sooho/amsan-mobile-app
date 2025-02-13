import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {useTextStyles} from '../../styles';
import {sizeConverter} from '../../utils';
import {useThemeStore} from '../../stores';

interface CustomSwitch {
  onPress: () => void;
  value: boolean;
  size?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

interface SwitchButtonProps extends CustomSwitch {
  text: string;
}

const CustomSwitch: React.FC<CustomSwitch> = ({
  value,
  onPress,
  size = sizeConverter(16),
}) => {
  const {selectedTheme} = useThemeStore();
  const styles = StyleSheet.create({
    circle: {
      backgroundColor: selectedTheme.textColor,
      borderRadius: sizeConverter(12),
      elevation: 4,
      height: size,
      shadowColor: selectedTheme.backgourndColor,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      width: size,
    },
    container: {
      borderRadius: 16,
      height: size + sizeConverter(6),
      justifyContent: 'center',
      padding: 3,
      width: size * 2 + sizeConverter(6),
    },
    containerOff: {
      backgroundColor: selectedTheme.switchFalse,
    },
    containerOn: {
      backgroundColor: selectedTheme.switchTrue,
    },
  });

  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const animatedValueMin = sizeConverter(2);
  const animatedValueMax = size - sizeConverter(2);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [animatedValueMin, animatedValueMax],
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        styles.container,
        value ? styles.containerOn : styles.containerOff,
      ]}
      onPress={onPress}>
      <Animated.View style={[styles.circle, {transform: [{translateX}]}]} />
    </TouchableOpacity>
  );
};

const SwitchButton: React.FC<SwitchButtonProps> = ({
  onPress,
  text,
  value,
  contentContainerStyle,
}) => {
  const textStyles = useTextStyles();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      height: sizeConverter(44),
      justifyContent: 'space-between',
      paddingHorizontal: sizeConverter(20),
      width: Dimensions.get('window').width,
    },
    text: {
      ...textStyles.font16Bold,
    },
  });
  return (
    <TouchableOpacity
      style={[styles.container, contentContainerStyle]}
      onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
      <View pointerEvents='none'>
        <CustomSwitch value={value} onPress={onPress} />
      </View>
    </TouchableOpacity>
  );
};

export default SwitchButton;
