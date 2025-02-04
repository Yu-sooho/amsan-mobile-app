import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDataStore, useLanguageStore, useThemeStore} from '../stores';
import {CustomHeader} from '../components';
import {HistoryProps} from '../types';
import {formatTimestamp, showToast, sizeConverter} from '../utils';
import {useTextStyles} from '../styles';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {RefreshControl} from 'react-native-gesture-handler';

const PAGE_SIZE = 20;

const HistoryScreen: React.FC = () => {
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
    const data = await getHistory(PAGE_SIZE, lastDoc.current);
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
    isRefreshing.current = true;
    lastDoc.current = null;
    isEnded.current = false;
    setHistoryList([]);
    await fetchData();
    isRefreshing.current = false;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader title={selectedLanguage.history} />
      <FlatList
        data={historyList}
        contentContainerStyle={styles.list}
        renderItem={({item, index}) => <RenderItem item={item} index={index} />}
        keyExtractor={item => `${item?.id}`}
        ListEmptyComponent={() => <ListEmptyComponent />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing.current}
            onRefresh={onRefresh}
            tintColor={selectedTheme.textColor}
            colors={[selectedTheme.textColor]}
          />
        }
        onEndReached={onEndReached}
        scrollEventThrottle={200}
      />
    </View>
  );
};

const ListEmptyComponent = () => {
  const {selectedLanguage} = useLanguageStore();
  const {font20Bold} = useTextStyles();
  const styles = StyleSheet.create({
    container: {
      paddingTop: sizeConverter(120),
    },
  });
  return (
    <View style={styles.container}>
      <Text style={font20Bold}>{selectedLanguage.noHistoryList}</Text>
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
      {isOpen && (
        <View style={styles.openContainer}>
          {item.questionsList.map((element, index) => {
            return (
              <View
                style={styles.inputView}
                key={`${element.question}-${element.answer}`}>
                <ScrollView
                  contentContainerStyle={{width: sizeConverter(240)}}
                  style={{flex: 1}}
                  horizontal>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={
                        styles.text
                      }>{`${index + 1}.  ${element.question}`}</Text>
                    <Text style={styles.text}>{element.answer}</Text>
                  </View>
                </ScrollView>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
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
      )}
    </TouchableOpacity>
  );
};

export default HistoryScreen;
