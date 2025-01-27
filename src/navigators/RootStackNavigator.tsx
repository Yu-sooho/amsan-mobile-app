// In App.js in a new project

import * as React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {
  FontSizeScreen,
  LanguageScreen,
  MainScreen,
  SettingScreen,
  ThemeScreen,
} from '../screens';
import {RootStackProps} from '../types/NavigationTypes';

const RootStack = createStackNavigator<RootStackProps>({
  screens: {
    MainScreen: MainScreen,
    SettingScreen: SettingScreen,
    ThemeScreen: ThemeScreen,
    LanguageScreen: LanguageScreen,
    FontSizeScreen: FontSizeScreen,
  },
});

const RootStackNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName='MainScreen'
      screenOptions={() => ({
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      })}>
      <RootStack.Screen name='MainScreen' component={MainScreen} />

      {/* 설정 화면들 */}
      <RootStack.Screen name='SettingScreen' component={SettingScreen} />
      <RootStack.Screen name='ThemeScreen' component={ThemeScreen} />
      <RootStack.Screen name='LanguageScreen' component={LanguageScreen} />
      <RootStack.Screen name='FontSizeScreen' component={FontSizeScreen} />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
