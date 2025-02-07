import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackNavigator} from './src';
import {useAppStateStore, useAuthStore, useThemeStore} from './src/stores';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast, {ToastConfigParams} from 'react-native-toast-message';
import {sizeConverter} from './src/utils';
import {LoadingScreen} from './src/screens';
import {useTextStyles} from './src/styles';
import mobileAds from 'react-native-google-mobile-ads';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {BannerAds} from './src/components';

function App(): React.JSX.Element {
  const {selectedTheme} = useThemeStore();
  const {font14Bold} = useTextStyles();
  const {isLoading} = useAppStateStore();
  const {setIsLogin, setLoginData, postUser, getUser, setUserInfo} =
    useAuthStore();
  const [initializing, setInitializing] = useState(true);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    toast: {
      alignItems: 'center',
      backgroundColor: selectedTheme.backgourndColor,
      borderRadius: sizeConverter(8),
      color: selectedTheme.textColor,
      elevation: 5,
      justifyContent: 'center',
      marginBottom: sizeConverter(24),
      minWidth: sizeConverter(220),
      paddingHorizontal: sizeConverter(24),
      paddingVertical: sizeConverter(12),
      shadowColor: selectedTheme.textColor,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.4,
      shadowRadius: 4,
    },
    toastText: {
      ...font14Bold,
    },
  });

  const transparencyCheck = async () => {
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    if (result === RESULTS.DENIED) {
      await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
    }

    const adapterStatuses = await mobileAds().initialize();
    console.log('ads init', adapterStatuses);
  };

  GoogleSignin.configure({
    webClientId:
      '789977705445-kp6sajh0cr8ijurbtfenjbeer3l7r4m9.apps.googleusercontent.com',
    offlineAccess: true,
  });

  const fetchUserData = async (user: FirebaseAuthTypes.User) => {
    if (!user) return;
    const result = await getUser(user);
    if (!result) return;
    setUserInfo(result);
  };

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      setIsLogin(true);
      setLoginData(user);
      await postUser(user);
      await fetchUserData(user);
      console.log('login user:', user);
    } else {
      setIsLogin(false);
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    transparencyCheck();
    return subscriber; // unsubscribe on unmount
  }, []);

  const toastConfig = {
    customToast: ({props}: ToastConfigParams<{text: string}>) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{props.text}</Text>
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
      <BannerAds />
      {isLoading && <LoadingScreen />}
      <Toast config={toastConfig} />
    </>
  );
}

export default App;
