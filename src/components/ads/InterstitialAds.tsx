import React, {useEffect, useState} from 'react';
import {Platform, StatusBar} from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {useAppStateStore} from '../../stores';

const BANNER_IOS = 'ca-app-pub-6937581814544685/2428136643';
const BANNER_AND = 'ca-app-pub-6937581814544685/8222215346';
const BANNER_ID = Platform.OS === 'ios' ? BANNER_IOS : BANNER_AND;

const interstitial = InterstitialAd.createForAdRequest(
  TestIds.INTERSTITIAL || BANNER_ID,
);

const InterstitialAds: React.FC = () => {
  const {playCount} = useAppStateStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeOpened = interstitial.addAdEventListener(
      AdEventType.OPENED,
      () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(true);
        }
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(false);
        }
        setLoaded(false);
      },
    );

    return () => {
      unsubscribeLoaded();
      unsubscribeOpened();
      unsubscribeClosed();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      interstitial.show();
    }
  }, [loaded]);

  useEffect(() => {
    if (playCount !== 0 && playCount % 3 === 0) {
      interstitial.load();
    }
  }, [playCount]);

  return null;
};

export default InterstitialAds;
