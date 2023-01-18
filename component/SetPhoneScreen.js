import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text, TextInput,KeyboardAvoidingView,Platform,StatusBar,Dimensions,Animated,Easing} from 'react-native';
import {URL,STATUSBAR_HEIGHT} from '../config';

import { connect } from 'react-redux';
import * as actions from '../actions';
import AsyncStorage from '@react-native-community/async-storage';
import CountryPicker from 'react-native-country-picker-modal'
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';

const {width,height}=Dimensions.get("window");


class SetPhoneScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      btn_status:false,
      number:'',
      countryCode:'KR',
      callingCode:'+82',
      status:0,
      confirm:'',
      loading:false,
      Margin:new Animated.Value(0),
      sub_text:'',
      sub_text_color:'#666',
      borderColor:'rgb(210,210,210)',
    }
    this._sendCode=this._sendCode.bind(this);
    this.confirmCode=this.confirmCode.bind(this);
    this._spring=this._spring.bind(this);
    this._sendPhone=this._sendPhone.bind(this);
    console.log(this.props)
  }
  static navigationOptions = {
    header:null
  };
  checkindex=true;
  finalnickname='';
  async _sendPhone(){
    let data={
      _id:this.props._id,
      phone:this.state.number[0]=='1'?`${this.state.callingCode}0${this.state.number}`:`${this.state.callingCode}${this.state.number}`
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/setphone`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status===100){
        this.props.navigation.replace('SetPass',{
          token:this.props.navigation.getParam('token',''),
          from:this.props.navigation.getParam('from','')
        });
      }else{
        this.setState({
          loading:false,
          status:0
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _spring(object){
    Animated.sequence([
      Animated.timing(object, {
        toValue: 20,
        duration: 50,
        easing: Easing.linear,
      }),
      Animated.timing(object, {
        toValue: -20,
        duration: 50,
        easing: Easing.linear,
      }),
      Animated.timing(object, {
        toValue: 20,
        duration: 50,
        easing: Easing.linear,
      }),
      Animated.timing(object, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
      })
    ]).start();
  }
  async confirmCode() {
    await this.setState({
      loading:true
    })
    try {
      await this.confirmation.confirm(this.state.confirm);
      this._sendPhone();
    } catch (error) {
     // alert(error);
      this._sendPhone();
      console.log(error)
      this.setState({
        loading:false
      });
      await this.setState({
        sub_text:'인증 번호가 맞지 않습니다. 다시 입력해주세요.',
        sub_text_color:'red',
        borderColor:'red',
        confirm:''
      })
      this._spring(this.state.Margin);
    }
  }

  confirmation;
  async _sendCode(){
    await this.setState({
      status:1,
      loading:false,
      confirm:'',
      Margin:new Animated.Value(0),
      sub_text:'',
      sub_text_color:'#666',
      borderColor:'rgb(210,210,210)',
    })
    var phonenumber=`${this.state.callingCode}${parseInt(this.state.number)}`;
    try {
      this.confirmation = await auth().signInWithPhoneNumber(phonenumber);
      console.log('1!!')
    } catch (error) {
      console.log('2!!');
      this._sendPhone();
    }
  }
  render(){
    switch(this.state.status){
      case 0:
        return(
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
            {
              this.props.navigation.getParam('from', '')!=='Setting'?(
                <View style={{height:STATUSBAR_HEIGHT+56}}/>
              ):(
                <TouchableOpacity style={styles.leftbtn}
                onPress={()=>{this.props.navigation.goBack();}}
                >
                  <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
                </TouchableOpacity>
              )
            }
            <Text style={styles.subject}>휴대전화번호를 입력해주세요.</Text>
            <View style={styles.input_c}>
              <View style={{width:116,height:56,flexDirection:'row'}}>
                <Image source={require('../assets/bottom_tri.png')} style={{width:24,height:24,position:'absolute',alignSelf:'center',right:4,opacity:0.7}}/>
                <Text style={{position:'absolute',alignSelf:'center',left:56,color:'#222'}}>{this.state.callingCode}</Text>
                <CountryPicker 
                  countryCode={this.state.countryCode}
                  withCloseButton={true}
                  withFilter={true}
                  withCallingCode={true}
                  withCountryNameButton={false}
                  withAlphaFilter={true}
                  // withEmoji={false}
                  containerButtonStyle={{
                    marginLeft:16,
                    width:100,
                    height:56,
                    backgroundColor:'rgba(0,0,0,0)',
                    justifyContent:'center',
                    borderRightWidth:0.5,
                    borderColor:'rgb(210,210,210)'
                  }}
                  withModal={true}
                  onSelect={(a)=>{
                    console.log(a)
                    this.setState({
                      countryCode:a.cca2,
                      callingCode:'+'+a.callingCode
                    })
                  }}
                />
              </View>
              <TextInput
                keyboardType={'numeric'}
                style={styles.txtinput}
                autoFocus={true}
                clearButtonMode='always'
                onChangeText={(number) => this.setState({number})}
              />
            </View>
            {
              this.state.number.length<10? (
                <View style={{...styles.nextbutton,backgroundColor:'rgb(200,200,200)'}}>
                  <Text style={styles.nextbutton_txt}>인증번호 받기</Text>
                </View>
              ):(
                <TouchableOpacity style={styles.nextbutton} onPress={()=>{
                  this._sendCode();
                }}>
                  <Text style={styles.nextbutton_txt}>인증번호 받기</Text>
                </TouchableOpacity>
              )
            }
          </KeyboardAvoidingView>
        )
      case 1:
        return(
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
            <TouchableOpacity style={styles.leftbtn}
              onPress={()=>{this.setState({status:0});}}
              >
                <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
            </TouchableOpacity>
            <Text style={styles.subject}>{this.state.number}</Text>
            <Animated.View style={{...styles.input_c,marginLeft:this.state.Margin,borderColor:this.state.borderColor}}>
              <TextInput
                placeholder={'인증번호를 입력해주세요'}
                keyboardType={'numeric'}
                style={{...styles.txtinput,fontSize:16,paddingHorizontal:32}}
                autoFocus={true}
                clearButtonMode='always'
                value={this.state.confirm}
                onChangeText={(confirm) => this.setState({
                  confirm,
                  sub_text:'',
                  sub_text_color:'#666',
                  borderColor:'rgb(210,210,210)'
                })}
              />
            </Animated.View>
            {/* <Text style={{fontSize:14,width,textAlign:'center',marginTop:16,color:this.state.sub_text_color}}>{this.state.sub_text}</Text> */}
            {
              this.state.loading===false?(
                <> 
                  {
                    this.state.confirm.length<6? (
                      <View style={{...styles.nextbutton,backgroundColor:'rgb(200,200,200)'}}>
                        <Text style={styles.nextbutton_txt}>번호 인증</Text>
                      </View>
                    ):(
                      <TouchableOpacity style={styles.nextbutton} onPress={()=>{
                        this.confirmCode();
                      }}>
                        <Text style={styles.nextbutton_txt}>번호 인증</Text>
                      </TouchableOpacity>
                    )
                  }
                  <TouchableOpacity style={styles.failbutton} onPress={()=>{
                    this.setState({
                      status:0
                    })
                  }}>
                    <Text style={styles.failbutton_txt}>인증번호를 받지 못했습니다.</Text>
                  </TouchableOpacity>
                </>
              ):(
                <View style={styles.nextbutton}>
                  <LottieView source={require('../assets/animation/loading_white.json')} 
                    autoPlay loop style={{width:32,height:32}} resizeMode="cover"/>
                </View>
              )
            }
          </KeyboardAvoidingView>
        ) 
    }
    
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
    fontSize:19,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    paddingLeft:40
  },
  txtinput:{
    marginTop:0,
    height:56,
    flex:1,
    borderRadius:5,
    paddingHorizontal:16,
    fontSize:14,
    color:'#222'
  },
  input_c:{
    marginTop:30,
    alignSelf:'center',
    width:width-64,
    height:56,
    flexDirection:'row',
    backgroundColor:'rgb(240,240,240)',
    borderWidth:0.5,
    borderColor:'rgb(210,210,210)',
    borderRadius:8
  },
  nextbutton:{
    marginTop:32,
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
    fontSize:14,
  },
  failbutton:{
    justifyContent:'center',
    alignItems:'center',
    height:32,
    paddingHorizontal:32,
    alignSelf:'center',
  },
  failbutton_txt:{
    color:'#666',
    fontSize:14,
  },
  bottom_button:{
    position:'absolute',
    bottom:30,
    width:'80%',
    marginLeft:'10%',
    height:50,
  },
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    user_id:state.setinfo.user_id,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
      setid: (id)=>{
        dispatch(actions.setid(id));
      }
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(SetPhoneScreen);