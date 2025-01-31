import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomHeader, IconApple, IconGoogle} from '../components';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useThemeStore} from '../stores';
import {
  appleAuthAndroid,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {sizeConverter} from '../utils';
import themes from '../styles/themes';

const LoginScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();

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

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log(response, 'FUFU');
      } else {
        console.log(response, 'FUFU');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            break;
          default:
        }
      } else {
        console.log(error);
      }
    }
  };

  const appleSignIn = async () => {
    if (Platform.OS === 'android') {
      try {
        const rawNonce = uuid();
        const state = uuid();

        appleAuthAndroid.configure({
          clientId: 'com.example.client-android',
          redirectUri: 'https://example.com/auth/callback',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
          nonce: rawNonce,
          state,
        });

        const response = await appleAuthAndroid.signIn();
        console.log(response);
      } catch (error) {
        console.log(error, 'FUFU');
      }
      return;
    }

    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      console.log(appleAuthRequestResponse, 'FUFU');

      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
      }
    } catch (error) {
      console.log(error, 'FUFU');
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
