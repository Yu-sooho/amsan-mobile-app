export type LanguageTypes = {
  kor: LanguageProps;
  eng: LanguageProps;
};

export type LanguageProps = {
  id: 'kor' | 'eng';
  settingScreen: string;
  theme: string;
  language: string;
  fontSize: string;
  dark: string;
  light: string;
  eng: string;
  kor: string;
  plus: string;
  division: string;
  subtraction: string;
  multiply: string;
  mix: string;
  custom: string;
  myInfo: string;
  ranking: string;
};
