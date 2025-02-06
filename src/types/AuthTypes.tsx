import {Timestamp} from '@react-native-firebase/firestore';

export type CurrentUser = {
  createdAt: Timestamp;
  displayName: string;
  email: string;
  lastLogin: Timestamp;
  uid: string;
  profileImageUrl?: string;
  profileImageUrl128?: string;
  profileImageUrl256?: string;
  profileImageUrl512?: string;
};
