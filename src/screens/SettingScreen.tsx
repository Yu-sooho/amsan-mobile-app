import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowButton, CustomHeader} from '../components';
import {StyleSheet, View} from 'react-native';
import {RootStackProps} from '../types/NavigationTypes';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {sizeConverter} from '../utils';
import {useLanguageStore, useThemeStore} from '../stores';

const SettingScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
  });

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={true}
        isHaveOption={false}
        title={selectedLanguage.settingScreen}
      />
      <Content />
    </SafeAreaView>
  );
};

const Content: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'SettingScreen'>>();
  const {selectedLanguage} = useLanguageStore();

  const onPressTheme = () => {
    navigation.navigate('ThemeScreen');
  };

  const onPressLanguage = () => {
    navigation.navigate('LanguageScreen');
  };

  const onPressFontSize = () => {
    navigation.navigate('FontSizeScreen');
  };

  const onPressAlram = () => {
    navigation.navigate('AlramScreen');
  };

  const HistorySettingScreen = () => {
    navigation.navigate('HistorySettingScreen');
  };

  const styles = StyleSheet.create({
    arrowButton: {
      marginBottom: sizeConverter(8),
    },
    container: {
      paddingTop: sizeConverter(12),
    },
  });

  return (
    <View style={styles.container}>
      <ArrowButton
        style={styles.arrowButton}
        onPress={HistorySettingScreen}
        text={selectedLanguage.save}
      />
      <ArrowButton
        style={styles.arrowButton}
        onPress={onPressAlram}
        text={selectedLanguage.alram}
      />
      <ArrowButton
        style={styles.arrowButton}
        onPress={onPressTheme}
        text={selectedLanguage.theme}
      />
      <ArrowButton
        style={styles.arrowButton}
        onPress={onPressLanguage}
        text={selectedLanguage.language}
      />
      <ArrowButton
        style={styles.arrowButton}
        onPress={onPressFontSize}
        text={selectedLanguage.fontSize}
      />
    </View>
  );
};

export default SettingScreen;
