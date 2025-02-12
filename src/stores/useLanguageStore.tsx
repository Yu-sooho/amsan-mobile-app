import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LanguageProps} from '../types/LanguageTypes';
import {language} from '../resources';
import useAppStateStore from './useAppStateStore';

interface LanguageState {
  selectedLanguage: LanguageProps;
  selectLanguage: (language: LanguageProps) => void;
}

const useLanguageStore = create<LanguageState>()(
  persist(
    set => ({
      selectedLanguage: language.kor,
      selectLanguage: (language: LanguageProps) =>
        set(() => ({selectedLanguage: language})),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        if (state) {
          useAppStateStore.getState().setHydrated('useLanguageStore');
        }
      },
      partialize: state =>
        ({
          selectedLanguage: state.selectedLanguage,
        }) as Partial<LanguageState>,
    },
  ),
);

export default useLanguageStore;
