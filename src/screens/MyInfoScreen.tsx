import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ArrowButton, CustomHeader, UserImageButton} from '../components';
import {StyleSheet, View} from 'react-native';
import {sizeConverter} from '../utils';
import {useLanguageStore, useThemeStore} from '../stores';

const MyInfoScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: sizeConverter(12),
      paddingVertical: sizeConverter(24),
    },
  });

  const onPressRanking = () => {};

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={true}
        isHaveOption={false}
        title={selectedLanguage.myInfo}
      />
      <View style={styles.content}>
        <UserImageButton />
      </View>
      <ArrowButton onPress={onPressRanking} text={selectedLanguage.ranking} />
    </SafeAreaView>
  );
};

export default MyInfoScreen;
