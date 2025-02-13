import React from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  CustomHeader,
  IconDivide,
  IconMinus,
  IconMix,
  IconMultiply,
  IconPlus,
  IconUser,
  PlayButton,
} from '../components';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {sizeConverter} from '../utils';
import {useTextStyles} from '../styles';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types/NavigationTypes';
import {useAuthStore, useLanguageStore, useThemeStore} from '../stores';

const MyInfoButton = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'MainScreen'>>();
  const {isLogin} = useAuthStore();
  const styles = StyleSheet.create({
    infoButton: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingLeft: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  const onPressMyinfo = () => {
    if (!isLogin) {
      navigation.navigate('LoginScreen');
      return;
    }
    navigation.navigate('MyInfoScreen');
  };

  return (
    <TouchableOpacity onPress={onPressMyinfo} style={styles.infoButton}>
      <IconUser size={28} />
    </TouchableOpacity>
  );
};

const MainScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'MainScreen'>>();
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {bottom} = useSafeAreaInsets();
  const {font20Bold} = useTextStyles();

  const styles = StyleSheet.create({
    button: {
      marginBottom: sizeConverter(16),
    },
    container: {
      alignItems: 'center',
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingBottom: bottom + sizeConverter(24),
    },
    title: {
      fontSize: sizeConverter(102),
    },
  });

  const onPressPlus = () => {
    navigation.navigate('PlayScreen', {
      operation: 'plus',
      level: 1,
    });
  };
  const onPressMultiply = () => {
    navigation.navigate('PlayScreen', {
      operation: 'multiply',
      level: 1,
    });
  };
  const onPressSubtraction = () => {
    navigation.navigate('PlayScreen', {
      operation: 'subtraction',
      level: 1,
    });
  };
  const onPressDivision = () => {
    navigation.navigate('PlayScreen', {
      operation: 'division',
      level: 1,
    });
  };
  const onPressMix = () => {
    navigation.navigate('PlayScreen', {
      operation: 'mix',
      level: 1,
    });
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={false}
        isHaveOption={true}
        leftContent={MyInfoButton}
      />
      <View style={styles.content}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={[font20Bold, styles.title]}>암산</Text>

          <TouchableOpacity style={{position: 'absolute', right: 0, bottom: 0}}>
            <Text>123</Text>
          </TouchableOpacity>
        </View>
        <PlayButton
          text={selectedLanguage.plus}
          onPress={onPressPlus}
          Icon={<IconPlus size={sizeConverter(22)} />}
          style={styles.button}
        />
        <PlayButton
          text={selectedLanguage.multiply}
          onPress={onPressMultiply}
          Icon={<IconMultiply size={sizeConverter(22)} />}
          style={styles.button}
        />
        <PlayButton
          text={selectedLanguage.subtraction}
          onPress={onPressSubtraction}
          Icon={<IconMinus size={sizeConverter(22)} />}
          style={styles.button}
        />
        <PlayButton
          text={selectedLanguage.division}
          onPress={onPressDivision}
          Icon={<IconDivide size={sizeConverter(22)} />}
          style={styles.button}
        />
        <PlayButton
          text={selectedLanguage.mix}
          onPress={onPressMix}
          Icon={<IconMix />}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
