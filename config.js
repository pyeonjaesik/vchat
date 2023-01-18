import {Platform,StatusBar,PermissionsAndroid} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import NetInfo from "@react-native-community/netinfo";

export const URL= 'http://10.32.201.223:80';

export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

const androidKeys = {
    kConsumerKey: "2_6oPtc3gZednVh3YV9t",
    kConsumerSecret: "rzGcJGmKQF",
    kServiceAppName: "테스트앱(안드로이드)"
};
const iosKeys = {
    kConsumerKey: "2_6oPtc3gZednVh3YV9t",
    kConsumerSecret: "rzGcJGmKQF",
    kServiceAppName: "테스트앱(iOS)",
    kServiceAppUrlScheme: "kakaobdb53966dea6023fb2cd6816adf9e61d" // only for iOS
};
export const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

export async function requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return 0;
      } else {
        return 1;
      }
    } catch (err) {
      return 2;
    }
}
export async function _isConnected(){
  var connected=true;
  await NetInfo.fetch().then(state => {
    connected=state.isConnected;
  });
  return connected
}

export const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'videos',
    // mediaType:'video'

  },
  durationLimit:60,
  videoQuality:'high',
  mediaType:'video'
};
