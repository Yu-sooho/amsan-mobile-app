export type LanguageTypes = {
  kor: LanguageProps;
  eng: LanguageProps;
};

export type LanguageProps = {
  id: 'kor' | 'eng';
  // screen
  settingScreen: string;

  // components
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
  logout: string;
  confirm: string;
  result: string;
  retry: string;
  history: string;

  // Toast Message
  logintError: string;
  serverError: string;
  noHistoryList: string;
};
