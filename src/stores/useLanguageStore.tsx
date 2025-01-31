import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LanguageProps} from '../types/LanguageTypes';
import {language} from '../resources';

interface LanguageState {
  selectedLanguage: LanguageProps;
  selectLanguage: (language: LanguageProps) => void;
}

const useLanguageStore = create(
  persist<LanguageState>(
    set => ({
      selectedLanguage: language.kor,
      selectLanguage: (language: LanguageProps) =>
        set(() => ({selectedLanguage: language})),
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useLanguageStore;
