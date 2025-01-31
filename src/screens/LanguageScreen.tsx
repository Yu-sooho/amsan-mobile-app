import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CheckButton, CustomHeader} from '../components';
import {StyleSheet, View} from 'react-native';
import {sizeConverter} from '../utils';
import {language} from '../resources';
import {useLanguageStore, useThemeStore} from '../stores';

const LanguageScreen: React.FC = () => {
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
  const {selectedLanguage, selectLanguage} = useLanguageStore();

  const onPressKor = () => {
    selectLanguage(language.kor);
  };
  const onPressEng = () => {
    selectLanguage(language.eng);
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
        onPress={onPressKor}
        text={selectedLanguage.kor}
        isActive={selectedLanguage.id === language.kor.id}
      />
      <CheckButton
        style={styles.arrowButton}
        onPress={onPressEng}
        text={selectedLanguage.eng}
        isActive={selectedLanguage.id === language.eng.id}
      />
    </View>
  );
};

export default LanguageScreen;
