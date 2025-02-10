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
  profileImageUrl128?: string;
  profileImageUrl256?: string;
  profileImageUrl512?: string;
}
