import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThemeStore from '../stores/useThemeStore';
import {CustomHeader} from '../components';
import {StyleSheet, Text, View} from 'react-native';
import useLanguageStore from '../stores/useLanguageStore';
const FontSizeScreen: React.FC = () => {
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
        title={selectedLanguage.fontSize}
      />
      <Content />
    </SafeAreaView>
  );
};

const Content: React.FC = () => {
  return (
    <View>
      <Text>123</Text>
    </View>
  );
};

export default FontSizeScreen;
