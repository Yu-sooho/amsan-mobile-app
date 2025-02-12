import {Timestamp} from '@react-native-firebase/firestore';

export type BasicUser = {
  uid: string;
  displayName: string;
  profileImageUrl?: string;
};

export interface CurrentUser extends BasicUser {
  createdAt: Timestamp;
  email: string;
  lastLogin: Timestamp;
  firebaseToken: string;
  profileImageUrl128?: string;
  profileImageUrl256?: string;
  profileImageUrl512?: string;
  isAgreeNotification1: boolean;
}
