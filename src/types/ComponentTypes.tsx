import {Timestamp} from '@react-native-firebase/firestore';
import {PlayType} from './NavigationTypes';
import {BasicUser} from './AuthTypes';

export type QuestionType = {
  question: string;
  answer: number;
  isCorrect?: boolean;
};

export type HistoryProps = {
  questionsList: QuestionType[];
  timestamp: Timestamp;
  id: string;
  operation: PlayType;
  correctCount: number;
} & BasicUser;
