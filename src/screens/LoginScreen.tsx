import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomHeader} from '../components';
import {Platform, StyleSheet} from 'react-native';
import {useThemeStore} from '../stores';
import {
  appleAuthAndroid,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import 'react-native-get-random-values';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {v4 as uuid} from 'uuid';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const LoginScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
  });

  // Somewhere in your code
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log(response, 'FUFU');
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        console.log(error);
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
        console.log(error);
      }
    }
  };

  async function onAppleAndroidButtonPress() {
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
  }

  async function onAppleButtonPress() {
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
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader isHaveBack={true} isHaveOption={false} />
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: 160, // You must specify a width
          height: 45, // You must specify a height
        }}
        onPress={() =>
          Platform.OS === 'ios'
            ? onAppleButtonPress()
            : onAppleAndroidButtonPress()
        }
      />
      <AppleButton
        buttonStyle={AppleButton.Style.WHITE}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: 160, // You must specify a width
          height: 45, // You must specify a height
        }}
        onPress={signIn}
      />
    </SafeAreaView>
  );
};

export default LoginScreen;
