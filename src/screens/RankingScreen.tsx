import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLanguageStore, useThemeStore} from '../stores';
import {CustomHeader} from '../components';

const RankingScreen: React.FC = () => {
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
      <CustomHeader title={selectedLanguage.ranking} />
      <Text>123</Text>
    </SafeAreaView>
  );
};

export default RankingScreen;
