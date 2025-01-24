// In App.js in a new project

import * as React from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {MainScreen} from '../screens';

const RootStack = createStackNavigator({
  screens: {
    Home: HomeScreen,
    Profile: HomeScreen,
  },
});

function HomeScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
    </View>
  );
}

const RootStackNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName='MainScreen'
      screenOptions={() => ({
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      })}>
      <RootStack.Screen name='MainScreen' component={MainScreen} />
      <RootStack.Screen name='Profile' component={HomeScreen} />
    </RootStack.Navigator>
  );
};

export default RootStackNavigator;
