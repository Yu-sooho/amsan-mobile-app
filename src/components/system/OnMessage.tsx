import React, {useEffect} from 'react';
import {
  Platform,
  // eslint-disable-next-line react-native/split-platform-components
  PermissionsAndroid,
} from 'react-native';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {useAuthStore} from '../../stores';
import {CurrentUser} from '../../types/AuthTypes';
import notifee from '@notifee/react-native';

type OnMessageProps = {
  initializing: boolean;
};

const OnMessage: React.FC<OnMessageProps> = ({initializing}) => {
  const onDisplayNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    const {notification} = remoteMessage;

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: notification?.title,
      body: notification?.body,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('foreground onMessage', remoteMessage);
        onDisplayNotification(remoteMessage);
      },
    );
    return unsubscribe;
  }, []);

  if (Platform.OS === 'android')
    return <PermissionAndroid initializing={initializing} />;
  return <PermissionIos initializing={initializing} />;
};

const PermissionIos = ({initializing}: {initializing: boolean}) => {
  const {userInfo, setUserInfo, updateUser, isLogin} = useAuthStore();

  const requestMessage = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getToken();
    }
  };

  const checkApplicationPermission = async () => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      getToken();
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      requestMessage();
    } else {
      requestMessage();
    }
  };

  const getToken = async () => {
    if (!userInfo) return;
    try {
      const token = await messaging().getToken();
      const user: CurrentUser = {
        ...userInfo,
        firebaseToken: token,
      };
      console.log('FCM', token);
      if (token !== userInfo.firebaseToken) {
        const res = await updateUser(user);
        setUserInfo(res);
        return;
      }
      setUserInfo(user);
    } catch (error) {
      console.log(`getToken`, error);
    }
  };

  useEffect(() => {
    if (!initializing) checkApplicationPermission();
  }, [initializing, isLogin]);

  return null;
};

const PermissionAndroid = ({initializing}: {initializing: boolean}) => {
  const {userInfo, setUserInfo, updateUser, isLogin} = useAuthStore();
  const requestMessage = async () => {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (result === 'granted') getToken();
  };

  const checkApplicationPermission = async () => {
    const authorizationStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (!authorizationStatus) {
      requestMessage();
      return;
    }
    getToken();
  };

  const getToken = async () => {
    if (!userInfo) return;
    try {
      const token = await messaging().getToken();
      const user: CurrentUser = {
        ...userInfo,
        firebaseToken: token,
      };
      console.log('FCM', token);
      if (token !== userInfo.firebaseToken) {
        const res = await updateUser(user);
        setUserInfo(res);
        return;
      }
      setUserInfo(user);
    } catch (error) {
      console.log(`getToken`, error);
    }
  };

  useEffect(() => {
    if (!initializing) checkApplicationPermission();
  }, [initializing, isLogin]);

  return null;
};

export default OnMessage;
