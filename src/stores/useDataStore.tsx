import {create} from 'zustand';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {HistoryProps, PlayType, QuestionType} from '../types';
import useAuthStore from './useAuthStore';

interface DataState {
  updateHistory: (
    questionsList: QuestionType[],
    operation: PlayType,
  ) => Promise<boolean>;
  getHistory: (
    pageSize?: number,
    lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot | undefined | null,
  ) => Promise<
    | {
        historyData: HistoryProps[];
        lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null;
      }
    | undefined
  >;
  getRanking: (
    operation: PlayType,
    pageSize?: number,
    lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot | undefined | null,
  ) => Promise<
    | {
        rankingData: HistoryProps[];
        lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null;
      }
    | undefined
  >;
}

const useDataStore = create<DataState>(() => ({
  updateHistory: async (questionsList, operation) => {
    try {
      const {loginData} = useAuthStore.getState();

      if (!loginData) {
        console.log('User is not logged in.');
        return false;
      }

      const correctCount = Array.isArray(questionsList)
        ? questionsList.filter(q => q.isCorrect).length
        : 0;

      await firestore().collection('history').doc().set(
        {
          uid: loginData.uid,
          questionsList,
          timestamp: firestore.FieldValue.serverTimestamp(),
          operation: operation,
          correctCount,
        },
        {merge: true},
      );

      console.log('History updated for user:', loginData.uid);
      return true;
    } catch (error) {
      console.log('updateHistory error', error);
      return false;
    }
  },

  getHistory: async (pageSize = 20, lastDoc = null) => {
    try {
      const {loginData} = useAuthStore.getState();
      if (!loginData) {
        console.log('User is not logged in.');
        return undefined;
      }

      let query = firestore()
        .collection('history')
        .where('uid', '==', loginData.uid)
        .orderBy('timestamp', 'desc')
        .limit(pageSize);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        return {historyData: [], lastDoc: null};
      }

      const historyData: HistoryProps[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        questionsList: doc.data().questionsList ?? [],
        timestamp: doc.data().timestamp ?? firestore.Timestamp.now(),
        operation: doc.data().operation,
        correctCount: doc.data().correctCount,
      }));

      const lastVisibleDoc =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const historys = {historyData, lastDoc: lastVisibleDoc};
      console.log('getHistory', historys);
      return historys;
    } catch (error) {
      console.error('Error fetching history:', error);
      return undefined;
    }
  },

  getRanking: async (operation, pageSize = 20, lastDoc = null) => {
    try {
      const {loginData} = useAuthStore.getState();
      if (!loginData) {
        console.log('User is not logged in.');
        return undefined;
      }
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
      );

      const startTimestamp = firestore.Timestamp.fromDate(startDate);
      const endTimestamp = firestore.Timestamp.fromDate(endDate);
      console.log(operation, startTimestamp, endTimestamp, pageSize, 'FUFU');

      let query = firestore()
        .collection('history')
        .where('operation', '==', operation)
        .where('timestamp', '>=', startTimestamp)
        .where('timestamp', '<=', endTimestamp)
        .orderBy('timestamp', 'desc')
        .orderBy('correctCount', 'desc')
        .limit(pageSize);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        return {rankingData: [], lastDoc: null};
      }

      const rankingData: HistoryProps[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        questionsList: doc.data().questionsList ?? [],
        timestamp: doc.data().timestamp ?? firestore.Timestamp.now(),
        operation: doc.data().operation,
        correctCount: doc.data().correctCount,
      }));

      const lastVisibleDoc =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return {rankingData, lastDoc: lastVisibleDoc};
    } catch (error) {
      console.error('Error fetching history:', error);
      return undefined;
    }
  },
}));

export default useDataStore;
