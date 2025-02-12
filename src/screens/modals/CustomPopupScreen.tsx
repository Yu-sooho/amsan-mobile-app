import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {sizeConverter} from '../../utils';
import {useLanguageStore, useThemeStore} from '../../stores';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../../types';
import {useTextStyles} from '../../styles';

const CustomPopupScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'CustomPopupScreen'>>();
  const route = useRoute<RouteProp<RootStackProps, 'CustomPopupScreen'>>();

  const {selectedTheme} = useThemeStore();
  const {font18Bold, font14Bold} = useTextStyles();
  const {selectedLanguage} = useLanguageStore();

  const title = route.params?.title;
  const description = route.params?.description;
  const onPressOk = route.params?.onPressOk;

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    buttonText: {
      ...font14Bold,
    },
    buttonView: {
      flexDirection: 'row',
      height: sizeConverter(48),
    },
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    contentView: {
      backgroundColor: selectedTheme.backgourndColor,
      borderRadius: sizeConverter(24),
      width: sizeConverter(300),
    },
    descriptionText: {
      ...font14Bold,
      textAlign: 'center',
    },
    descriptionView: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: sizeConverter(64),
      paddingVertical: sizeConverter(24),
    },
    leftButton: {
      borderColor: selectedTheme.textColor,
      borderRightWidth: sizeConverter(0.25),
      borderTopWidth: sizeConverter(0.5),
      flex: 1,
    },
    rightButton: {
      borderColor: selectedTheme.textColor,
      borderLeftWidth: sizeConverter(0.25),
      borderTopWidth: sizeConverter(0.5),
      flex: 1,
    },
    titleText: {
      ...font18Bold,
    },
    titleView: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: sizeConverter(12),
    },
  });

  const onPressBack = async () => {
    const isCanGoBack = await navigation.canGoBack();
    if (isCanGoBack) {
      navigation.goBack();
    }
  };

  const onPressConfirm = async () => {
    navigation.goBack();
    await onPressOk();
  };

  return (
    <TouchableOpacity
      onPress={onPressBack}
      activeOpacity={1}
      style={styles.container}>
      <View style={styles.contentView}>
        {title && (
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
        )}
        {description && (
          <View style={styles.descriptionView}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        )}
        <View style={styles.buttonView}>
          <View style={styles.leftButton}>
            <TouchableOpacity onPress={onPressBack} style={styles.button}>
              <Text style={styles.buttonText}>{selectedLanguage.cancel}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightButton}>
            <TouchableOpacity onPress={onPressConfirm} style={styles.button}>
              <Text style={styles.buttonText}>{selectedLanguage.confirm}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomPopupScreen;
