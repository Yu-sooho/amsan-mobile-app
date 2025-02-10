import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDataStore, useLanguageStore, useThemeStore} from '../stores';
import {CustomHeader} from '../components';
import {HistoryProps, RootStackProps} from '../types';
import {formatTimestamp, showToast, sizeConverter} from '../utils';
import {useTextStyles} from '../styles';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {RefreshControl} from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import {lotties} from '../resources';
import {RouteProp, useRoute} from '@react-navigation/native';

const PAGE_SIZE = 20;

const HistoryScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackProps, 'HistoryScreen'>>();
  const user = route?.params?.user;

  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {getHistory} = useDataStore();
  const isLoading = useRef<boolean>(false);
  const isEnded = useRef<boolean>(false);
  const isRefreshing = useRef<boolean>(false);

  const [historyList, setHistoryList] = useState<HistoryProps[]>([]);
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
    if (isLoading.current || isEnded.current) return;
    isLoading.current = true;
    const data = await getHistory(PAGE_SIZE, lastDoc.current, user?.uid);
    if (!data) {
      showToast({text: selectedLanguage.serverError});
      isEnded.current = true;
      return;
    }
    if (data?.historyData.length < PAGE_SIZE) isEnded.current = true;
    if (data.historyData) {
      setHistoryList([...historyList, ...data.historyData]);
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
    setHistoryList([]);
    isRefreshing.current = true;
  };

  useEffect(() => {
    if (isRefreshing.current === true) {
      isRefreshing.current = false;
      fetchData();
    }
  }, [isRefreshing.current]);

  return (
    <View style={styles.container}>
      <CustomHeader
        title={
          user
            ? `${user?.displayName} ${selectedLanguage.history}`
            : selectedLanguage.history
        }
      />
      <FlatList
        data={historyList}
        contentContainerStyle={styles.list}
        renderItem={({item, index}) => <RenderItem item={item} index={index} />}
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
    </View>
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

const RenderItem = ({item, index}: {item: HistoryProps; index: number}) => {
  const {font16Bold} = useTextStyles();
  const date = formatTimestamp(item.timestamp);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const correctQuestions = item.questionsList.filter(q => q.isCorrect === true);
  const wrongQuestions = item.questionsList.filter(q => q.isCorrect === false);

  const styles = StyleSheet.create({
    checkView: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    container: {
      alignItems: 'center',
      flexDirection: 'row',
      height: sizeConverter(64),
      justifyContent: 'center',
      width: sizeConverter(320),
    },
    date: {
      ...font16Bold,
    },
    dateView: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
      height: sizeConverter(44),
    },
    inputView: {
      flexDirection: 'row',
    },
    openContainer: {
      paddingHorizontal: sizeConverter(24),
      width: sizeConverter(320),
    },
    text: {
      ...font16Bold,
      fontSize: sizeConverter(20),
    },
    textAllView: {
      flex: 1,
      flexDirection: 'row',
    },
    textView: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
    },
  });

  const onPress = () => {
    setIsOpen(!isOpen);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.textView}>
          <View style={styles.dateView}>
            <Text
              style={
                styles.date
              }>{`${index + 1}.  ${date?.year} ${date?.month} ${date?.day}  `}</Text>
            <Text style={styles.date}>{`${date?.hours}:${date?.minutes}`}</Text>
          </View>
          <View style={styles.textAllView}>
            <View style={styles.checkView}>
              <Text style={styles.date}>
                {`✅   `}
                <Text style={styles.text}>{`${correctQuestions.length}`}</Text>
              </Text>
            </View>
            <View style={styles.checkView}>
              <Text style={styles.date}>
                {`❌   `}
                <Text style={styles.text}>{`${wrongQuestions.length}`}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
      {isOpen && <QuestionListDetail item={item} />}
    </TouchableOpacity>
  );
};

const QuestionListDetail: React.FC<{item: HistoryProps}> = ({item}) => {
  const {font16Bold} = useTextStyles();
  const {selectedTheme} = useThemeStore();

  const styles = StyleSheet.create({
    date: {
      ...font16Bold,
    },
    inputView: {
      flexDirection: 'row',
    },
    openContainer: {
      paddingHorizontal: sizeConverter(24),
      width: sizeConverter(320),
    },
    text: {
      ...font16Bold,
      fontSize: sizeConverter(20),
    },
    textAllView: {
      flex: 1,
      flexDirection: 'row',
    },
    textQ: {
      ...font16Bold,
      fontSize: sizeConverter(20),
      maxWidth: sizeConverter(150),
    },
    wrongText: {
      ...font16Bold,
      color: selectedTheme.wrongColor,
      fontSize: sizeConverter(20),
    },
  });
  return (
    <View style={styles.openContainer}>
      {item.questionsList.map((element, index) => {
        return (
          <View
            style={styles.inputView}
            key={`${element.question}-${element.answer}`}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                numberOfLines={1}
                style={
                  styles.textQ
                }>{`${index + 1}.  ${element.question}`}</Text>
              <Text style={element.isCorrect ? styles.text : styles.wrongText}>
                {element.answer}
              </Text>
            </View>
            <View style={{flex: 0.35, alignItems: 'flex-end'}}>
              {element.isCorrect ? (
                <Text style={styles.date}>{`✅`}</Text>
              ) : (
                <Text style={styles.date}>{`❌`}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default HistoryScreen;
