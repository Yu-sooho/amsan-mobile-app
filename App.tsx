import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {RootStackNavigator} from './src';
import {
  STORE_COUNT,
  useAppStateStore,
  useAuthStore,
  useLanguageStore,
  useThemeStore,
} from './src/stores';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Toast, {ToastConfigParams} from 'react-native-toast-message';
import {sizeConverter} from './src/utils';
import {LoadingScreen} from './src/screens';
import {useTextStyles} from './src/styles';
import mobileAds from 'react-native-google-mobile-ads';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {
  AppStateChecker,
  BannerAds,
  InterstitialAds,
  OnMessage,
} from './src/components';
import NetInfo from '@react-native-community/netinfo';
import * as RNLocalize from 'react-native-localize';
import {language} from './src/resources';

function App(): React.JSX.Element {
  const {selectedTheme} = useThemeStore();
  const {font14Bold, font20Bold} = useTextStyles();
  const {selectedLanguage, selectLanguage} = useLanguageStore();
  const {isLoading, isFirstStart, setIsFirstStart, hydratedStores} =
    useAppStateStore();
  const {setIsLogin, setLoginData, postUser, getUser, setUserInfo} =
    useAuthStore();
  const [initializing, setInitializing] = useState(true);
  const [isConnectedNetwork, setIsConnectedNetwork] = useState<boolean | null>(
    true,
  );

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    noNetworkView: {
      alignItems: 'center',
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
      justifyContent: 'center',
    },
    text: {
      ...font20Bold,
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
  const lastUserRef = useRef<FirebaseAuthTypes.User | null>(null);

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    if (lastUserRef.current && lastUserRef.current.uid === user?.uid) {
      return;
    }
    lastUserRef.current = user;
    if (!user) {
      setIsLogin(false);
    }
    if (user) {
      setIsLogin(true);
      setLoginData(user);
      await postUser(user);
      await fetchUserData(user);
      console.log('login user:', user);
    }
    if (Platform.OS === 'ios') await transparencyCheck();
    if (initializing) setInitializing(false);
  };

  const getCountryCode = () => {
    if (isFirstStart) {
      if (selectedLanguage.id === language.kor.id) selectLanguage(language.kor);
      if (selectedLanguage.id === language.eng.id) selectLanguage(language.eng);
      console.log('language setting : ', selectedLanguage.id);
      return;
    }
    const country = RNLocalize.getCountry();
    if (country === 'KR') {
      selectLanguage(language.kor);
    } else {
      selectLanguage(language.eng);
    }
    console.log('login country:', country);
    setIsFirstStart(true);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnectedNetwork(state.isConnected);
    });

    return () => {
      subscriber();
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (hydratedStores.length === STORE_COUNT) {
      console.log('hydratedStores:', hydratedStores);
      getCountryCode();
    }
  }, [hydratedStores]);

  const toastConfig = {
    customToast: ({props}: ToastConfigParams<{text: string}>) => (
      <View style={styles.toast}>
        <Text style={styles.toastText}>{props.text}</Text>
      </View>
    ),
  };

  if (initializing || hydratedStores.length !== STORE_COUNT) {
    return (
      <View style={{backgroundColor: selectedTheme.backgourndColor, flex: 1}} />
    );
  }

  if (!isConnectedNetwork) {
    return (
      <View style={styles.noNetworkView}>
        <Text style={styles.text}>{selectedLanguage.noNetwork}</Text>
      </View>
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
      <OnMessage initializing={initializing} />
      <Toast config={toastConfig} />
      {isLoading && <LoadingScreen />}
    </>
  );
}

export default App;
