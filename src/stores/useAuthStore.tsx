import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {CurrentUser} from '../types/AuthTypes';
import {getRandomMathNickname} from '../utils';

interface AuthState {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;

  loginData: FirebaseAuthTypes.User | null;
  setLoginData: (loginData: FirebaseAuthTypes.User | null) => void;

  userInfo: CurrentUser | null;
  setUserInfo: (user: CurrentUser | null) => void;

  isDuplicatedEmail: (email: string) => Promise<boolean>;

  updateUser: (user: CurrentUser) => Promise<CurrentUser | null>;
  postUser: (user: FirebaseAuthTypes.User) => Promise<boolean>;
  getUser: (user: FirebaseAuthTypes.User) => Promise<CurrentUser | false>;
}

const useAuthStore = create(
  persist<AuthState>(
    set => ({
      isLogin: false,
      setIsLogin: (value: boolean) => set(() => ({isLogin: value})),
      loginData: null,
      setLoginData: (loginData: FirebaseAuthTypes.User | null) =>
        set(() => ({loginData})),
      userInfo: null,
      setUserInfo: (user: CurrentUser | null) => set(() => ({userInfo: user})),
      postUser: async (user: FirebaseAuthTypes.User) => {
        try {
          const query = firestore()
            .collection('user')
            .where('uid', '==', user.uid);
          const isRegisted = await query.get();

          if (!isRegisted.empty) {
            const userDocRef = firestore()
              .collection('user')
              .doc(isRegisted.docs[0].id);
            await userDocRef.update({
              lastLogin: firestore.FieldValue.serverTimestamp(),
            });
            console.log('사용자 lastLogin이 업데이트되었습니다.');
            return true;
          }

          await firestore()
            .collection('user')
            .doc()
            .set(
              {
                uid: user.uid,
                displayName: user.displayName || getRandomMathNickname(),
                email: user.email,
                createdAt: firestore.FieldValue.serverTimestamp(),
                lastLogin: firestore.FieldValue.serverTimestamp(),
              },
              {merge: true},
            );

          console.log('사용자 정보가 Firestore에 저장되었습니다.');
        } catch (error) {
          console.error('가입 오류:', error);
        }
        return true;
      },
      isDuplicatedEmail: async (email: string) => {
        const emailCheckQuery = firestore()
          .collection('user')
          .where('email', '==', email);
        const isRegistedEmail = await emailCheckQuery.get();

        if (!isRegistedEmail.empty) {
          return true;
        }
        return false;
      },
      updateUser: async (user: CurrentUser) => {
        try {
          const query = firestore()
            .collection('user')
            .where('uid', '==', user.uid);
          const isRegisted = await query.get();

          const cleanUserData = Object.fromEntries(
            Object.entries(user).filter(([, value]) => value !== undefined),
          );

          if (!isRegisted.empty) {
            const userDocRef = firestore()
              .collection('user')
              .doc(isRegisted.docs[0].id);
            await userDocRef.update({
              ...cleanUserData,
            });

            const gerUser = await query.get();
            const userDoc = gerUser.docs[0];
            const userData = userDoc.data();

            const currentUser: CurrentUser = {
              uid: userData.uid,
              displayName: userData.displayName,
              email: userData.email,
              createdAt: userData.createdAt,
              lastLogin: userData.lastLogin,
              firebaseToken: userData.firebaseToken,
              ...userData,
            };
            console.log('updateUser success', currentUser);
            return currentUser;
          }
          console.log('noUser');
          return null;
        } catch (error) {
          console.log('updateUser error', user, error);
          return null;
        }
      },
      getUser: async (user: FirebaseAuthTypes.User) => {
        try {
          const query = firestore()
            .collection('user')
            .where('uid', '==', user.uid);

          const isRegisted = await query.get();

          if (isRegisted.empty) {
            return false;
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
            ...userData,
          };

          return currentUser;
        } catch (error) {
          console.error('Error fetching history:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
