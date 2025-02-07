import React, {useRef} from 'react';
import {Platform, View} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  useForeground,
} from 'react-native-google-mobile-ads';

const BANNER_IOS = 'ca-app-pub-6937581814544685/5573707569';
const BANNER_AND = 'ca-app-pub-6937581814544685/4675784200';
const BANNER_ID = Platform.OS === 'ios' ? BANNER_IOS : BANNER_AND;

const BannerAds: React.FC = () => {
  const bannerRef = useRef<BannerAd>(null);

  useForeground(() => {
    bannerRef.current?.load();
  });

  return (
    <View>
      <BannerAd
        unitId={TestIds.BANNER || BANNER_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
};

export default BannerAds;
