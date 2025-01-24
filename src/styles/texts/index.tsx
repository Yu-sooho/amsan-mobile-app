import {Platform, TextStyle} from 'react-native';

const customFonts = {
  bold: Platform.OS === 'ios' ? 'GangwonEduAllBold' : '강원교육모두 Bold',
  light: Platform.OS === 'ios' ? 'GangwonEduAllLight' : '강원교육모두 Light',
  saeum: Platform.OS === 'ios' ? 'GangwonEduSaeeumMedium' : '강원교육새음',
  power: Platform.OS === 'ios' ? 'GangwonEduPowerExtraBold' : '강원교육튼튼',
  hyeonok:
    Platform.OS === 'ios' ? 'GangwonEduHyeonokTMedium' : '강원교육현옥샘',
};

const defaultText: TextStyle = {
  fontFamily: customFonts.bold,
  color: 'red',
};

const textStyles = {
  defaultText,
};

export default textStyles;
