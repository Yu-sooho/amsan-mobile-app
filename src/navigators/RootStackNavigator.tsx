// In App.js in a new project

import * as React from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import {
  FontSizeScreen,
  HistoryScreen,
  LanguageScreen,
  LoginScreen,
  MainScreen,
  MyInfoScreen,
  PlayScreen,
  RankingScreen,
  ResultScreen,
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
    PlayScreen: PlayScreen,
    MyInfoScreen: MyInfoScreen,
    LoginScreen: LoginScreen,
    ResultScreen: ResultScreen,
    HistoryScreen: HistoryScreen,
    RankingScreen: RankingScreen,
  },
});

const RootStackNavigator = () => {
  const screenOptionsDefault: StackNavigationOptions = {
    headerShown: false,
    gestureEnabled: true,
    ...TransitionPresets.SlideFromRightIOS,
  };
  const screenOptionsLeft: StackNavigationOptions = {
    headerShown: false,
    gestureEnabled: true,
    ...TransitionPresets.SlideFromLeftIOS,
  };

  return (
    <RootStack.Navigator
      initialRouteName='MainScreen'
      screenOptions={() => screenOptionsDefault}>
      <RootStack.Screen name='MainScreen' component={MainScreen} />

      {/* 설정 화면들 */}
      <RootStack.Screen name='SettingScreen' component={SettingScreen} />
      <RootStack.Screen name='ThemeScreen' component={ThemeScreen} />
      <RootStack.Screen name='LanguageScreen' component={LanguageScreen} />
      <RootStack.Screen name='FontSizeScreen' component={FontSizeScreen} />
      <RootStack.Screen name='RankingScreen' component={RankingScreen} />
      <RootStack.Screen name='HistoryScreen' component={HistoryScreen} />
      <RootStack.Screen
        name='PlayScreen'
        component={PlayScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <RootStack.Screen
        name='MyInfoScreen'
        component={MyInfoScreen}
        options={() => screenOptionsLeft}
      />
      <RootStack.Screen
        name='LoginScreen'
        component={LoginScreen}
        options={() => screenOptionsLeft}
      />
      <RootStack.Screen
        name='ResultScreen'
        component={ResultScreen}
        options={{
          gestureEnabled: false,
        }}
      />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
