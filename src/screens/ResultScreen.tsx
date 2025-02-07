import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  ConfirmButton,
  CustomHeader,
  IconHistory,
  IconRanking,
} from '../components';
import {
  useAppStateStore,
  useDataStore,
  useLanguageStore,
  useThemeStore,
} from '../stores';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {PlayType, RootStackProps} from '../types';
import {useTextStyles} from '../styles';
import {sizeConverter} from '../utils';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

const HistoryButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingLeft: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <IconHistory size={sizeConverter(26)} />
    </TouchableOpacity>
  );
};

const RankingButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingRight: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <IconRanking size={sizeConverter(26)} />
    </TouchableOpacity>
  );
};

type ResultScreenProps = StackScreenProps<RootStackProps, 'ResultScreen'>;

const ResultScreen: React.FC<ResultScreenProps> = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'ResultScreen'>>();
  const route = useRoute<RouteProp<RootStackProps, 'ResultScreen'>>();
  const {questionsList, operation, level} = route.params;
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {updateHistory} = useDataStore();
  const {playCount, setPlayCount} = useAppStateStore();
  const isUpdated = useRef<boolean>(false);

  const correctQuestions = questionsList.filter(q => q.isCorrect === true);
  const wrongQuestions = questionsList.filter(q => q.isCorrect === false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
  });

  const onPressRanking = () => {
    navigation.navigate('RankingScreen');
  };

  const onPressHistory = () => {
    navigation.navigate('HistoryScreen');
  };

  const update = async () => {
    if (isUpdated.current) return;
    const result = await updateHistory(questionsList, operation);
    setPlayCount(playCount + 1);
    if (result) {
      isUpdated.current = true;
    }
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        backNavigationNumber={2}
        isHaveBack={false}
        isHaveOption={false}
        title={selectedLanguage.result}
        leftContent={() => <HistoryButton onPress={onPressHistory} />}
        rightContent={() => <RankingButton onPress={onPressRanking} />}
      />
      <Content
        point={correctQuestions.length}
        wrongPoint={wrongQuestions.length}
      />
      <Buttons operation={operation} level={level} />
    </SafeAreaView>
  );
};

const Content: React.FC<{point: number; wrongPoint: number}> = ({
  point,
  wrongPoint,
}) => {
  const {font20Bold} = useTextStyles();
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      paddingTop: sizeConverter(70),
    },
    pointView: {
      alignItems: 'center',
      borderBottomColor: selectedTheme.textColor,
      borderBottomWidth: sizeConverter(1),
      paddingBottom: sizeConverter(12),
      width: sizeConverter(180),
    },
    text: {
      ...font20Bold,
      fontSize: sizeConverter(80),
    },
    wrongPointView: {
      alignItems: 'center',
      borderBottomColor: selectedTheme.wrongColor,
      borderBottomWidth: sizeConverter(1),
      marginTop: sizeConverter(32),
      paddingBottom: sizeConverter(6),
      width: sizeConverter(130),
    },
    wrongText: {
      ...font20Bold,
      color: selectedTheme.wrongColor,
      fontSize: sizeConverter(60),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.pointView}>
        <Text style={styles.text}>{point}</Text>
      </View>
      <View style={styles.wrongPointView}>
        <Text style={styles.wrongText}>{wrongPoint}</Text>
      </View>
    </View>
  );
};

const Buttons: React.FC<{operation: PlayType; level: number}> = ({
  operation,
  level,
}) => {
  const {selectedLanguage} = useLanguageStore();
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'ResultScreen'>>();

  const onPressHome = () => {
    navigation.pop(2);
  };

  const onPressRetry = () => {
    navigation.pop(2);
    navigation.navigate('PlayScreen', {
      operation,
      level,
    });
  };

  const styles = StyleSheet.create({
    button: {
      marginBottom: sizeConverter(32),
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: sizeConverter(44),
      width: '100%',
    },
    text: {
      fontSize: sizeConverter(40),
    },
  });

  return (
    <View style={styles.container}>
      <ConfirmButton
        style={styles.button}
        onPress={onPressRetry}
        text={selectedLanguage.retry}
        textStyle={styles.text}
      />
      <ConfirmButton onPress={onPressHome} text={selectedLanguage.confirm} />
    </View>
  );
};

export default ResultScreen;
