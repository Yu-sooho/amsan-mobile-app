import {create} from 'zustand';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {HistoryProps, PlayType, QuestionType} from '../types';
import useAuthStore from './useAuthStore';
import storage from '@react-native-firebase/storage';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {Platform} from 'react-native';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CurrentUser} from '../types/AuthTypes';
import useAppStateStore from './useAppStateStore';

interface DataState {
  selectedSortType: string;
  setSelectedSortType: (sortType: string) => void;
  updateHistory: (
    questionsList: QuestionType[],
    operation: PlayType,
  ) => Promise<boolean>;
  getMyLeaderboard: (operation: string) => Promise<HistoryProps | undefined>;
  updateLeaderboard: (
    questionsList: QuestionType[],
    operation: PlayType,
  ) => Promise<boolean>;
  uploadImage: (pathToFile: string) => Promise<string[] | undefined>;
  getHistory: (
    pageSize?: number,
    lastDoc?: FirebaseFirestoreTypes.DocumentSnapshot | undefined | null,
    uid?: string,
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

  getOtherUser: (uid: string) => Promise<CurrentUser | undefined>;
}

const useDataStore = create<DataState>()(
  persist(
    set => ({
      selectedSortType: 'mix',
      setSelectedSortType: (value: string) =>
        set(() => ({selectedSortType: value})),
      updateHistory: async (questionsList, operation) => {
        try {
          const {userInfo} = useAuthStore.getState();

          if (!userInfo) {
            console.log('User is not logged in.');
            return false;
          }

          const correctCount = Array.isArray(questionsList)
            ? questionsList.filter(q => q.isCorrect).length
            : 0;

          await firestore()
            .collection('history')
            .doc()
            .set(
              {
                questionsList,
                timestamp: firestore.FieldValue.serverTimestamp(),
                operation: operation,
                correctCount,
                displayName: userInfo.displayName,
                profileImageUrl:
                  userInfo.profileImageUrl256 ||
                  userInfo.profileImageUrl512 ||
                  userInfo.profileImageUrl128 ||
                  userInfo.profileImageUrl ||
                  '',
                uid: userInfo.uid,
              },
              {merge: true},
            );

          console.log('History updated for user:', userInfo.uid);
          return true;
        } catch (error) {
          console.log('updateHistory error', error);
          return false;
        }
      },
      getMyLeaderboard: async operation => {
        const {userInfo} = useAuthStore.getState();
        if (!userInfo) {
          console.log('getMyLeaderboard 로그인 실패');
          return undefined;
        }

        try {
          const querySnapshot = await firestore()
            .collection('leaderboard')
            .where('uid', '==', userInfo.uid)
            .where('operation', '==', operation)
            .orderBy('correctCount', 'desc')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

          if (querySnapshot.empty) {
            console.log('getMyLeaderboard 데이터 없음');
            return undefined;
          }

          const bestHistoryDoc = querySnapshot.docs[0];
          if (!bestHistoryDoc.exists) {
            console.log('getMyLeaderboard 데이터 없음');
            return undefined;
          }

          const bestHistory = bestHistoryDoc.data();

          console.log('getMyLeaderboard 데이터 있음', bestHistory);

          const result: HistoryProps = {
            id: bestHistoryDoc.id,
            questionsList: bestHistory.questionsList ?? [],
            timestamp: bestHistory.timestamp ?? firestore.Timestamp.now(),
            operation: bestHistory.operation,
            correctCount: bestHistory.correctCount,
            displayName: bestHistory.displayName,
            profileImageUrl:
              bestHistory.profileImageUrl256 ||
              bestHistory.profileImageUrl512 ||
              bestHistory.profileImageUrl128 ||
              bestHistory.profileImageUrl,
            uid: bestHistory.uid,
          };

          return result;
        } catch (error) {
          console.log(error);
          return undefined;
        }
      },
      updateLeaderboard: async (questionsList, operation) => {
        try {
          const {userInfo} = useAuthStore.getState();
          const {getMyLeaderboard} = useDataStore.getState();

          if (!userInfo) {
            console.log('updateLeaderboard 로그인 실패');
            return false;
          }

          const myLearderBoader = await getMyLeaderboard(operation);

          const correctCount = Array.isArray(questionsList)
            ? questionsList.filter(q => q.isCorrect).length
            : 0;

          if (myLearderBoader && myLearderBoader.correctCount >= correctCount) {
            console.log('updateLeaderboard 더 높은 데이터가 있습니다.');
            return false;
          }

          if (myLearderBoader && myLearderBoader.correctCount < correctCount) {
            console.log('updateLeaderboard 이전 데이터가 삭제되었습니다.');
            await firestore()
              .collection('leaderboard')
              .doc(myLearderBoader.id)
              .delete();
          }

          const learderBoard = {
            questionsList,
            operation: operation,
            correctCount,
            displayName: userInfo.displayName,
            profileImageUrl:
              userInfo.profileImageUrl256 ||
              userInfo.profileImageUrl512 ||
              userInfo.profileImageUrl128 ||
              userInfo.profileImageUrl ||
              '',
            uid: userInfo.uid,
          };

          await firestore()
            .collection('leaderboard')
            .doc()
            .set(
              {
                ...learderBoard,
                timestamp: firestore.FieldValue.serverTimestamp(),
              },
              {merge: true},
            );

          console.log('updateLeaderboard 기록 경신:', learderBoard);
          return true;
        } catch (error) {
          console.log('updateLeaderboard error', error);
          return false;
        }
      },
      uploadImage: async (pathToFile: string) => {
        try {
          const {loginData} = useAuthStore.getState();
          if (!loginData) {
            console.log('User is not logged in.');
            return undefined;
          }
          const fileNames = [];
          const fileExtension = pathToFile.split('.').pop() || '';
          const re = await storage()
            .ref(`profiles/${loginData.uid}.${fileExtension}`)
            .putFile(pathToFile);
          fileNames.push(
            Platform.OS === 'android' ? re.metadata.fullPath : re.metadata.name,
          );
          const thumbnailSizes = [128, 256, 512];
          for (const size of thumbnailSizes) {
            const resizedImage = await ImageResizer.createResizedImage(
              pathToFile,
              size,
              size,
              'JPEG',
              90,
              0,
              undefined,
              false,
              {mode: 'contain'},
            );

            const thumbnailPath = `profiles/${loginData.uid}_${size}.${fileExtension}`;
            const reuslt = await storage()
              .ref(thumbnailPath)
              .putFile(resizedImage.uri);
            fileNames.push(
              Platform.OS === 'android'
                ? reuslt.metadata.fullPath
                : reuslt.metadata.name,
            );
          }

          console.log('업로드 완료', fileNames);

          const urls = [];
          for (const name of fileNames) {
            const url = await storage().ref(name).getDownloadURL();
            urls.push(url);
          }

          return urls;
        } catch (error) {
          console.log(error);
          return undefined;
        }
      },
      getHistory: async (pageSize = 20, lastDoc = null, uid) => {
        try {
          const {loginData} = useAuthStore.getState();
          if (!loginData) {
            console.log('User is not logged in.');
            return undefined;
          }

          let query = firestore()
            .collection('history')
            .where('uid', '==', uid || loginData.uid)
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
            displayName: doc.data().displayName,
            profileImageUrl:
              doc.data().profileImageUrl256 ||
              doc.data().profileImageUrl512 ||
              doc.data().profileImageUrl128 ||
              doc.data().profileImageUrl,
            uid: doc.data().uid,
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

      getRanking: async (operation, pageSize = 30, lastDoc = null) => {
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

          let query = firestore()
            .collection('leaderboard')
            .orderBy('correctCount', 'desc')
            .orderBy('timestamp', 'desc')
            .where('operation', '==', operation)
            .where('timestamp', '>=', startTimestamp)
            .where('timestamp', '<=', endTimestamp)
            .limit(pageSize);

          if (lastDoc) {
            query = query.startAfter(lastDoc);
          }

          const querySnapshot = await query.get();

          console.log(querySnapshot);

          if (querySnapshot.empty) {
            return {rankingData: [], lastDoc: null};
          }

          const rankingData: HistoryProps[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            questionsList: doc.data().questionsList ?? [],
            timestamp: doc.data().timestamp ?? firestore.Timestamp.now(),
            operation: doc.data().operation,
            correctCount: doc.data().correctCount,
            displayName: doc.data().displayName,
            profileImageUrl:
              doc.data().profileImageUrl256 ||
              doc.data().profileImageUrl512 ||
              doc.data().profileImageUrl128 ||
              doc.data().profileImageUrl,
            uid: doc.data().uid,
          }));

          rankingData.sort((a, b) => b.correctCount - a.correctCount);

          const lastVisibleDoc =
            querySnapshot.docs[querySnapshot.docs.length - 1] || null;

          return {rankingData, lastDoc: lastVisibleDoc};
        } catch (error) {
          console.error('Error fetching history:', error);
          return undefined;
        }
      },
      getOtherUser: async (uid: string) => {
        try {
          const query = firestore().collection('user').where('uid', '==', uid);

          const isRegisted = await query.get();

          if (isRegisted.empty) {
            return undefined;
          }

          const userDoc = isRegisted.docs[0];
          const userData = userDoc.data();

          const currentUser: CurrentUser = {
            uid: userData.uid,
            displayName: userData.displayName,
            email: userData.email,
            createdAt: userData.createdAt,
            lastLogin: userData.lastLogin,
            firebaseToken: userData.firebaseToken,
            isAgreeNotification1: userData.isAgreeNotification1,
            ...userData,
          };

          return currentUser;
        } catch (error) {
          console.error('Error fetching history:', error);
          return undefined;
        }
      },
    }),
    {
      name: 'data-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        if (state) {
          useAppStateStore.getState().setHydrated('useDataStore');
        }
      },
      partialize: state =>
        ({
          selectedSortType: state.selectedSortType,
        }) as Partial<DataState>,
    },
  ),
);

export default useDataStore;
