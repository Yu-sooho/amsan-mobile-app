import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomHeader, SwitchButton} from '../components';
import {Linking, StyleSheet, View} from 'react-native';
import {useAppStateStore, useLanguageStore, useThemeStore} from '../stores';
import {sizeConverter} from '../utils';
import messaging from '@react-native-firebase/messaging';

const AlramScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {isActiveAlram, setIsActiveAlram, appState} = useAppStateStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      flex: 1,
      paddingTop: sizeConverter(12),
    },
  });

  const onPressSwitch = () => {
    if (isActiveAlram) {
      setIsActiveAlram(false);
      return;
    }
    requestMessage();
  };

  const requestMessage = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;
    if (enabled) {
      setIsActiveAlram(true);
    } else {
      Linking.openSettings();
    }
  };

  const checkApplicationPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
      setIsActiveAlram(false);
    }
  };

  useEffect(() => {
    checkApplicationPermission();
  }, [appState]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={true}
        isHaveOption={false}
        title={selectedLanguage.alram}
      />
      <View style={styles.content}>
        <SwitchButton
          text={selectedLanguage.alram}
          onPress={onPressSwitch}
          value={isActiveAlram}
        />
      </View>
    </SafeAreaView>
  );
};

export default AlramScreen;
