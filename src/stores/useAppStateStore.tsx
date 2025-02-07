import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AppState {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  playCount: number;
  setPlayCount: (value: number) => void;
}

const useAppStateStore = create<AppState>()(
  persist(
    set => ({
      isLoading: false,
      setIsLoading: value => set(() => ({isLoading: value})),
      playCount: 0,
      setPlayCount: value => set(() => ({playCount: value})),
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
