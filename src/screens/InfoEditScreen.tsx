import React from 'react';
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
import {CustomHeader, UserImageButton} from '../components';
import {sizeConverter} from '../utils';
import {useTextStyles} from '../styles';

const InfoEditScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {userInfo, updateUser} = useAuthStore();
  const {font16Bold} = useTextStyles();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      alignItems: 'center',
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
      minWidth: sizeConverter(320),
    },
  });

  const onPressBackground = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={onPressBackground}>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <CustomHeader title={selectedLanguage.infoEditScreen} />
        <View style={styles.content}>
          <UserImageButton url={userInfo?.profileImageUrl} />
          <View style={styles.textView}>
            <Text style={styles.text}>{selectedLanguage.name}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={userInfo?.displayName}
              placeholderTextColor={selectedTheme.placeholderColor}
            />
          </View>
          <View style={styles.textView}>
            <Text style={styles.text}>{selectedLanguage.email}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={userInfo?.email}
              placeholderTextColor={selectedTheme.placeholderColor}
            />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default InfoEditScreen;
