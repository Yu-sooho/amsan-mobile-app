import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppStateStatus} from 'react-native';
interface AppState {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  playCount: number;
  setPlayCount: (value: number) => void;
  appState: AppStateStatus;
  setAppState: (value: AppStateStatus) => void;
}

const useAppStateStore = create<AppState>()(
  persist(
    set => ({
      isLoading: false,
      setIsLoading: value => set(() => ({isLoading: value})),
      playCount: 5,
      setPlayCount: value => set(() => ({playCount: value})),
      appState: 'active',
      setAppState: (value: AppStateStatus) => set(() => ({appState: value})),
    }),
    {
      name: 'appState-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state =>
        ({
          playCount: state.playCount,
        }) as Partial<AppState>,
    },
  ),
);

export default useAppStateStore;
