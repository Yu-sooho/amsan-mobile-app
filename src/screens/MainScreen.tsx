import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThemeStore from '../stores/useThemeStore';
import themes from '../resources/themes';

const MainScreen = () => {
  const {selectedTheme, selectTheme} = useThemeStore();

  const onPress = () => {
    if (selectedTheme === themes.darkTheme) {
      selectTheme(themes.lightTheme);
      return;
    }
    selectTheme(themes.darkTheme);
  };

  return (
    <SafeAreaView style={{backgroundColor: selectedTheme.backgourndColor}}>
      <TouchableOpacity onPress={onPress}>
        <Text style={{color: selectedTheme.textColor}}>123</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MainScreen;
