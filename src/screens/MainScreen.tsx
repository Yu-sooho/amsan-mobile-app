import React from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  CustomHeader,
  IconDivide,
  IconMinus,
  IconMix,
  IconMultiply,
  IconNoAds,
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
import {
  useAppStateStore,
  useAuthStore,
  useLanguageStore,
  useThemeStore,
} from '../stores';

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
  const {level, setLevel} = useAppStateStore();
  const {bottom} = useSafeAreaInsets();
  const {font20Bold, font14Bold} = useTextStyles();

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
    levelButton: {
      alignItems: 'center',
      bottom: sizeConverter(24),
      height: sizeConverter(44),
      justifyContent: 'flex-end',
      left: 0,
      position: 'absolute',
      width: sizeConverter(44),
    },
    levelText: {
      ...font14Bold,
      fontSize: sizeConverter(32),
      textAlign: 'center',
    },
    noAdsButton: {
      alignItems: 'center',
      bottom: sizeConverter(24),
      height: sizeConverter(44),
      justifyContent: 'flex-end',
      position: 'absolute',
      right: 0,
      width: sizeConverter(44),
    },
    noAdsText: {
      ...font14Bold,
      marginTop: sizeConverter(4),
      textAlign: 'center',
    },
    title: {
      fontSize: sizeConverter(102),
    },
    titleView: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
  });

  const onPressPlus = () => {
    navigation.navigate('PlayScreen', {
      operation: 'plus',
      level: level,
    });
  };
  const onPressMultiply = () => {
    navigation.navigate('PlayScreen', {
      operation: 'multiply',
      level: level,
    });
  };
  const onPressSubtraction = () => {
    navigation.navigate('PlayScreen', {
      operation: 'subtraction',
      level: level,
    });
  };
  const onPressDivision = () => {
    navigation.navigate('PlayScreen', {
      operation: 'division',
      level: level,
    });
  };
  const onPressMix = () => {
    navigation.navigate('PlayScreen', {
      operation: 'mix',
      level: level,
    });
  };

  const onPressLevel = () => {
    if (level >= 5) {
      setLevel(1);
      return;
    }
    setLevel(level + 1);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={false}
        isHaveOption={true}
        leftContent={MyInfoButton}
      />
      <View style={styles.content}>
        <View style={styles.titleView}>
          <Text style={[font20Bold, styles.title]}>암산</Text>

          <TouchableOpacity style={styles.noAdsButton}>
            <IconNoAds />
            <Text style={styles.noAdsText}>{'NoAds'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressLevel} style={styles.levelButton}>
            <Text style={styles.levelText}>{level}</Text>
            <Text style={styles.noAdsText}>{'LEVEL'}</Text>
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
