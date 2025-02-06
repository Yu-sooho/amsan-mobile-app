import React, {useState} from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuthStore, useLanguageStore, useThemeStore} from '../stores';
import {ConfirmButton, CustomHeader, UserImageButton} from '../components';
import {showToast, sizeConverter} from '../utils';
import {useTextStyles} from '../styles';
import {CurrentUser} from '../types/AuthTypes';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types';

const InfoEditScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {userInfo, updateUser, setUserInfo} = useAuthStore();
  const {font16Bold} = useTextStyles();
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'InfoEditScreen'>>();

  const styles = StyleSheet.create({
    buttonView: {
      alignItems: 'center',
    },
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
      paddingBottom: sizeConverter(44),
    },
    content: {
      alignItems: 'center',
      flex: 1,
      paddingTop: sizeConverter(44),
    },
    text: {
      ...font16Bold,
      fontSize: sizeConverter(14),
      fontWeight: 'bold',
    },
    textInput: {
      ...font16Bold,
      borderBottomColor: selectedTheme.textColor,
      borderBottomWidth: sizeConverter(1),
      height: sizeConverter(44),
      marginHorizontal: sizeConverter(12),
      marginTop: sizeConverter(12),
      paddingHorizontal: sizeConverter(10),
    },
    textView: {
      marginBottom: sizeConverter(16),
      marginTop: sizeConverter(24),
      minWidth: sizeConverter(340),
    },
  });

  const onPressBackground = () => {
    Keyboard.dismiss();
  };

  const onPressSave = async () => {
    if (!userInfo) return;
    const user: CurrentUser = {
      ...userInfo,
      displayName: inputName || userInfo.email,
      email: inputEmail || userInfo.email,
    };
    const currentUser = await updateUser(user);
    if (!currentUser) {
      showToast({text: selectedLanguage.failedEdit});
      return;
    }
    showToast({text: selectedLanguage.successEdit});
    setUserInfo(currentUser);
    navigation.goBack();
  };

  const onChangeTextName = (text: string) => {
    setInputName(text);
  };

  const onChangeTextEmail = (text: string) => {
    setInputEmail(text);
  };

  return (
    <TouchableWithoutFeedback onPress={onPressBackground}>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <CustomHeader title={selectedLanguage.infoEditScreen} />
        <View style={styles.content}>
          <UserImageButton
            url={userInfo?.profileImageUrl}
            size={sizeConverter(160)}
          />
          <View style={styles.textView}>
            <Text style={styles.text}>{selectedLanguage.name}</Text>
            <TextInput
              onChangeText={onChangeTextName}
              style={styles.textInput}
              placeholder={userInfo?.displayName}
              placeholderTextColor={selectedTheme.placeholderColor}
              maxLength={12}
            />
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>{selectedLanguage.email}</Text>
            <TextInput
              onChangeText={onChangeTextEmail}
              style={styles.textInput}
              placeholder={userInfo?.email}
              placeholderTextColor={selectedTheme.placeholderColor}
              maxLength={24}
            />
          </View>
        </View>
        <View style={styles.buttonView}>
          <ConfirmButton
            onPress={onPressSave}
            text={selectedLanguage.save}
            disabled={inputEmail.length <= 0 && inputName.length <= 0}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default InfoEditScreen;
