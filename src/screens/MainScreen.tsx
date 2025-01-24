import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThemeStore from '../stores/useThemeStore';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import themes from '../styles/themes';
import {useTextStyles} from '../styles';

const MainScreen = () => {
  const {selectedTheme, selectTheme} = useThemeStore();

  const onPress = () => {
    if (selectedTheme === themes.darkTheme) {
      selectTheme(themes.lightTheme);
      return;
    }
    selectTheme(themes.darkTheme);
  };

  const {font16Bold} = useTextStyles();

  return (
    <SafeAreaView style={{backgroundColor: selectedTheme.backgourndColor}}>
      <TouchableOpacity onPress={onPress}>
        <Text style={font16Bold}>안녕하세요!!</Text>
        <Text>안녕하세요!!</Text>
        <FontAwesome6 name='gear' iconStyle='solid' />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MainScreen;
