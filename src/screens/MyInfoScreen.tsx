import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowButton, CustomHeader, UserImageButton} from '../components';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {sizeConverter} from '../utils';
import {useAuthStore, useLanguageStore, useThemeStore} from '../stores';
import {useTextStyles} from '../styles';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types/NavigationTypes';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const MyInfoScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'MainScreen'>>();
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {setToken, setIsLogin, isLogin, user, setUser} = useAuthStore();
  const {font16Bold} = useTextStyles();

  const styles = StyleSheet.create({
    button: {
      marginBottom: sizeConverter(12),
    },
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
    editButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: sizeConverter(220),
    },
    name: {
      ...font16Bold,
      marginTop: sizeConverter(10),
    },
  });

  useEffect(() => {
    if (!isLogin) {
      navigation.replace('LoginScreen');
    }
  }, [isLogin]);

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

  const onPressRanking = () => {
    navigation.navigate('RankingScreen');
  };

  const onPressHistory = () => {
    navigation.navigate('HistoryScreen');
  };

  const onPressLogout = () => {
    navigation.navigate('CustomPopupScreen', {
      onPressOk: logout,
      title: selectedLanguage.logout,
      description: selectedLanguage.isLogout,
    });
  };

  const logout = async () => {
    await googleLogout();
    auth().signOut();
    setUser(null);
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
      <ScrollView bounces={false}>
        <View style={styles.content}>
          <UserImageButton />
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.name}>{user?.displayName}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.name}>{user?.email}</Text>
          </TouchableOpacity>
        </View>
        <ArrowButton
          onPress={onPressHistory}
          text={selectedLanguage.history}
          style={styles.button}
        />
        <ArrowButton
          onPress={onPressRanking}
          text={selectedLanguage.ranking}
          style={styles.button}
        />
        <LogoutButton onPress={onPressLogout} />
      </ScrollView>
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
