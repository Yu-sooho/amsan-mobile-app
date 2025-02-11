import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useAppStateStore,
  useAuthStore,
  useDataStore,
  useLanguageStore,
  useThemeStore,
} from '../stores';
import {ConfirmButton, CustomHeader, UserImageButton} from '../components';
import {isEmail, showToast, sizeConverter} from '../utils';
import {useTextStyles} from '../styles';
import {CurrentUser} from '../types/AuthTypes';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types';
import ImagePicker from 'react-native-image-crop-picker';
import {check, PERMISSIONS, request} from 'react-native-permissions';

const PHOTO_LIBRARY =
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
    : PERMISSIONS.IOS.PHOTO_LIBRARY;

const InfoEditScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {userInfo, updateUser, setUserInfo, isDuplicatedEmail} = useAuthStore();
  const {setIsLoading} = useAppStateStore();
  const {uploadImage} = useDataStore();
  const {font16Bold} = useTextStyles();
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [selectedImage, setSelecetedImage] = useState<
    string | null | undefined
  >(null);
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
    contentContainerStyle: {
      alignItems: 'center',
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
    textInputError: {
      ...font16Bold,
      borderBottomColor: selectedTheme.wrongColor,
      borderBottomWidth: sizeConverter(1),
      color: selectedTheme.wrongColor,
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

  const checkDuplicatedEmail = async () => {
    if (!inputEmail) return false;
    if (inputEmail === userInfo?.email) return false;
    const isDuplicated = await isDuplicatedEmail(inputEmail);
    if (isDuplicated) return true;
    return false;
  };

  const onPressSave = async () => {
    try {
      if (!userInfo) return;
      setIsLoading(true);
      let imageUrls = null;

      const isDuplicated = await checkDuplicatedEmail();

      if (isDuplicated) {
        showToast({text: selectedLanguage.duplicatedEmail});
        setIsLoading(false);
        return true;
      }

      const user: CurrentUser = {
        ...userInfo,
        displayName: inputName || userInfo.displayName,
        email: inputEmail || userInfo.email,
      };

      console.log(user, 'FUFU');
      if (selectedImage) {
        imageUrls = await uploadImageData();
        if (!imageUrls) {
          showToast({text: selectedLanguage.failedEdit});
          setIsLoading(false);
          return false;
        }
      }
      if (imageUrls) {
        user.profileImageUrl = imageUrls[0];
        user.profileImageUrl128 = imageUrls[1];
        user.profileImageUrl256 = imageUrls[2];
        user.profileImageUrl512 = imageUrls[3];
      }

      const currentUser = await updateUser(user);
      if (!currentUser) {
        showToast({text: selectedLanguage.failedEdit});
        setIsLoading(false);
        return;
      }

      showToast({text: selectedLanguage.successEdit});
      setUserInfo(currentUser);
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeTextName = (text: string) => {
    setInputName(text);
  };

  const onChangeTextEmail = (text: string) => {
    setInputEmail(text);
  };

  useEffect(() => {
    if (!inputEmail) {
      setEmailError(false);
    } else {
      const result = isEmail(inputEmail);
      setEmailError(!result);
    }
  }, [inputEmail]);

  const uploadImageData = async () => {
    if (!selectedImage) return;
    const result = await uploadImage(selectedImage);
    return result;
  };

  const openImagePicker = async () => {
    ImagePicker.openPicker({
      width: sizeConverter(400),
      height: sizeConverter(400),
      cropping: true,
    }).then(image => {
      if (image?.sourceURL) setSelecetedImage(image.sourceURL);
      if (image?.path) setSelecetedImage(image.path);
    });
  };

  const requestPermission = async () => {
    const result = await request(PHOTO_LIBRARY);
    if (result === 'granted') {
      openImagePicker();
      return;
    }
    if (result === 'blocked') {
      Linking.openSettings();
    }
  };

  const checkPermission = async () => {
    const result = await check(PHOTO_LIBRARY);
    if (result === 'granted') {
      openImagePicker();
      return;
    }
    requestPermission();
  };

  const onPressImageButton = async () => {
    checkPermission();
  };

  return (
    <TouchableWithoutFeedback onPress={onPressBackground}>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <CustomHeader title={selectedLanguage.infoEditScreen} />
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <UserImageButton
              onPress={onPressImageButton}
              url={
                selectedImage ||
                userInfo?.profileImageUrl512 ||
                userInfo?.profileImageUrl
              }
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
                style={emailError ? styles.textInputError : styles.textInput}
                placeholder={userInfo?.email}
                placeholderTextColor={selectedTheme.placeholderColor}
                maxLength={24}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.buttonView}>
          <ConfirmButton
            onPress={onPressSave}
            text={selectedLanguage.save}
            disabled={
              inputEmail.length <= 0 && inputName.length <= 0 && !selectedImage
            }
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default InfoEditScreen;
