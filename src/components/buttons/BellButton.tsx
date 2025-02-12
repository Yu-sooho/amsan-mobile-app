import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {IconBell} from '../icons';
import {sizeConverter} from '../../utils';
import {useAuthStore} from '../../stores';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../../types';

type BellButtonProps = {
  onPress?: () => void;
};

const BellButton: React.FC<BellButtonProps> = ({onPress}) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'MainScreen'>>();
  const {userInfo} = useAuthStore();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingRight: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  const onPressDefault = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (!userInfo?.isAgreeNotification1) {
      navigation.navigate('AlramScreen');
      return;
    }
    navigation.navigate('AlramListScreen');
  };

  return (
    <TouchableOpacity onPress={onPressDefault} style={styles.container}>
      <IconBell
        size={sizeConverter(24)}
        isActive={userInfo?.isAgreeNotification1 || false}
      />
    </TouchableOpacity>
  );
};

export default BellButton;
