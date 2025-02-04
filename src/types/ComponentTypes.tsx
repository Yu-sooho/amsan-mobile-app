import {Timestamp} from '@react-native-firebase/firestore';

export type QuestionType = {
  question: string;
  answer: number;
  isCorrect: boolean;
};

export type HistoryProps = {
  questionsList: QuestionType[];
  timestamp: Timestamp;
  id: string;
};
