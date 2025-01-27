import React from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {IconNext} from '../icons';
import {sizeConverter} from '../../utils';
import {useTextStyles} from '../../styles';

type ButtonProps = {
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const ArrowButton: React.FC<ButtonProps> = ({text, style, onPress}) => {
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
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Text style={styles.text}>{text}</Text>
      <IconNext size={sizeConverter(22)} />
    </TouchableOpacity>
  );
};

export default ArrowButton;
