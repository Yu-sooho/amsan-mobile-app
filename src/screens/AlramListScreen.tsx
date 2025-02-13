import React, {useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CheckButton, CustomHeader, DeleteButton} from '../components';
import {showToast, sizeConverter} from '../utils';
import {
  useAuthStore,
  useDataStore,
  useLanguageStore,
  useThemeStore,
} from '../stores';
import {NotificationProps} from '../types';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import {lotties} from '../resources';
import {useTextStyles} from '../styles';

const PAGE_SIZE = 20;

const AlramListScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {userInfo} = useAuthStore();
  const {getNotification} = useDataStore();
  const isLoading = useRef<boolean>(false);
  const isEnded = useRef<boolean>(false);
  const isRefreshing = useRef<boolean>(false);
  const [checkAlrams, setCheckAlrams] = useState<NotificationProps[]>([]);

  const [notificationList, setNotificationList] = useState<NotificationProps[]>(
    [],
  );
  const lastDoc = useRef<FirebaseFirestoreTypes.DocumentSnapshot | null>(null);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: selectedTheme.backgourndColor,
      flex: 1,
    },
    list: {
      alignItems: 'center',
      paddingBottom: sizeConverter(76),
      paddingTop: sizeConverter(24),
    },
  });

  const fetchData = async () => {
    if (isLoading.current || isEnded.current || !userInfo) return;
    isLoading.current = true;
    const data = await getNotification(
      PAGE_SIZE,
      lastDoc.current,
      userInfo?.uid,
    );
    if (!data) {
      showToast({text: selectedLanguage.serverError});
      isEnded.current = true;
      return;
    }
    if (data?.notification.length < PAGE_SIZE) isEnded.current = true;
    if (data.notification) {
      setNotificationList([...notificationList, ...data.notification]);
    }
    lastDoc.current = data.lastDoc;
    isLoading.current = false;
  };

  const onEndReached = () => {
    fetchData();
  };

  const onRefresh = async () => {
    lastDoc.current = null;
    isEnded.current = false;
    setNotificationList([]);
    isRefreshing.current = true;
  };

  useEffect(() => {
    if (isRefreshing.current === true) {
      isRefreshing.current = false;
      fetchData();
    }
  }, [isRefreshing.current]);

  const onPressCheck = (item: NotificationProps) => {
    const find = checkAlrams.find(element => element === item);
    if (find) {
      setCheckAlrams(checkAlrams.filter(element => element !== item));
      return;
    }
    setCheckAlrams([...checkAlrams, item]);
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        title={selectedLanguage.alram}
        rightContent={() => <RightContent />}
      />
      <FlatList
        data={notificationList}
        contentContainerStyle={styles.list}
        renderItem={({item, index}) => (
          <RenderItem
            item={item}
            index={index}
            onPress={onPressCheck}
            isActive={!!checkAlrams.find(element => element === item)}
          />
        )}
        keyExtractor={item => `${item?.id}`}
        ListEmptyComponent={() => (
          <ListEmptyComponent
            isRefresh={isRefreshing.current}
            isLoading={isLoading.current}
            isEnded={isEnded.current}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing.current}
            onRefresh={onRefresh}
            tintColor={selectedTheme.textColor}
            colors={[selectedTheme.textColor]}
          />
        }
        ListFooterComponent={() => (
          <ListFooterComponent
            isRefresh={isRefreshing.current}
            isEnded={isEnded.current}
          />
        )}
        onEndReached={onEndReached}
        scrollEventThrottle={200}
      />
    </SafeAreaView>
  );
};

const ListEmptyComponent = ({
  isRefresh,
  isLoading,
  isEnded,
}: {
  isRefresh: boolean;
  isLoading: boolean;
  isEnded: boolean;
}) => {
  const {selectedLanguage} = useLanguageStore();
  const {font20Bold} = useTextStyles();
  const styles = StyleSheet.create({
    container: {
      paddingTop: sizeConverter(120),
    },
  });

  if (isRefresh || isLoading) return null;

  if (!isEnded) return null;

  return (
    <View style={styles.container}>
      <Text style={font20Bold}>{selectedLanguage.noHistoryList}</Text>
    </View>
  );
};

const ListFooterComponent = ({
  isRefresh,
  isEnded,
}: {
  isRefresh: boolean;
  isEnded: boolean;
}) => {
  const styles = StyleSheet.create({
    container: {
      paddingBottom: sizeConverter(80),
      paddingTop: sizeConverter(40),
    },
  });

  if (isRefresh) return null;

  if (isEnded) return null;

  return (
    <View style={styles.container}>
      <LottieView
        source={lotties.lottie_loading_white}
        style={{width: sizeConverter(64), height: sizeConverter(64)}}
        autoPlay
        loop
      />
    </View>
  );
};

const RightContent: React.FC = () => {
  return (
    <View>
      <DeleteButton onPress={() => {}} />
    </View>
  );
};

const RenderItem = ({
  item,
  onPress,
  isActive,
}: {
  item: NotificationProps;
  index: number;
  onPress: (item: NotificationProps) => void;
  isActive: boolean;
}) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      height: sizeConverter(64),
      justifyContent: 'center',
      width: sizeConverter(320),
    },
  });

  const onPressItem = () => {
    onPress(item);
  };

  return (
    <View style={styles.container}>
      <CheckButton
        text={item.title}
        onPress={onPressItem}
        isActive={isActive}
      />
    </View>
  );
};

export default AlramListScreen;
