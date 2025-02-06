import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface AppState {
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

const useAppStateStore = create<AppState>()(
  persist(
    set => ({
      isLoading: false,
      setIsLoading: value => set(() => ({isLoading: value})),
    }),
    {
      name: 'appState-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state =>
        ({
          isLoading: state.isLoading,
        }) as Partial<AppState>,
    },
  ),
);

export default useAppStateStore;
