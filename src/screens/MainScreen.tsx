import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import useThemeStore from '../stores/useThemeStore';
import {CustomHeader} from '../components';
import {StyleSheet} from 'react-native';

const MainScreen = () => {
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
  });

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader isHaveBack={false} isHaveOption={true} />
    </SafeAreaView>
  );
};

export default MainScreen;
