import {LanguageProps} from '../types/LanguageTypes';

const eng: LanguageProps = {
  id: 'eng',
  settingScreen: 'Setting',
  theme: 'Theme',
  language: 'Language',
  fontSize: 'Font size',
  dark: 'dark',
  light: 'light',
  eng: 'eng',
  kor: 'kor',
  plus: 'plus',
  division: 'division',
  subtraction: 'subtraction',
  multiply: 'multiply',
  mix: 'mix',
  custom: 'custom',
  myInfo: 'My Info',
  ranking: 'ranking',
};

const kor: LanguageProps = {
  id: 'kor',
  settingScreen: '설정',
  theme: '테마',
  language: '언어',
  fontSize: '글자 크기',
  dark: '다크',
  light: '라이트',
  eng: '영어',
  kor: '한국어',
  plus: '더하기',
  division: '나누기',
  subtraction: '빼기',
  multiply: '곱하기',
  mix: '혼합',
  custom: '커스텀',
  myInfo: '내 정보',
  ranking: '랭킹',
};

const language = {
  kor,
  eng,
};

export default language;
