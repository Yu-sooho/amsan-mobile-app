export type RootStackProps = {
  MainScreen: undefined;
  SettingScreen: undefined;
  ThemeScreen: undefined;
  LanguageScreen: undefined;
  FontSizeScreen: undefined;
  PlayScreen: {type: PlayType};
  MyInfoScreen: undefined;
  LoginScreen: undefined;
};

type PlayType =
  | 'plus'
  | 'divide'
  | 'multiply'
  | 'mix'
  | 'subtraction'
  | 'custom';
