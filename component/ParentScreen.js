import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,PermissionsAndroid,ActivityIndicator,Button,BackHandler} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './Tab/HomeScreen';
import ChatScreen from './Tab/ChatScreen';
import AlarmScreen from './Tab/AlarmScreen';
import ProfileScreen from './Tab/ProfileScreen';
import SendScreen from './Tab/SendScreen';


const {width,height}=Dimensions.get("window");

const getTabBarIcon = (navigation, focused, tintColor) => {
  switch(navigation.state.routeName){
    case 'Home':
      if(focused===true){
        return <Image source={require(`../assets/homeBtn_focused_white.png`)} style={styles.homeBtn}/>
      }else{
        return <Image source={require(`../assets/homeBtn_white.png`)} style={styles.homeBtn}/>
      }
    case 'Search':
      if(focused===true){
        return <Image source={require(`../assets/searchBtn_focused_white.png`)} style={styles.searchBtn}/>
      }else{
        return <Image source={require(`../assets/searchBtn_white.png`)} style={styles.searchBtn}/>
      }
    case 'Send':
      if(focused===true){
        return <Image source={require(`../assets/searchBtn_focused_white.png`)} style={styles.searchBtn}/>
      }else{
        return <Image source={require(`../assets/searchBtn_white.png`)} style={styles.searchBtn}/>
      }
    case 'Chat':
      if(focused===true){
        return <Image source={require(`../assets/chatBtn_focused_white.png`)} style={styles.chatBtn}/>
      }else{
        return <Image source={require(`../assets/chatBtn_white.png`)} style={styles.chatBtn}/>
      }
    case 'Profile':
      if(focused===true){
        return <Image source={require(`../assets/profileBtn_focused_white.png`)} style={styles.profileBtn}/>
      }else{
        return <Image source={require(`../assets/profileBtn_white.png`)} style={styles.profileBtn}/>
      }
    default:
      return;
  }
  // You can return any component that you like here!
};

const TabNavigator = createBottomTabNavigator({
  Home: { screen: HomeScreen },
  Search: { screen: AlarmScreen },
  Send: { screen: SendScreen },
  Chat: { screen: ChatScreen },
  Profile: { screen: ProfileScreen },

},{
  
  tabBarOptions: {
    showLabel:false,
    keyboardHidesTabBar:true,
    style:{
      height:56,
      backgroundColor:'#000',
      position:'absolute',
      // borderTopWidth:3,
      // borderColor:'1'
    },
    // inactiveBackgroundColor:'#000',
    // activeBackgroundColor:'#000'
  },
  navigationOptions:{
    header:null,  
  },
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) =>
      getTabBarIcon(navigation, focused, tintColor),
  }),
});

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#333'
  },
  homeBtn:{
    width:27,
    height:27
  },
  searchBtn:{
    width:26,
    height:26
  },
  chatBtn:{
    width:27,
    height:27,
    marginTop:-3
  },
  cloudBtn:{
    width:33,
    height:33
  },
  profileBtn:{
    width:26.5,
    height:26.5
  },
});
const mapStateToProps = (state) =>{
  return{
    page:state.sidefunc.page,

  }
}
const mapDispatchToProps = (dispatch) =>{
  return{

  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(TabNavigator);