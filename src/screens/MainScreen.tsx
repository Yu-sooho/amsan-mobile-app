import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThemeStore from '../stores/useThemeStore';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import Feather from '@react-native-vector-icons/feather';
import themes from '../styles/themes';
import textStyles from '../styles/texts';

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
        <Text style={textStyles.defaultText}>안녕하세요!!</Text>
        <Text>안녕하세요!!</Text>
        <FontAwesome6 name='gear' iconStyle='solid' />
        <Feather name={'gift'} color='#ff0000' size={20} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MainScreen;
