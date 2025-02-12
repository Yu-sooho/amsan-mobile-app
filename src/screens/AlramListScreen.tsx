import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CheckButton, CustomHeader, DeleteButton} from '../components';
import {sizeConverter} from '../utils';
import {useLanguageStore, useThemeStore} from '../stores';

const AlramListScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      flex: 1,
      paddingTop: sizeConverter(12),
    },
  });
  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        title={selectedLanguage.alram}
        rightContent={() => <RightContent />}
      />
      <View style={styles.content}>
        <CheckButton text={'123'} onPress={() => {}} isActive />
      </View>
    </SafeAreaView>
  );
};

const RightContent: React.FC = () => {
  return (
    <View>
      <DeleteButton onPress={() => {}} />
    </View>
  );
};

export default AlramListScreen;
