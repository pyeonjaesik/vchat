import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text, TextInput,BackHandler,KeyboardAvoidingView,Platform,Dimensions,StatusBar} from 'react-native';
import {URL,STATUSBAR_HEIGHT} from '../config';

import { connect } from 'react-redux';
import * as actions from '../actions';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';

const {width,height}=Dimensions.get("window");

class SigninScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      btn_status:false,
      nickname:'',
      nickname_info:'아이디를 입력해 주세요.',
      nickname_info_style:{},
      status:0,
      subject_v:`비밀번호를 입력해주세요.`,
      passCodeLength:0,
    }
    this._typeNumber=this._typeNumber.bind(this);
    this._backSpace=this._backSpace.bind(this);
    this._backHandle=this._backHandle.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  passCode='';
  _backHandle(){
    this.props.navigation.replace('Login');
    return true;
  }
  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this._backHandle);
  }
  componentWillUnmount(){
    BackHandler.removeEventListener('hardwareBackPress', this._backHandle);
  }
  async _typeNumber(n){
    if(this.passCode.length<6){
      this.passCode+=n;
      await this.setState({
        passCodeLength:this.passCode.length
      });
      if(this.passCode.length==6){
        let data={
          uid:this.state.nickname,
          pw:this.passCode
        };
        const obj = {
          body: JSON.stringify(data),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST'
        }
        fetch(`${URL}/signin`, obj)
        .then((response) => response.json())
        .then(async (responseJson) => {
          if(responseJson.status===100){
            await AsyncStorage.setItem('_id', responseJson._id);
            await AsyncStorage.setItem('uid', responseJson.uid);
            await AsyncStorage.setItem('id', responseJson.id);
            await AsyncStorage.setItem('user_id', responseJson.user_id);
            await AsyncStorage.setItem('coin', responseJson.coin.toString());
            await AsyncStorage.setItem('pwindex', responseJson.pwindex);
            this.props.navigation.replace('Parent');
          }else if(responseJson.status===101){
            this.setState({
              status:0,
              nickname_info:'아이디를 정확히 입력해 주세요.',
              btn_status:false,
            });
            Toast.show('아이디를 정확히 입력해 주세요.');
          }else if(responseJson.status===200){
            await this.setState({
              subject_v:'비밀번호가 일치하지 않습니다.\n다시 입력해 주세요.',
              passCodeLength:0
            });
            this.passCode='';
          }else if(responseJson.status===900){
            this.props.navigation.replace('Login');
            Toast.show('회원탈퇴한 계정입니다.');
          }else if(responseJson.status===600){
            await this.setState({
              subject_v:'잘못된 비밀번호를 \n지속적으로 입력하셨습니다.\n5분 후 다시 시도해주세요.',
              passCodeLength:0
            });
            this.passCode='';
          }else{
            alert('알 수 없는 오류 발생'+responseJson.status);
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }
  }
  _backSpace(){
    this.passCode=this.passCode.slice(0,-1);
    this.setState({
      passCodeLength:this.passCode.length
    })
  }
  _handleChange(nickname){
    this.setState({
      nickname:nickname,
      btn_status:nickname.length>0?true:false,
    });
  }

  render(){
    return(
      <View style={{flex:1}}>
        {
          this.state.status===0?(
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
            <TouchableOpacity style={styles.leftbtn}
                onPress={()=>{this.props.navigation.replace('Login');}}
                >
                <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
            </TouchableOpacity>
            <Text style={styles.subject}>ID를 입력해주세요.</Text>
            <TextInput
              style={styles.txtinput}
              placeholder="아이디"
              autoFocus={true}
              clearButtonMode='always'
              onChangeText={(nickname) => this._handleChange(nickname)}
            />
            <Text style={{...styles.nickname_info, ...this.state.nickname_info_style}}>{this.state.nickname_info}</Text>
            {
              this.state.btn_status===false ? (
                <Text style={styles.readybutton}>다음</Text>
              ):(
                <TouchableOpacity style={styles.nextbutton} onPress={()=>{
                  this.passCode='';
                  this.setState({
                    status:1,
                    subject_v:`비밀번호를 입력해주세요.`,
                    passCodeLength:0,
                  });
                }} >
                  <Text style={styles.nextbutton_txt}>다음</Text>
                </TouchableOpacity>
              )
            }
          </KeyboardAvoidingView>
          ):(
            <View style={styles2.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
            <TouchableOpacity style={styles2.leftbtn}
              onPress={() => {this.setState({status:0})}}
            >
              <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
            </TouchableOpacity>
            <Text style={styles2.subject}>암호</Text>
            <Text style={styles2.subject_v}>{this.state.subject_v}</Text>
            <View style={styles2.passcodeContainer}>
              {
                this.state.passCodeLength>0 ?(
                  <View style={styles2.inputStyle2}>
                    <View style={styles2.dot}/>
                  </View>
                ):(
                  <View style={styles2.inputStyle}></View>
                )
              }
              {
                this.state.passCodeLength>1 ?(
                  <View style={styles2.inputStyle2}>
                    <View style={styles2.dot}/>
                  </View>
                ):(
                  <View style={styles2.inputStyle}></View>
                )
              }
              {
                this.state.passCodeLength>2 ?(
                  <View style={styles2.inputStyle2}>
                    <View style={styles2.dot}/>
                  </View>
                ):(
                  <View style={styles2.inputStyle}></View>
                )
              }
              {
                this.state.passCodeLength>3 ?(
                  <View style={styles2.inputStyle2}>
                    <View style={styles2.dot}/>
                  </View>
                ):(
                  <View style={styles2.inputStyle}></View>
                )
              }
              {
                this.state.passCodeLength>4 ?(
                  <View style={styles2.inputStyle2}>
                    <View style={styles2.dot}/>
                  </View>
                ):(
                  <View style={styles2.inputStyle}></View>
                )
              }
              {
                this.state.passCodeLength>5 ?(
                  <View style={styles2.inputStyle2}>
                    <View style={styles2.dot}/>
                  </View>
                ):(
                  <View style={styles2.inputStyle}></View>
                )
              }
            </View>
            <View style={styles2.inputContainer}>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:0,left:0}}} onPress={()=>{this._typeNumber('1')}}>
                <Text style={styles2.inputNumber_txt}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:0,left:width/3}}} onPress={()=>{this._typeNumber('2')}}>
                <Text style={styles2.inputNumber_txt}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:0,left:2*width/3}}} onPress={()=>{this._typeNumber('3')}}>
                <Text style={styles2.inputNumber_txt}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:'25%',left:0}}} onPress={()=>{this._typeNumber('4')}}>
                <Text style={styles2.inputNumber_txt}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:'25%',left:width/3}}} onPress={()=>{this._typeNumber('5')}}>
                <Text style={styles2.inputNumber_txt}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:'25%',left:2*width/3}}} onPress={()=>{this._typeNumber('6')}}>
                <Text style={styles2.inputNumber_txt}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:'50%',left:0}}} onPress={()=>{this._typeNumber('7')}}>
                <Text style={styles2.inputNumber_txt}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:'50%',left:width/3}}} onPress={()=>{this._typeNumber('8')}}>
                <Text style={styles2.inputNumber_txt}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:'50%',left:2*width/3}}} onPress={()=>{this._typeNumber('9')}}>
                <Text style={styles2.inputNumber_txt}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:'75%',left:width/3}}} onPress={()=>{this._typeNumber('0')}}>
                <Text style={styles2.inputNumber_txt}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles2.inputNumber,...{top:'75%',left:2*width/3}}} onPress={this._backSpace}>
                <Image source={require('../assets/backspace.png')} style={{width:38,height:38}} />
              </TouchableOpacity>
            </View>
          </View>
          )
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
    fontSize:21,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    paddingLeft:40
  },
  txtinput:{
    marginTop:30,
    width:'80%',
    height:50,
    borderRadius:5,
    borderWidth:1,
    borderColor:'rgba(100,100,100,0.3)',
    backgroundColor:'rgba(100,100,100,0.1)',
    marginLeft:'10%',
    paddingLeft:15,
    fontSize:16
  },
  nickname_info:{
    marginTop:10,
    fontSize:13,
    color:'rgba(100,100,100,0.8)',
    paddingLeft:'12%'
  },
  nextbutton:{
    position:'absolute',
    bottom:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgb(234,29,93)',
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
  }
});
const styles2 = StyleSheet.create({
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
    fontSize:21,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    textAlign:'center',
    marginTop:'9%'
  },
  subject_v:{
    fontSize:17,
    color:'rgba(100,100,100,0.7)',
    textAlign:'center',
    marginTop:'4%'
  },
  passcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop:'16%'
  },
  inputStyle: {
    height: width/11,
    width: width/11,
    borderBottomWidth:3,
    borderColor:'rgba(22,23,27,0.5)',
  },
  inputStyle2: {
    height: width/11,
    width: width/11,
    justifyContent:'center',
    alignItems:'center'
  },
  inputContainer:{
    position:'absolute',
    width:'100%',
    height:'50%',
    bottom:0,
    left:0,
    backgroundColor:'white'
  },
  inputNumber:{
    position:'absolute',
    width:width/3,
    height:'25%',
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center'
  },
  inputNumber_txt:{
    fontSize:25,
    color:'rgb(22,23,27)'
  },
  dot:{
    width: width/18,
    height: width/18,
    backgroundColor:'#000000',
    borderRadius:50
  },
  number_img:{
    width: width/14,
    height: width/14
  }
})
const mapDispatchToProps = (dispatch) =>{
  return{
    setall: (_id,id,user_id,coin,logintype,pwindex)=>{
      dispatch(actions.setall(_id,id,user_id,coin,logintype,pwindex));
    },
    setkit:(ph,email)=>{
      dispatch(actions.setkit(ph,email))
    },
    alarm_leng:(alarm_leng)=>{
      dispatch(actions.alarm_leng(alarm_leng))
    }
  }   
}
export default connect(null,mapDispatchToProps)(SigninScreen);