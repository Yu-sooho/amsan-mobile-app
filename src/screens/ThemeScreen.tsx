import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CheckButton, CustomHeader} from '../components';
import {StyleSheet, View} from 'react-native';
import themes from '../styles/themes';
import {sizeConverter} from '../utils';
import {useLanguageStore, useThemeStore} from '../stores';

const ThemeScreen: React.FC = () => {
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
        title={selectedLanguage.theme}
      />
      <Content />
    </SafeAreaView>
  );
};

const Content: React.FC = () => {
  const {selectedLanguage} = useLanguageStore();
  const {selectedTheme, selectTheme} = useThemeStore();

  const onPressDark = () => {
    selectTheme(themes.darkTheme);
  };
  const onPressLight = () => {
    selectTheme(themes.lightTheme);
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
      <CheckButton
        style={styles.arrowButton}
        onPress={onPressLight}
        text={selectedLanguage.light}
        isActive={selectedTheme.id === themes.lightTheme.id}
      />
      <CheckButton
        style={styles.arrowButton}
        onPress={onPressDark}
        text={selectedLanguage.dark}
        isActive={selectedTheme.id === themes.darkTheme.id}
      />
    </View>
  );
};

export default ThemeScreen;
