import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowButton, CustomHeader, UserImageButton} from '../components';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {sizeConverter} from '../utils';
import {useAuthStore, useLanguageStore, useThemeStore} from '../stores';
import {useTextStyles} from '../styles';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const MyInfoScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {setToken, setIsLogin} = useAuthStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: sizeConverter(12),
      paddingVertical: sizeConverter(24),
    },
  });

  const googleLogout = async () => {
    try {
      const result = await GoogleSignin.getCurrentUser();
      if (result) await GoogleSignin.signOut();
      return true;
    } catch (error) {
      console.log('googleLogout error', error);
      return false;
    }
  };

  const onPressRanking = () => {};

  const onPressLogout = async () => {
    await googleLogout();
    setToken(null);
    setIsLogin(false);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={true}
        isHaveOption={false}
        title={selectedLanguage.myInfo}
      />
      <View style={styles.content}>
        <UserImageButton />
      </View>
      <ArrowButton onPress={onPressRanking} text={selectedLanguage.ranking} />
      <LogoutButton onPress={onPressLogout} />
    </SafeAreaView>
  );
};

const LogoutButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {font14Bold} = useTextStyles();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      marginTop: sizeConverter(24),
      paddingLeft: sizeConverter(20),
      width: sizeConverter(120),
    },
    text: {
      ...font14Bold,
    },
  });
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{selectedLanguage.logout}</Text>
    </TouchableOpacity>
  );
};

export default MyInfoScreen;
