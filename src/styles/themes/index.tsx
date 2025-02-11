import {ThemeProps} from '../../types';
import colors from '../colors';

const darkTheme: ThemeProps = {
  id: 'dark',
  backgourndColor: colors.c242424,
  textColor: colors.cffffff,
  placeholderColor: colors.cd4d4d4,
  wrongColor: colors.cea4653,
  backgourndColorOpacity: colors.c24242480,
  switchTrue: colors.c34c759,
  switchFalse: colors.ce5e5ea,
};

const lightTheme: ThemeProps = {
  id: 'light',
  backgourndColor: colors.cffffff,
  textColor: colors.c242424,
  placeholderColor: colors.cd4d4d4,
  wrongColor: colors.cea4653,
  backgourndColorOpacity: colors.c24242480,
  switchTrue: colors.c34c759,
  switchFalse: colors.ce5e5ea,
};

const themes = {
  darkTheme,
  lightTheme,
};

export default themes;
