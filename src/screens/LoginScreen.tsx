import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomHeader, IconApple, IconGoogle} from '../components';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  useAppStateStore,
  useAuthStore,
  useLanguageStore,
  useThemeStore,
} from '../stores';
import {
  appleAuthAndroid,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import {showToast, sizeConverter} from '../utils';
import themes from '../styles/themes';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types/NavigationTypes';

const LoginScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'MainScreen'>>();
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {isLogin} = useAuthStore();
  const {setIsLoading} = useAppStateStore();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: selectedTheme.textColor,
      height: sizeConverter(44),
      width: sizeConverter(320),
    },
    container: {
      alignItems: 'center',
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      paddingTop: sizeConverter(240),
    },
  });

  useEffect(() => {
    if (isLogin) {
      navigation.replace('MyInfoScreen');
    }
  }, [isLogin]);

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const signInResult = await GoogleSignin.signIn();
      if (!isSuccessResponse(signInResult)) {
        showToast({text: selectedLanguage.logintError});
        return;
      }

      const idToken = signInResult.data?.idToken;
      if (!idToken) {
        showToast({text: selectedLanguage.logintError});
        return;
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      setIsLoading(false);
    } catch (error) {
      console.log(`googleLogin error ${error}`);
      showToast({text: selectedLanguage.logintError});
      setIsLoading(false);
    }
  };

  const appleSignIn = async () => {
    setIsLoading(true);
    if (Platform.OS === 'android') {
      try {
        const rawNonce = uuid();
        const state = uuid();

        appleAuthAndroid.configure({
          clientId: 'com.amsan',
          redirectUri:
            'https://joyous-unexpected-enigmosaurus.glitch.me/callbacks/sign_in_with_apple',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state,
        });

        const response = await appleAuthAndroid.signIn();
        const {id_token, nonce} = response;
        if (!id_token) {
          showToast({text: selectedLanguage.logintError});
          setIsLoading(false);
          return;
        }

        const appleCredential = auth.AppleAuthProvider.credential(
          id_token,
          nonce,
        );
        await auth().signInWithCredential(appleCredential);
        setIsLoading(false);
      } catch (error) {
        console.log(`appleLogin error ${error}`);
        showToast({text: selectedLanguage.logintError});
        setIsLoading(false);
      }
      setIsLoading(false);
      return;
    }

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );
      await auth().signInWithCredential(appleCredential);
      setIsLoading(false);
    } catch (error) {
      console.log(`appleLogin error ${error}`);
      showToast({text: selectedLanguage.logintError});
      setIsLoading(false);
      return;
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader isHaveBack={true} isHaveOption={false} />
      <View style={styles.content}>
        <LoginButton
          image={<IconGoogle />}
          onPress={googleSignIn}
          text={'Sign in with Google'}
        />
        <LoginButton
          image={<IconApple />}
          onPress={appleSignIn}
          text={'Sign in with Apple'}
        />
      </View>
    </SafeAreaView>
  );
};

type LoginButtonProps = {
  onPress: () => void;
  image: JSX.Element;
  text: string;
};

const LoginButton: React.FC<LoginButtonProps> = ({onPress, image, text}) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: themes.lightTheme.backgourndColor,
      borderRadius: sizeConverter(12),
      flexDirection: 'row',
      height: sizeConverter(44),
      justifyContent: 'center',
      marginBottom: sizeConverter(12),
      width: sizeConverter(320),
    },
    image: {
      alignItems: 'flex-end',
      flex: 0.5,
    },
    text: {
      color: themes.lightTheme.textColor,
      fontSize: sizeConverter(14),
      fontWeight: '500',
      marginLeft: sizeConverter(8),
      width: sizeConverter(220),
    },
    textView: {
      flex: 1,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.image}>{image}</View>
      <View style={styles.textView}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LoginScreen;
