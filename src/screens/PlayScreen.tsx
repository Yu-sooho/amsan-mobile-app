import React, {Ref, useEffect, useRef, useState} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {CustomHeader, IconClose} from '../components';
import {
  Dimensions,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {useLanguageStore, useThemeStore} from '../stores';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackProps} from '../types/NavigationTypes';
import {useTextStyles} from '../styles';
import {createQuestion, sizeConverter} from '../utils';
import {LanguageProps, QuestionType} from '../types';

const TIMER = 120;

type PlayScreenProps = StackScreenProps<RootStackProps, 'PlayScreen'>;

const PlayScreen: React.FC<PlayScreenProps> = ({navigation, route}) => {
  const {operation, level} = route.params;
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {font16Bold} = useTextStyles();
  const {top, bottom} = useSafeAreaInsets();
  const [isStarted, setIsStarted] = useState(false);
  const [isPendding, setIsPendding] = useState(false);
  const [time, setTime] = useState(3);
  const [inputAnswer, setInputAnswer] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const questionInfoRef = useRef<QuestionType | null>(null);
  const questionsListRef = useRef<QuestionType[]>([]);

  const inputRef = useRef<TextInput | null>(null);

  const CONTENT_HEIGHT =
    Dimensions.get('window').height -
    top -
    bottom -
    sizeConverter(44) -
    sizeConverter(44);
  const CONTENT_WIDTH = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    answerView: {},
    confirmButton: {
      alignItems: 'center',
      height: sizeConverter(56),
      justifyContent: 'center',
      width: CONTENT_WIDTH,
    },
    confirmText: {
      ...font16Bold,
    },
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    content: {
      alignItems: 'center',
      height: CONTENT_HEIGHT,
      justifyContent: 'center',
      paddingBottom: sizeConverter(24),
      width: CONTENT_WIDTH,
    },
  });

  useEffect(() => {
    if (!isPendding) return;
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsStarted(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPendding]);

  const onPressInput = () => {
    if (inputRef.current?.isFocused()) {
      inputRef.current?.blur();
      return;
    }
    inputRef.current?.focus();
  };

  const onPressClose = () => {
    navigation.goBack();
  };

  const onPressStart = () => {
    setIsPendding(true);
  };

  const onChangeText = (text: string) => {
    setIsWrong(false);
    setInputAnswer(text);
  };

  const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    console.log('onBlur Input', e);
    // const answer = `${questionInfoRef.current?.answer}`;
    // if (inputAnswer === answer) {
    //   createNewQuestion();
    // }
  };

  const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    console.log('onFocus Input', e);
    setInputAnswer('');
  };

  const createNewQuestion = () => {
    const questionInfo = createQuestion({
      operation: operation,
      level: level,
      term: 2,
    });
    questionInfoRef.current = questionInfo;
  };

  useEffect(() => {
    createNewQuestion();
  }, []);

  const onPressConfirm = () => {
    if (!questionInfoRef.current || isEnded) return;
    const answer = `${questionInfoRef.current.answer}`;
    if (inputAnswer !== answer) {
      setIsWrong(true);
      const wrongQuestion: QuestionType = {
        question: questionInfoRef.current.question,
        answer: parseFloat(inputAnswer),
        isCorrect: false,
      };
      const find = questionsListRef.current.findIndex(element => {
        return (
          element.question === wrongQuestion.question &&
          element.answer === wrongQuestion.answer
        );
      });

      if (find < 0) {
        questionsListRef.current.push(wrongQuestion);
      }
      return;
    }

    const correctQuestion: QuestionType = {
      ...questionInfoRef.current,
      isCorrect: true,
    };
    questionsListRef.current.push(correctQuestion);
    createNewQuestion();
    setInputAnswer('');
  };

  const endedTimer = () => {
    setIsEnded(true);
    navigation.navigate('ResultScreen', {
      questionsList: questionsListRef.current,
      operation,
      level,
    });
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        isHaveBack={false}
        isHaveOption={false}
        leftContent={() => LeftContent({onPressClose})}
        rightContent={() =>
          RightContent({isStarted: isStarted, endedTimer: endedTimer})
        }
        title={selectedLanguage[operation as keyof LanguageProps]}
      />
      {isStarted ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          <ScrollView>
            <TouchableOpacity onPress={onPressInput} style={styles.content}>
              <Question question={`${questionInfoRef.current?.question}`} />
              <Answer
                onBlur={onBlur}
                onFocus={onFocus}
                inputAnswer={inputAnswer}
                inputRef={inputRef}
                onChangeText={onChangeText}
                isWrong={isWrong}
              />
            </TouchableOpacity>
          </ScrollView>
          <View style={{justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={onPressConfirm}
              style={styles.confirmButton}>
              <Text style={styles.confirmText}>{selectedLanguage.confirm}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      ) : isPendding ? (
        <PenddingView text={`${time}`} />
      ) : (
        <StartButton onPressStart={onPressStart} />
      )}
    </SafeAreaView>
  );
};

const PenddingView = ({text}: {text: string}) => {
  const {font20Bold} = useTextStyles();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingBottom: sizeConverter(120),
    },
    text: {
      ...font20Bold,
      fontSize: sizeConverter(60),
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const StartButton = ({onPressStart}: {onPressStart: () => void}) => {
  const {font20Bold} = useTextStyles();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      paddingBottom: sizeConverter(120),
    },
    text: {
      ...font20Bold,
      fontSize: sizeConverter(60),
    },
  });
  return (
    <TouchableOpacity style={styles.container} onPress={onPressStart}>
      <Text style={styles.text}>{'Start'}</Text>
    </TouchableOpacity>
  );
};

const LeftContent = ({onPressClose}: {onPressClose: () => void}) => {
  const styles = StyleSheet.create({
    leftContent: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingLeft: sizeConverter(8),
      width: sizeConverter(44),
    },
  });
  return (
    <TouchableOpacity onPress={onPressClose} style={styles.leftContent}>
      <IconClose size={sizeConverter(30)} />
    </TouchableOpacity>
  );
};

const RightContent = ({
  isStarted,
  endedTimer,
}: {
  isStarted: boolean;
  endedTimer: () => void;
}) => {
  const [time, setTime] = useState(TIMER);
  const {font20Bold} = useTextStyles();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingRight: sizeConverter(8),
      width: sizeConverter(44),
    },
    text: {
      ...font20Bold,
    },
  });

  useEffect(() => {
    if (!isStarted) return;
    const interval = setInterval(() => {
      setTime(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          endedTimer();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{time}</Text>
    </View>
  );
};

type QuestionProps = {
  question: string;
};

const Question: React.FC<QuestionProps> = ({question}) => {
  const {font20Bold} = useTextStyles();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: sizeConverter(12),
    },
    text: {
      ...font20Bold,
      fontSize: sizeConverter(55),
      maxWidth: sizeConverter(280),
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question}</Text>
    </View>
  );
};

const Answer: React.FC<{
  inputRef: Ref<TextInput>;
  inputAnswer: string;
  onChangeText: ((text: string) => void) | undefined;
  onBlur:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  onFocus:
    | ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    | undefined;
  isWrong: boolean;
}> = ({inputRef, inputAnswer, onChangeText, onFocus, onBlur, isWrong}) => {
  const {selectedTheme} = useThemeStore();
  const {font20Bold} = useTextStyles();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      borderBottomColor: isWrong
        ? selectedTheme.wrongColor
        : selectedTheme.textColor,
      borderBottomWidth: sizeConverter(1),
      justifyContent: 'center',
      maxWidth: sizeConverter(280),
      minWidth: sizeConverter(120),
      paddingHorizontal: sizeConverter(12),
    },
    text: {
      ...font20Bold,
      fontSize: sizeConverter(40),
      textAlign: 'center',
      width: sizeConverter(280),
    },
    wrongText: {
      ...font20Bold,
      color: selectedTheme.wrongColor,
      fontSize: sizeConverter(40),
      textAlign: 'center',
      width: sizeConverter(280),
    },
  });

  return (
    <View style={styles.container}>
      <TextInput
        onBlur={onBlur}
        onFocus={onFocus}
        value={inputAnswer}
        onChangeText={onChangeText}
        keyboardType={'numeric'}
        ref={inputRef}
        style={isWrong ? styles.wrongText : styles.text}
        multiline
        placeholderTextColor={selectedTheme.placeholderColor}
      />
    </View>
  );
};

export default PlayScreen;
