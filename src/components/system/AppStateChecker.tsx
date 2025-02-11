import React, {useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useAppStateStore} from '../../stores';

const AppStateChecker: React.FC = () => {
  const {setAppState} = useAppStateStore();
  const prevAppState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log(
        'App State Changed:',
        nextAppState,
        '(Previous:',
        prevAppState.current,
        ')',
      );

      if (prevAppState.current === 'background' && nextAppState === 'active') {
        console.log('✅ 앱이 백그라운드에서 포그라운드로 복귀!');
      }

      prevAppState.current = nextAppState;
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
};

export default AppStateChecker;
