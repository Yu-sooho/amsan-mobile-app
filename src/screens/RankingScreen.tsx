import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useLanguageStore, useThemeStore} from '../stores';
import {CustomHeader, IconSliders} from '../components';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../types';
import {sizeConverter} from '../utils';

const RankingScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
  });

  const sortTypes = [
    selectedLanguage.plus,
    selectedLanguage.division,
    selectedLanguage.multiply,
    selectedLanguage.subtraction,
    selectedLanguage.mix,
  ];

  const [selectedValue, setSelectedValue] = useState('');

  const onPressSortType = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        title={selectedLanguage.ranking}
        rightContent={() => (
          <RightContent
            sortTypes={sortTypes}
            selectedValue={selectedValue}
            onPressSortType={onPressSortType}
          />
        )}
      />

      <Text>123</Text>
    </SafeAreaView>
  );
};

const RightContent = ({
  onPressSortType,
  sortTypes,
  selectedValue,
}: {
  onPressSortType: (value: string) => void;
  sortTypes: string[];
  selectedValue: string;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'RankingScreen'>>();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingRight: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  const openModal = () => {
    navigation.navigate('CustomModalScreen', {
      selectedValue: selectedValue,
      valueList: sortTypes,
      onPress: onPressSortType,
    });
  };

  return (
    <TouchableOpacity onPress={openModal} style={styles.container}>
      <IconSliders size={sizeConverter(24)} />
    </TouchableOpacity>
  );
};

export default RankingScreen;
