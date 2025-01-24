import {ThemeProps} from '../../types';
import colors from '../colors';

const darkTheme: ThemeProps = {
  backgourndColor: colors.c242424,
  textColor: colors.cffffff,
};

const lightTheme: ThemeProps = {
  backgourndColor: colors.cffffff,
  textColor: colors.c242424,
};

const themes = {
  darkTheme,
  lightTheme,
};

export default themes;
