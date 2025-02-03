import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

interface AuthState {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  token: string | null | undefined;
  setToken: (value: string | null | undefined) => void;
  user: FirebaseAuthTypes.User | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
}

const useAuthStore = create(
  persist<AuthState>(
    set => ({
      isLogin: false,
      setIsLogin: (value: boolean) => set(() => ({isLogin: value})),
      token: null,
      setToken: (value: string | null | undefined) =>
        set(() => ({token: value})),
      user: null,
      setUser: (user: FirebaseAuthTypes.User | null) => set(() => ({user})),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
