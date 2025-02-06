import {QuestionType} from './ComponentTypes';

export type RootStackProps = {
  MainScreen: undefined;
  SettingScreen: undefined;
  ThemeScreen: undefined;
  LanguageScreen: undefined;
  FontSizeScreen: undefined;
  PlayScreen: {operation: PlayType; level: number};
  MyInfoScreen: undefined;
  LoginScreen: undefined;
  HistoryScreen: undefined;
  RankingScreen: undefined;
  InfoEditScreen: undefined;
  ResultScreen: {
    questionsList: QuestionType[];
    operation: PlayType;
    level: number;
  };
  CustomPopupScreen: {
    onPressOk: () => void;
    title?: string;
    description?: string;
  };
  CustomModalScreen: {
    onPress: (value: string) => void;
    selectedValue: string;
    valueList: string[];
  };
};

export type PlayType =
  | 'plus'
  | 'division'
  | 'multiply'
  | 'mix'
  | 'subtraction'
  | 'custom';
