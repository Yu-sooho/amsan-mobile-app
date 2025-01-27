import {Platform, TextStyle} from 'react-native';
import {sizeConverter} from '../../utils';
import {useThemeStore} from '../../stores';

const customFonts = {
  bold: Platform.OS === 'ios' ? 'GangwonEduAllBold' : '강원교육모두 Bold',
  light: Platform.OS === 'ios' ? 'GangwonEduAllLight' : '강원교육모두 Light',
  saeum: Platform.OS === 'ios' ? 'GangwonEduSaeeumMedium' : '강원교육새음',
  power: Platform.OS === 'ios' ? 'GangwonEduPowerExtraBold' : '강원교육튼튼',
  hyeonok:
    Platform.OS === 'ios' ? 'GangwonEduHyeonokTMedium' : '강원교육현옥샘',
};

export const useTextStyles = () => {
  const {selectedTheme, fontSize} = useThemeStore();

  const font14Bold: TextStyle = {
    fontFamily: customFonts.bold,
    fontSize: sizeConverter(14) + fontSize,
    includeFontPadding: false,
    color: selectedTheme.textColor,
  };

  const font16Bold: TextStyle = {
    fontFamily: customFonts.bold,
    fontSize: sizeConverter(16) + fontSize,
    includeFontPadding: false,
    color: selectedTheme.textColor,
  };

  const font18Bold: TextStyle = {
    fontFamily: customFonts.bold,
    fontSize: sizeConverter(17) + fontSize,
    includeFontPadding: false,
    color: selectedTheme.textColor,
  };

  const font20Bold: TextStyle = {
    fontFamily: customFonts.bold,
    fontSize: sizeConverter(20) + fontSize,
    includeFontPadding: false,
    color: selectedTheme.textColor,
  };

  return {
    font14Bold,
    font16Bold,
    font18Bold,
    font20Bold,
  };
};

export default useTextStyles;
