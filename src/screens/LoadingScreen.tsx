import LottieView from 'lottie-react-native';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {lotties} from '../resources';
import {sizeConverter} from '../utils';
import {useThemeStore} from '../stores';

const LoadingScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: Dimensions.get('window').height,
      justifyContent: 'center',
      position: 'absolute',
      width: Dimensions.get('window').width,
    },
    content: {
      backgroundColor: selectedTheme.backgourndColorOpacity,
      height: Dimensions.get('window').height,
      position: 'absolute',
      width: Dimensions.get('window').width,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content} />
      <LottieView
        source={
          selectedTheme.id === 'dark'
            ? lotties.lottie_loading_white
            : lotties.lottie_loading_black
        }
        style={{width: sizeConverter(64), height: sizeConverter(64)}}
        autoPlay
        loop
      />
    </View>
  );
};

export default LoadingScreen;
