export type LanguageTypes = {
  kor: LanguageProps;
  eng: LanguageProps;
};

export type LanguageId = 'kor' | 'eng';

export type LanguageProps = {
  id: LanguageId;
  // screen
  settingScreen: string;
  infoEditScreen: string;

  // components
  theme: string;
  language: string;
  fontSize: string;
  alram: string;
  dark: string;
  light: string;
  eng: string;
  kor: string;
  plus: string;
  division: string;
  subtraction: string;
  multiply: string;
  mix: string;
  myInfo: string;
  info: string;
  ranking: string;
  logout: string;
  confirm: string;
  result: string;
  retry: string;
  history: string;
  cancel: string;
  email: string;
  name: string;
  save: string;

  // Toast Message
  loginError: string;
  serverError: string;
  noHistoryList: string;
  noRankingList: string;
  failedEdit: string;
  successEdit: string;
  duplicatedEmail: string;
  haveToLogin: string;

  //Popup Message
  isLogout: string;
  noNetwork: string;
};
