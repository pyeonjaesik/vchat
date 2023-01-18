import React,{Component} from 'react';
import {StyleSheet, View,Dimensions,StatusBar} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import AsyncStorage from '@react-native-community/async-storage';

const {width,height}=Dimensions.get("window");
import codePush from "react-native-code-push";

class SigninScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      backhandler:0
    }
    this.start=this.start.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  async start(){
    const _id = await AsyncStorage.getItem('_id');
    if(_id!==null){
      this.props.navigation.replace('Parent');
    }else{
      this.props.signout();
      await AsyncStorage.setItem('_id', '');
      await AsyncStorage.setItem('id', '');
      await AsyncStorage.setItem('user_id', '');
      await AsyncStorage.setItem('coin', '');
      await AsyncStorage.setItem('type', '');
      await AsyncStorage.setItem('pwindex', '');
      await AsyncStorage.setItem('itr', '');
      this.props.navigation.replace('Login');
    }
  }
  render(){
    return(
      <View style={styles.container} onLayout={()=>{
        this.start();
      }}>
        <StatusBar barStyle={this.props.barStyle} backgroundColor={'transparent'} translucent={true}/>
      </View>
    )
    
  }
}
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

SigninScreen =  codePush(codePushOptions)(SigninScreen);

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  lottie: {
    width:width*0.315,
    height:width*0.315,
    alignSelf:'center',
  },
});
const mapStateToProps = (state) =>{
  return{
    backhandler:state.sidefunc.backhandler,
    barStyle:state.sidefunc.barStyle,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setall: (_id,id,user_id,coin,logintype,pwindex)=>{
      dispatch(actions.setall(_id,id,user_id,coin,logintype,pwindex));
    },
    setitr:(itr)=>{
      dispatch(actions.setitr(itr))
    },
    setkit:(ph,email)=>{
      dispatch(actions.setkit(ph,email))
    },
    signout: ()=>{
      dispatch(actions.signout());
    },
    backhandler_f: (boolean)=>{
      dispatch(actions.backhandler(boolean));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(SigninScreen);