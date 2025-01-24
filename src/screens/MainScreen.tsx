import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThemeStore from '../stores/useThemeStore';
import themes from '../resources/themes';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Feather from '@react-native-vector-icons/feather';

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
        <FontAwesome6 name='gear' iconStyle='solid' />
        <Feather name={'gift'} color='#ff0000' size={20} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MainScreen;
