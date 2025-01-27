import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeProps} from '../types';
import themes from '../styles/themes';

interface ThemeState {
  selectedTheme: ThemeProps;
  selectTheme: (theme: ThemeProps) => void;
  fontSize: number;
  setFontSize: (fontSize: number) => void;
}

const useThemeStore = create(
  persist<ThemeState>(
    set => ({
      selectedTheme: themes.darkTheme,
      selectTheme: (theme: ThemeProps) => set(() => ({selectedTheme: theme})),
      fontSize: 1,
      setFontSize: (fontSize: number) => set(() => ({fontSize: fontSize})),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useThemeStore;
