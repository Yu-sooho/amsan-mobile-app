import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {sizeConverter} from '../../utils';
import {useThemeStore} from '../../stores';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../../types';

const CustomModalScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'CustomPopupScreen'>>();
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      elevation: 5,
      marginTop: sizeConverter(240),
      minHeight: sizeConverter(300),
      shadowColor: selectedTheme.textColor,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.4,
      shadowRadius: 4,
      width: sizeConverter(320),
    },
  });

  const onPressBack = async () => {
    const isCanGoBack = await navigation.canGoBack();
    if (isCanGoBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        onPress={onPressBack}
        activeOpacity={1}
        style={{flex: 1}}>
        <View style={styles.container}>
          <Text>3212412</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomModalScreen;
