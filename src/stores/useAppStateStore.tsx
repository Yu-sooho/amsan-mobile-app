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
  isFirstStart: boolean;
  setIsFirstStart: (value: boolean) => void;
  hydratedStores: string[];
  setHydrated: (storeName: string) => void;
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
      isFirstStart: false,
      setIsFirstStart: value => set(() => ({isFirstStart: value})),
      hydratedStores: [],
      setHydrated: (storeName: string) =>
        set(state => ({
          hydratedStores: Array.from(
            new Set([...state.hydratedStores, storeName]),
          ),
        })),
    }),
    {
      name: 'appState-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        if (state) {
          state.setHydrated('useAppStateStore');
        }
      },
      partialize: state =>
        ({
          playCount: state.playCount,
          isFirstStart: state.isFirstStart,
        }) as Partial<AppState>,
    },
  ),
);

export default useAppStateStore;
