import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
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
import {AppStateChecker, BannerAds, InterstitialAds} from './src/components';
import messaging from '@react-native-firebase/messaging';

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
    if (!user) {
      setIsLogin(false);
    }
    if (initializing) setInitializing(false);
    if (user) {
      setIsLogin(true);
      setLoginData(user);
      await postUser(user);
      await fetchUserData(user);
      console.log('login user:', user);
    }
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    transparencyCheck();

    return () => {
      subscriber();
    };
  }, []);

  const toastConfig = {
    customToast: ({props}: ToastConfigParams<{text: string}>) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{props.text}</Text>
      </View>
    ),
  };

  if (initializing) {
    return (
      <View style={{backgroundColor: selectedTheme.backgourndColor, flex: 1}} />
    );
  }

  return (
    <>
      <View style={styles.container}>
        <NavigationContainer>
          <RootStackNavigator />
        </NavigationContainer>
      </View>
      <BannerAds />
      <InterstitialAds />
      <AppStateChecker />
      {Platform.OS === 'android' ? <PermissionAndroid /> : <PermissionIos />}
      {isLoading && <LoadingScreen />}
      <Toast config={toastConfig} />
    </>
  );
}

const PermissionIos = () => {
  const requestMessage = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const checkApplicationPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      requestMessage();
    } else {
      requestMessage();
    }
  };

  useEffect(() => {
    checkApplicationPermission();
  }, []);

  return null;
};

const PermissionAndroid = () => {
  return null;
};

export default App;
