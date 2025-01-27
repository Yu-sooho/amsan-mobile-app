import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  token: string | null | undefined;
}

const useAuthStore = create(
  persist<AuthState>(
    set => ({
      isLogin: false,
      setIsLogin: (value: boolean) => set(() => ({isLogin: value})),
      token: null,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
