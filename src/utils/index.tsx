import {Dimensions} from 'react-native';
import Toast, {ToastPosition, ToastType} from 'react-native-toast-message';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

export const sizeConverter = (baseValue: number): number => {
  const widthRatio = SCREEN_WIDTH / BASE_WIDTH;
  const heightRatio = SCREEN_HEIGHT / BASE_HEIGHT;
  const scaleFactor = Math.min(widthRatio, heightRatio);

  return baseValue * scaleFactor;
};

type ToastProps = {
  type?: ToastType;
  position?: ToastPosition;
  text: string;
};

export const showToast = ({
  type = 'customToast',
  text,
  position = 'bottom',
}: ToastProps) => {
  Toast.show({
    type,
    props: {text},
    position, // 하단 위치 설정
  });
};
