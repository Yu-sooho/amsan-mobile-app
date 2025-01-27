import React from 'react';
import {useThemeStore} from '../../stores';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {IconBack, IconSetting} from '../icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {sizeConverter} from '../../utils';
import {useTextStyles} from '../../styles';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../../types/NavigationTypes';

type CustomHeaderProps = {
  isHaveBack?: boolean;
  isHaveOption?: boolean;
  leftContent?: () => JSX.Element;
  title?: string;
  rightContent?: () => JSX.Element;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  isHaveBack = true,
  leftContent,
  title = '',
  isHaveOption = false,
  rightContent,
}) => {
  const {top} = useSafeAreaInsets();
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flexDirection: 'row',
      paddingTop: top,
      width: Dimensions.get('window').width,
    },
  });

  return (
    <View style={styles.container}>
      {leftContent ? leftContent() : <LeftContent isHaveBack={isHaveBack} />}
      <CenterContent title={title} />
      {rightContent ? (
        rightContent()
      ) : (
        <RightContent isHaveOption={isHaveOption} />
      )}
    </View>
  );
};

const LeftContent: React.FC<{isHaveBack: boolean}> = ({isHaveBack}) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'SettingScreen'>>();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingLeft: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  const onPress = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {isHaveBack && <IconBack />}
    </TouchableOpacity>
  );
};

const CenterContent: React.FC<{title: string}> = ({title}) => {
  const textStyles = useTextStyles();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    text: {
      ...textStyles.font20Bold,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const RightContent: React.FC<{isHaveOption: boolean}> = ({isHaveOption}) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'SettingScreen'>>();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingRight: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  const onPress = () => {
    navigation.navigate('SettingScreen');
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {isHaveOption && <IconSetting />}
    </TouchableOpacity>
  );
};
export default CustomHeader;
