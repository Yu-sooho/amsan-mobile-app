import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CustomHeader} from '../components';
import {StyleSheet, Text, View} from 'react-native';
import Slider from '@react-native-community/slider';
import {useTextStyles} from '../styles';
import {sizeConverter} from '../utils';
import {useLanguageStore, useThemeStore} from '../stores';

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
  const {fontSize, setFontSize, selectedTheme} = useThemeStore();
  const {font14Bold} = useTextStyles();

  const handleSizeChange = (value: number) => {
    setFontSize(value);
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      paddingTop: sizeConverter(44),
    },
    label: {
      ...font14Bold,
    },
    slider: {
      height: 40,
      paddingTop: sizeConverter(32),
      width: sizeConverter(300),
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{Math.round(fontSize)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={fontSize}
        onValueChange={handleSizeChange}
        minimumTrackTintColor={selectedTheme.textColor}
        maximumTrackTintColor={selectedTheme.textColor}
        thumbTintColor={selectedTheme.textColor}
      />
    </View>
  );
};

export default FontSizeScreen;
