import {ThemeProps} from '../../types';
import colors from '../colors';

const darkTheme: ThemeProps = {
  id: 'dark',
  backgourndColor: colors.c242424,
  textColor: colors.cffffff,
};

const lightTheme: ThemeProps = {
  id: 'light',
  backgourndColor: colors.cffffff,
  textColor: colors.c242424,
};

const themes = {
  darkTheme,
  lightTheme,
};

export default themes;
