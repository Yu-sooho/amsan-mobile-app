import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackNavigator} from './src';
import {useAuthStore, useThemeStore} from './src/stores';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast, {ToastConfigParams} from 'react-native-toast-message';
import {sizeConverter} from './src/utils';

function App(): React.JSX.Element {
  const {selectedTheme} = useThemeStore();
  const {setIsLogin} = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    toast: {
      backgroundColor: selectedTheme.backgourndColor,
      color: selectedTheme.textColor,
      height: sizeConverter(60),
      width: sizeConverter(300),
    },
  });

  GoogleSignin.configure({
    webClientId:
      '789977705445-kp6sajh0cr8ijurbtfenjbeer3l7r4m9.apps.googleusercontent.com',
    offlineAccess: true,
  });

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const toastConfig = {
    customToast: ({props}: ToastConfigParams<{text: string}>) => (
      <View style={styles.toast}>
        <Text>{props.text}</Text>
      </View>
    ),
  };

  // if (initializing) return <View style={{backgroundColor: 'red', flex: 1}} />;

  return (
    <>
      <View style={styles.container}>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </View>
      <Toast config={toastConfig} />
    </>
  );
}

export default App;
