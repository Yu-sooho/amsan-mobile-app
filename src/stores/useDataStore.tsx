import {create} from 'zustand';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {HistoryProps, QuestionType} from '../types';
import useAuthStore from './useAuthStore';

interface DataState {
  updateHistory: (questionsList: QuestionType[]) => Promise<void>;
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
}

const useDataStore = create<DataState>(() => ({
  updateHistory: async questionsList => {
    try {
      const {user} = useAuthStore.getState();

      if (!user) {
        console.log('User is not logged in.');
        return;
      }

      await firestore().collection('history').doc().set(
        {
          uid: user.uid,
          questionsList,
          timestamp: firestore.FieldValue.serverTimestamp(),
        },
        {merge: true},
      );

      console.log('History updated for user:', user.uid);
    } catch (error) {
      console.log('updateHistory error', error);
    }
  },

  getHistory: async (pageSize = 20, lastDoc = null) => {
    try {
      const {user} = useAuthStore.getState();
      if (!user) {
        console.log('User is not logged in.');
        return undefined;
      }

      let query = firestore()
        .collection('history')
        .where('uid', '==', user.uid)
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
      }));

      const lastVisibleDoc =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return {historyData, lastDoc: lastVisibleDoc};
    } catch (error) {
      console.error('Error fetching history:', error);
      return undefined;
    }
  },
}));

export default useDataStore;
