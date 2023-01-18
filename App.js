import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createStore } from 'redux';
import reducers from './reducers';
import { Provider } from 'react-redux';
import { StyleSheet, View, Dimensions,Platform,Text,StatusBar,Animated,Easing,AppState,RefreshControl,BackHandler,TouchableOpacity,Image} from 'react-native';

import FirstScreen from './component/FirstScreen';
import ParentScreen from './component/ParentScreen';
import LoginScreen from './component/LoginScreen';
import SetUidScreen from './component/SetUidScreen';
import SetNameScreen from './component/SetNameScreen';
import SetPassScreen from './component/SetPassScreen';
import SetPhoneScreen from './component/SetPhoneScreen';
import UserinfoScreen from './component/UserinfoScreen';
import SigninScreen from './component/SigninScreen';
import PickerScreen from './component/PickerScreen';
import IntroduceScreen from './component/IntroduceScreen';
import CategoryScreen from './component/CategoryScreen';
import BookScreen from './component/BookScreen';
import MyBookScreen from './component/MyBookScreen';
import BookingScreen from './component/BookingScreen';
import WebScreen from './component/WebScreen';
import PriceScreen from './component/PriceScreen';
import SettingScreen from './component/SettingScreen';
import PointScreen from './component/PointScreen';
import PayScreen from './component/PayScreen';
import TalkingScreen from './component/TalkingScreen';
import PostScreen from './component/PostScreen';
import FindPersonScreen from './component/FindPersonScreen';
import FindGroupScreen from './component/FindGroupScreen';
import SearchProfileScreen from './component/SearchProfileScreen';
import GroupScreen from './component/GroupScreen';
import RecoScreen from './component/RecoScreen';
import VideoScreen from './component/VideoScreen';



const store = createStore(reducers);
const RootStack = createStackNavigator(
  {
    First: {
      screen: FirstScreen,
    },
    Parent: {
      screen: ParentScreen,
    },
    Login:{
      screen: LoginScreen
    },
    SetUid:{
      screen:SetUidScreen
    },
    SetName:{
      screen:SetNameScreen
    },
    SetPass:{
      screen:SetPassScreen
    },
    SetPhone:{
      screen:SetPhoneScreen
    },
    Userinfo:{
      screen:UserinfoScreen
    },
    Signin:{
      screen:SigninScreen
    },
    Picker:{
      screen:PickerScreen
    },
    Introduce:{
      screen:IntroduceScreen
    },
    Category:{
      screen:CategoryScreen
    },
    Book:{
      screen:BookScreen
    },
    MyBook:{
      screen:MyBookScreen
    },
    Booking:{
      screen:BookingScreen
    },
    Web:{
      screen:WebScreen
    },
    Price:{
      screen:PriceScreen
    },
    Setting:{
      screen:SettingScreen
    },
    Point:{
      screen:PointScreen
    },
    Pay:{
      screen:PayScreen
    },
    Talking:{
      screen:TalkingScreen
    },
    Post:{
      screen:PostScreen
    },
    FindPerson:{
      screen:FindPersonScreen
    },
    FindGroup:{
      screen:FindGroupScreen
    },
    SearchProfile:{
      screen:SearchProfileScreen
    },
    Group:{
      screen:GroupScreen
    },
    Reco:{
      screen:RecoScreen
    },
    Video:{
      screen:VideoScreen
    }
  },
  {
    initialRouteName:'First',
  }
);

var AppContainer = createAppContainer(RootStack);
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store} super={3}>
        <AppContainer />
        {/* <View style={{width:100,height:100,backgroundColor:'red',position:'absolute'}}/> */}
      </Provider>
    );
  }
}