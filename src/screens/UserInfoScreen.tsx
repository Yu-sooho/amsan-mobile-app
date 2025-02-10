import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowButton, CustomHeader, UserImageButton} from '../components';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {showToast, sizeConverter} from '../utils';
import {useDataStore, useLanguageStore, useThemeStore} from '../stores';
import {useTextStyles} from '../styles';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types/NavigationTypes';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {CurrentUser} from '../types/AuthTypes';

const UserInfoScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'UserInfoScreen'>>();
  const route = useRoute<RouteProp<RootStackProps, 'UserInfoScreen'>>();
  const uid = route?.params?.uid;

  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {getOtherUser} = useDataStore();
  const {font16Bold} = useTextStyles();
  const [userInfo, setUserInfo] = useState<CurrentUser | null>(null);

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

  const fetchUserData = async () => {
    if (!uid) {
      showToast({text: selectedLanguage.serverError});
      navigation.goBack();
    }
    const result = await getOtherUser(uid);
    if (!result) return;
    setUserInfo(result);
  };

  useEffect(() => {
    fetchUserData();
  }, [uid]);

  const onPressHistory = () => {
    if (userInfo)
      navigation.navigate('HistoryScreen', {
        user: userInfo,
      });
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={true}
        isHaveOption={false}
        title={selectedLanguage.info}
      />
      <ScrollView bounces={false}>
        <View style={styles.content}>
          <UserImageButton
            url={userInfo?.profileImageUrl256 || userInfo?.profileImageUrl}
          />
          <View style={styles.editButton}>
            <Text style={styles.name}>{userInfo?.displayName}</Text>
          </View>
          <View style={styles.editButton}>
            <Text style={styles.name}>{userInfo?.email}</Text>
          </View>
        </View>
        <ArrowButton
          onPress={onPressHistory}
          text={selectedLanguage.history}
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserInfoScreen;
