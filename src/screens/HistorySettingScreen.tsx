import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomHeader, SwitchButton} from '../components';
import {StyleSheet, View} from 'react-native';
import {useAuthStore, useLanguageStore, useThemeStore} from '../stores';
import {sizeConverter} from '../utils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types';

const HistorySettingScreen: React.FC = () => {
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackProps, 'HistorySettingScreen'>
    >();
  const {userInfo, setUserInfo, updateUser} = useAuthStore();
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      paddingTop: sizeConverter(12),
    },
    switchButtonStyle: {
      marginBottom: sizeConverter(8),
    },
  });

  const setIsSetting = async ({
    isAgreeUploadHistory,
    isAgreeUploadRanking,
  }: {
    isAgreeUploadHistory?: boolean;
    isAgreeUploadRanking?: boolean;
  }) => {
    if (!userInfo) return;
    const user = userInfo;
    if (isAgreeUploadHistory !== undefined)
      user.isAgreeUploadHistory = isAgreeUploadHistory;
    if (isAgreeUploadRanking !== undefined)
      user.isAgreeUploadRanking = isAgreeUploadRanking;
    const userResult = await updateUser(user);
    setUserInfo(userResult);
  };

  const onPressHistory = () => {
    if (userInfo?.isAgreeUploadHistory) {
      navigation.navigate('CustomPopupScreen', {
        onPressOk: () => {
          setIsSetting({isAgreeUploadHistory: false});
        },
        title: selectedLanguage.autoUplodeHistory,
        description: selectedLanguage.autoUplodeHistoryAlert,
      });
      return;
    }
    setIsSetting({isAgreeUploadHistory: true});
  };

  const onPressRanking = () => {
    if (userInfo?.isAgreeUploadRanking) {
      navigation.navigate('CustomPopupScreen', {
        onPressOk: () => {
          setIsSetting({isAgreeUploadRanking: false});
        },
        title: selectedLanguage.autoUplodeRanking,
        description: selectedLanguage.autoUplodeRankingyAlert,
      });
      return;
    }
    setIsSetting({isAgreeUploadRanking: true});
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={true}
        isHaveOption={false}
        title={selectedLanguage.save}
      />
      <View style={styles.content}>
        <SwitchButton
          text={selectedLanguage.autoUplodeHistory}
          onPress={onPressHistory}
          value={userInfo?.isAgreeUploadHistory || false}
          contentContainerStyle={styles.switchButtonStyle}
        />
        <SwitchButton
          text={selectedLanguage.autoUplodeRanking}
          onPress={onPressRanking}
          value={userInfo?.isAgreeUploadRanking || false}
        />
      </View>
    </SafeAreaView>
  );
};

export default HistorySettingScreen;
