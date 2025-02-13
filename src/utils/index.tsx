import {Dimensions} from 'react-native';
import Toast, {ToastPosition, ToastType} from 'react-native-toast-message';
import {PlayType, QuestionType} from '../types';
import {Timestamp} from '@react-native-firebase/firestore';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const sizeConverter = (baseValue: number): number => {
  const widthRatio = SCREEN_WIDTH / BASE_WIDTH;
  const heightRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  const scaleFactor = Math.min(widthRatio, heightRatio);

  return baseValue * scaleFactor;
};

type ToastProps = {
  type?: ToastType;
  position?: ToastPosition;
  text: string;
};

export const showToast = ({
  type = 'customToast',
  text,
  position = 'bottom',
}: ToastProps) => {
  Toast.show({
    type,
    props: {text},
    position, // 하단 위치 설정
  });
};

export const getRandomInt = ({min, max}: {min: number; max: number}) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

type QuestionProps = {
  operation: PlayType;
  level: number;
  term: number;
};

export const createQuestion = ({
  operation,
  level,
  term,
}: QuestionProps): QuestionType => {
  let question, answer;
  const type: PlayType = operation;
  const numbers = []; // 항을 저장할 배열

  const min = Math.pow(10, Math.floor(level / 5));
  const max = Math.pow(10, Math.ceil(level / 4));

  const operations = ['+', '-', '*', '/'];
  const questionParts = [];

  if (type === 'plus') {
    for (let i = 0; i < term; i++) {
      numbers.push(getRandomInt({min, max}));
    }
    question = numbers.join(' + ');
    answer = numbers.reduce((acc, val) => acc + val, 0);
    return {question, answer};
  }
  if (type === 'division') {
    numbers.push(getRandomInt({min, max}));
    for (let i = 1; i < term; i++) {
      const divisor = getRandomInt({min: 2, max: Math.max(2, max / 5)});
      numbers.push(divisor);
    }
    question = numbers.join(' ÷ ');
    answer = parseFloat(numbers.reduce((acc, val) => acc / val).toFixed(2));
    return {question, answer};
  }

  if (type === 'subtraction') {
    for (let i = 0; i < term; i++) {
      numbers.push(getRandomInt({min, max}));
    }
    question = numbers.join(' - ');
    answer = numbers.reduce((acc, val) => acc - val);
    return {question, answer};
  }

  if (type === 'multiply') {
    for (let i = 0; i < term; i++) {
      numbers.push(getRandomInt({min, max}));
    }
    question = numbers.join(' × ');
    answer = numbers.reduce((acc, val) => acc * val, 1);
    return {question, answer};
  }

  for (let i = 0; i < term; i++) {
    const num = getRandomInt({min, max});
    questionParts.push(num);

    if (i < term - 1) {
      const operation =
        operations[getRandomInt({min: 0, max: operations.length - 1})];
      questionParts.push(operation);
    }
  }

  question = questionParts.join(' ');
  answer = eval(question);

  return {question, answer};
};

type TimestampFormat = {
  year: string;
  month: string;
  day: string;
  hours: string;
  minutes: string;
};

export const formatTimestamp = (
  timestamp: Timestamp | null,
): TimestampFormat | null => {
  if (!timestamp) return null;

  const date = timestamp.toDate();
  const year = `${date.getFullYear()}`;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return {year, month, day, hours, minutes};
};

export const getRandomMathNickname = (): string => {
  const adjectives = [
    '빠른',
    '영리한',
    '천재적인',
    '번개 같은',
    '우주의',
    '무한한',
    '비밀스러운',
    '헤드샷',
    '절대적인',
  ];
  const mathWords = [
    '계산기',
    '수학왕',
    '연산의 신',
    '구구단 마스터',
    '머리터짐',
    '로그천재',
    '파이브레인',
    '방정식의 왕',
    '미적분 도사',
  ];
  const symbols = ['⚡', '🔥', '🧠', '💡', '💥', '🚀', '🎯', '📚', '🔢'];

  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomMath = mathWords[Math.floor(Math.random() * mathWords.length)];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

  return `${randomSymbol} ${randomAdj}${randomMath}`;
};

export const isEmail = (value: string) => {
  const emailRegex =
    /^(?!\.)[a-zA-Z0-9._%+-]{1,64}(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(value);
};
