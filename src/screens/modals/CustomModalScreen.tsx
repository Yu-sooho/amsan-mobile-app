import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {sizeConverter} from '../../utils';
import {useThemeStore} from '../../stores';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackProps} from '../../types';
import {CheckButton} from '../../components';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CustomModalScreen: React.FC = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'CustomModalScreen'>>();
  const route = useRoute<RouteProp<RootStackProps, 'CustomModalScreen'>>();
  const {selectedTheme} = useThemeStore();
  const {bottom} = useSafeAreaInsets();
  const {onPress, selectedValue, valueList} = route.params;
  const [value, setValue] = useState(selectedValue);

  const styles = StyleSheet.create({
    arrowButton: {
      marginBottom: sizeConverter(8),
    },
    container: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    content: {
      backgroundColor: selectedTheme.backgourndColor,
      borderTopLeftRadius: sizeConverter(24),
      borderTopRightRadius: sizeConverter(24),
      paddingBottom: bottom + sizeConverter(24),
      paddingTop: sizeConverter(24),
    },
  });

  const onPressBack = async () => {
    const isCanGoBack = await navigation.canGoBack();
    if (isCanGoBack) {
      navigation.goBack();
    }
  };

  const onPressItem = (value: string) => {
    setValue(value);
    onPress(value);
    onPressBack();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPressBack}
      style={styles.container}>
      <View style={styles.content}>
        {valueList.map((element, index) => {
          return (
            <View key={`${element}-${index}`}>
              <CheckButton
                style={styles.arrowButton}
                onPress={() => onPressItem(element)}
                text={element}
                isActive={element === value}
              />
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

export default CustomModalScreen;
