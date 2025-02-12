import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useAuthStore,
  useDataStore,
  useLanguageStore,
  useThemeStore,
} from '../stores';
import {CustomHeader, IconSliders, UserImageButton} from '../components';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HistoryProps, PlayType, RootStackProps} from '../types';
import {showToast, sizeConverter} from '../utils';
import {useTextStyles} from '../styles';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import {lotties} from '../resources';

const PAGE_SIZE = 30;

const RightContent = ({
  onPressSortType,
  sortTypes,
  selectedValue,
}: {
  onPressSortType: (value: string) => void;
  sortTypes: string[];
  selectedValue: string;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'RankingScreen'>>();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      height: sizeConverter(44),
      justifyContent: 'center',
      paddingRight: sizeConverter(8),
      width: sizeConverter(44),
    },
  });

  const openModal = () => {
    navigation.navigate('CustomModalScreen', {
      selectedValue: selectedValue,
      valueList: sortTypes,
      onPress: onPressSortType,
    });
  };

  return (
    <TouchableOpacity onPress={openModal} style={styles.container}>
      <IconSliders size={sizeConverter(24)} />
    </TouchableOpacity>
  );
};

const RankingScreen: React.FC = () => {
  const {selectedTheme} = useThemeStore();
  const {selectedLanguage} = useLanguageStore();
  const {loginData} = useAuthStore();
  const {getRanking, setSelectedSortType, selectedSortType} = useDataStore();
  const isLoading = useRef<boolean>(false);
  const isEnded = useRef<boolean>(false);
  const isRefreshing = useRef<boolean>(false);
  const route = useRoute<RouteProp<RootStackProps, 'RankingScreen'>>();

  const operation = route?.params?.operation;

  const [rankingList, setRankingList] = useState<HistoryProps[]>([]);
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

  const sortTypes = [
    selectedLanguage.plus,
    selectedLanguage.division,
    selectedLanguage.multiply,
    selectedLanguage.subtraction,
    selectedLanguage.mix,
  ];

  const onPressSortType = (value: string) => {
    setSelectedSortType(value);
  };

  const checkType = (): PlayType => {
    if (selectedSortType === sortTypes[0]) return 'plus';
    if (selectedSortType === sortTypes[1]) return 'division';
    if (selectedSortType === sortTypes[2]) return 'multiply';
    if (selectedSortType === sortTypes[3]) return 'subtraction';
    if (selectedSortType === sortTypes[4]) return 'mix';
    return 'custom';
  };

  const fetchData = async () => {
    if (isLoading.current || isEnded.current) return;
    isLoading.current = true;
    const data = await getRanking(checkType(), PAGE_SIZE, lastDoc.current);
    if (!data) {
      showToast({text: selectedLanguage.serverError});
      isEnded.current = true;
      return;
    }
    if (data?.rankingData.length < PAGE_SIZE) isEnded.current = true;
    if (data.rankingData) {
      setRankingList([...rankingList, ...data.rankingData]);
    }
    lastDoc.current = data.lastDoc;
    isLoading.current = false;
  };

  const onRefresh = async () => {
    lastDoc.current = null;
    isEnded.current = false;
    setRankingList([]);
    isRefreshing.current = true;
  };

  const onEndReached = () => {
    fetchData();
  };

  useEffect(() => {
    if (operation) {
      if (operation === 'plus') onPressSortType(sortTypes[0]);
      if (operation === 'division') onPressSortType(sortTypes[1]);
      if (operation === 'multiply') onPressSortType(sortTypes[2]);
      if (operation === 'subtraction') onPressSortType(sortTypes[3]);
      if (operation === 'mix') onPressSortType(sortTypes[4]);
    }
  }, []);

  useEffect(() => {
    if (isRefreshing.current === true) {
      isRefreshing.current = false;
      fetchData();
    }
  }, [isRefreshing.current]);

  useEffect(() => {
    onRefresh();
  }, [selectedSortType]);

  const navigation =
    useNavigation<StackNavigationProp<RootStackProps, 'RankingScreen'>>();

  const onPressUserImage = (item: HistoryProps) => {
    if (item.uid !== loginData?.uid) {
      navigation.navigate('UserInfoScreen', {
        uid: item.uid,
      });
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <CustomHeader
        title={`${selectedSortType} ${selectedLanguage.ranking}`}
        rightContent={() => (
          <RightContent
            sortTypes={sortTypes}
            selectedValue={selectedSortType}
            onPressSortType={onPressSortType}
          />
        )}
      />

      <FlatList
        data={rankingList}
        contentContainerStyle={styles.list}
        renderItem={({item, index}) => (
          <RenderItem onPress={onPressUserImage} item={item} index={index} />
        )}
        keyExtractor={item => `${item?.id}`}
        onEndReached={onEndReached}
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
        scrollEventThrottle={200}
      />
    </SafeAreaView>
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

const RenderItem = ({
  onPress,
  item,
  index,
}: {
  onPress: (item: HistoryProps) => void;
  item: HistoryProps;
  index: number;
}) => {
  const {font16Bold} = useTextStyles();
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

  const onPressUserImage = () => {
    onPress(item);
  };

  return (
    <TouchableOpacity onPress={onPressUserImage}>
      <View style={styles.container}>
        <View style={styles.textView}>
          <View style={styles.dateView}>
            <Text style={styles.date}>{`${index + 1}. `}</Text>
            <UserImageButton
              disabled={true}
              size={sizeConverter(24)}
              url={item.profileImageUrl}
            />
            <Text style={styles.date}>{`${item.displayName} `}</Text>
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
    </TouchableOpacity>
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
      <Text style={font20Bold}>{selectedLanguage.noRankingList}</Text>
    </View>
  );
};

export default RankingScreen;
