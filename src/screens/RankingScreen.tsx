import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLanguageStore, useThemeStore} from '../stores';
import {CustomHeader} from '../components';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types';

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
      <CustomHeader
        title={selectedLanguage.ranking}
        rightContent={RightContent}
      />
      <Text>123</Text>
    </SafeAreaView>
  );
};

const RightContent = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'RankingScreen'>>();

  const onPress = () => {
    navigation.navigate('CustomModalScreen');
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>123</Text>
    </TouchableOpacity>
  );
};

export default RankingScreen;
