import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomHeader} from '../components';
import {StyleSheet, Text} from 'react-native';
import {useThemeStore} from '../stores';

const LoginScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
  });

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader isHaveBack={true} isHaveOption={false} />
      <Text>123</Text>
    </SafeAreaView>
  );
};

export default LoginScreen;
