import React from 'react';
import HeaderLB from './HeaderLB';
import HeaderLA from './HeaderLA';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {View, Platform, StyleSheet,StatusBar} from 'react-native'
import { getStatusBarHeight } from 'react-native-status-bar-height';
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;

class Header extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <View style={styles.container}>

      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    height: STATUSBAR_HEIGHT+55,
    backgroundColor:'#fff'
  }
});
const mapStateToProps = (state) =>{
  return{
      _id:state.setinfo._id,
  }
}
export default connect(mapStateToProps)(Header);