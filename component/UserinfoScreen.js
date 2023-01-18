import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,Dimensions,StatusBar} from 'react-native';
import {URL} from '../config';
import { Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
const {width,height}=Dimensions.get("window");
import { getStatusBarHeight } from 'react-native-status-bar-height';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

export default class UserinfoScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      btn_status:false,
      progress1:new Animated.Value(0.2),
      progress2:new Animated.Value(0.2),
      progress3:new Animated.Value(0.2),
      progress4:new Animated.Value(0.2),
      check1:false,
      check2:false,
      check3:false,
      check4:false,
    }
    this._check1=this._check1.bind(this);
    this._check2=this._check2.bind(this);
    this._check3=this._check3.bind(this);
    this._check4=this._check4.bind(this);
    this._renderNext=this._renderNext.bind(this);
  }
  static navigationOptions = {
    header:null
  };

  async _check1(){
    if(this.state.check1===false){
      await this.setState(prev=>({
        check1:true,
        check2:true,
        check3:true,
        check4:true,
      }))
      Animated.timing(this.state.progress1, {
        toValue: 0.3,
        duration: 400,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.progress2, {
        toValue: 0.3,
        duration: 400,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.progress3, {
        toValue: 0.3,
        duration: 400,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.progress4, {
        toValue: 0.3,
        duration: 400,
        easing: Easing.linear,
      }).start();
    }else{
      await this.setState(prev=>({
        check1:false,
        check2:false,
        check3:false,
        check4:false,
      }))
      Animated.timing(this.state.progress1, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.progress2, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.progress3, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
      Animated.timing(this.state.progress4, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
    }
  }
  async _check2(){
    if(this.state.check2===false){
      await this.setState(prev=>({
        check2:true,
      }))
      Animated.timing(this.state.progress2, {
        toValue: 0.3,
        duration: 400,
        easing: Easing.linear,
      }).start();
    }else{
      await this.setState(prev=>({
        check2:false,
      }))
      Animated.timing(this.state.progress2, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
    }
  }
  async _check3(){
    if(this.state.check3===false){
      await this.setState(prev=>({
        check3:true,
      }))
      Animated.timing(this.state.progress3, {
        toValue: 0.3,
        duration: 400,
        easing: Easing.linear,
      }).start();
    }else{
      await this.setState(prev=>({
        check3:false,
      }))
      Animated.timing(this.state.progress3, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
    }
  }
  async _check4(){
    if(this.state.check4===false){
      await this.setState(prev=>({
        check4:true,
      }))
      Animated.timing(this.state.progress4, {
        toValue: 0.3,
        duration: 400,
        easing: Easing.linear,
      }).start();
    }else{
      await this.setState(prev=>({
        check4:false,
      }))
      Animated.timing(this.state.progress4, {
        toValue: 0.2,
        duration: 0,
        easing: Easing.linear,
      }).start();
    }
  }
  _renderNext(){
    if(this.state.check2===true&&this.state.check3===true&&this.state.check4===true){
      return(
        <TouchableOpacity style={styles.nextbutton} onPress={()=>{
            this.props.navigation.replace('SetUid',{
              token:this.props.navigation.getParam('token'),
              type:this.props.navigation.getParam('type'),
              from:this.props.navigation.getParam('from','Login')
            });
          }} >
          <Text style={styles.nextbutton_txt}>다음</Text>
        </TouchableOpacity>
      )
    }else{
      return(
        <Text style={styles.readybutton}>다음</Text>
      )
    }
  }
  render(){
    return(
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <TouchableOpacity style={styles.leftbtn}
          onPress={()=>{this.props.navigation.goBack();}}
          >
          {/* <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/> */}
        </TouchableOpacity>
        <Text style={styles.subject}>V CHAT</Text>
        <View style={{flex:1}}>
          <View style={styles.box1}>
            <Text style={styles.box1_subject}>모두 동의합니다.</Text>
            <Text style={styles.box1_info}>개인정보처리방침, 사용자이용약관, 유료서비스 이용약관에 모두 동의합니다.</Text>
            <TouchableOpacity style={styles.check}  onPress={this._check1} activeOpacity={1}>
              <LottieView style={styles.check_lottie} source={require('../assets/animation/check.json')} progress={this.state.progress1} resizeMode="cover"/>
            </TouchableOpacity>
          </View>
          <View style={styles.box2}>
            <Text style={styles.box2_subject}>개인정보처리방침 동의</Text>
            <TouchableOpacity style={styles.check}  onPress={this._check2} activeOpacity={1}>
              <LottieView style={styles.check_lottie} source={require('../assets/animation/check.json')} progress={this.state.progress2} resizeMode="cover"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goWeb}
              onPress={()=>{
                this.props.navigation.navigate('Web',{uri:`${URL}/userinfo`})
              }}
            >
              <Text style={styles.goWeb_txt}>보기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.box2}>
            <Text style={styles.box2_subject}>사용자이용약관 동의</Text>
            <TouchableOpacity style={styles.check}  onPress={this._check3} activeOpacity={1}>
              <LottieView style={styles.check_lottie} source={require('../assets/animation/check.json')} progress={this.state.progress3} resizeMode="cover"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goWeb}
              onPress={()=>{
                this.props.navigation.navigate('Web',{uri:`${URL}/userinfo2`})
              }}
            >
              <Text style={styles.goWeb_txt}>보기</Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.box2}>
            <Text style={styles.box2_subject}>유료서비스이용약관 동의</Text>
            <TouchableOpacity style={styles.check}  onPress={this._check4} activeOpacity={1}>
              <LottieView style={styles.check_lottie} source={require('../assets/animation/check.json')} progress={this.state.progress4} resizeMode="cover"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.goWeb}
              onPress={()=>{
                this.props.navigation.navigate('Web',{uri:`${URL}/userinfo3`})
              }}
            >
              <Text style={styles.goWeb_txt}>보기</Text>
            </TouchableOpacity>
          </View> */}
        </View>
        {
          this._renderNext()
        }
      </View>
    )
    
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  leftbtn:{
    marginTop:STATUSBAR_HEIGHT,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  subject:{
    fontSize:40,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    width:'100%',
    textAlign:'center'
  },
  nextbutton:{
    position:'absolute',
    bottom:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#000000',
    width:'80%',
    marginLeft:'10%',
    height:50,
    borderRadius:3,
  },
  nextbutton_txt:{
    color:'white',
    fontSize:18,
  },
  readybutton:{
    position:'absolute',
    bottom:30,
    backgroundColor:'rgb(160,160,160)',
    width:'80%',
    marginLeft:'10%',
    height:50,
    borderRadius:3,
    color:'white',
    fontSize:18,
    lineHeight:50,
    textAlign:'center'
  },
  box1:{
    width:'100%',
    height:90,
    marginTop:50
  },
  box1_subject:{
    marginTop:10,
    marginLeft:70,
    marginRight:70,
    fontSize:18,
    color:'#000',
    fontWeight:'600'
  },
  box1_info:{
    marginTop:3,
    marginLeft:70,
    marginRight:70,
    fontSize:14,
    color:'#000'
  },
  check:{
    position:'absolute',
    width:55,
    height:55,
    top:2.5,
    left:10,
    justifyContent:'center',
    alignItems:'center'
  },
  check_lottie:{
    width:'100%',
    height:'100%'
  },
  goWeb:{
    position:'absolute',
    width:50,
    height:50,
    top:2,
    right:15,
    justifyContent:'center',
    alignItems:'center'
  },
  goWeb_txt:{
    color:'#000',
    fontSize:15
  },
  box2:{
    width:'100%',
    height:50,
    marginTop:15,
    justifyContent:'center'
  },
  box2_subject:{
    marginTop:10,
    marginLeft:70,
    marginRight:70,
    fontSize:15,
    color:'#000',
    fontWeight:'600'
  },
});