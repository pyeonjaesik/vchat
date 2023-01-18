import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity,Dimensions,Text,Platform,SafeAreaView,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL,initials,STATUSBAR_HEIGHT,_isConnected} from '../config';
import {PermissionsAndroid} from 'react-native';
import LottieView from 'lottie-react-native';
import { Animated, Easing } from 'react-native';
import Toast from 'react-native-simple-toast';
// import auth from '@react-native-firebase/auth';

import KakaoLogins from '@react-native-seoul/kakao-login';
import { NaverLogin, getProfile } from "@react-native-seoul/naver-login";
import { firebase } from '@react-native-firebase/messaging';
import {requestNotifications,request,PERMISSIONS} from 'react-native-permissions';
import DialogA from './dialog/DialogA';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import SplashScreen from 'react-native-splash-screen'

const {width,height}=Dimensions.get("window");
// const androidKeys = {
//   kConsumerKey: "2_6oPtc3gZednVh3YV9t",
//   kConsumerSecret: "rzGcJGmKQF",
//   kServiceAppName: "테스트앱(안드로이드)"
// };
// const iosKeys = {
//   kConsumerKey: "2_6oPtc3gZednVh3YV9t",
//   kConsumerSecret: "rzGcJGmKQF",
//   kServiceAppName: "테스트앱(iOS)",
//   kServiceAppUrlScheme: "kakaobdb53966dea6023fb2cd6816adf9e61d" // only for iOS
// };
// const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      token:'',
      type:'',
      status:0,
      btn_status:false,
      progress1:new Animated.Value(0.2),
      progress2:new Animated.Value(0.2),
      progress3:new Animated.Value(0.2),
      progress4:new Animated.Value(0.2),
      check1:false,
      check2:false,
      check3:false,
      check4:false,
      dialogA:false
    }
    //  this.login_phone=this.login_phone.bind(this);
    //  this.login_email=this.login_email.bind(this);
     this._renderComponent=this._renderComponent.bind(this);

     this._check1=this._check1.bind(this);
     this._check2=this._check2.bind(this);
     this._check3=this._check3.bind(this);
     this._check4=this._check4.bind(this);
     this._renderNext=this._renderNext.bind(this);
     this.kakao_login=this.kakao_login.bind(this);
     this.naver_login=this.naver_login.bind(this);

  };
  login_token='';
  login_avail=true;
  userinfoindex=false;
  static navigationOptions = {
    header:null
  };
  // logout_account_kit(){
  //   RNAccountKit.logout()
  // .then(() => {
  //   console.log('Logged out')
  // })
  // }
  async push(){ // push 따로 빼두기 // ios에선 get Token 등록이 앱 시동 후 한번만 발생 login시에만 한번만 해주자.
    var fcmToken_storage = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken_storage)
    if(fcmToken_storage!=null||fcmToken_storage!=undefined){
      console.log('old')
      console.log(fcmToken_storage);
      return;
    }
    await firebase.messaging().registerForRemoteNotifications();
    const fcmToken = await firebase.messaging().getToken();
    await AsyncStorage.setItem('fcmToken', fcmToken.toString());
    console.log('new')
    console.log(fcmToken);
    return fcmToken;
  }
  async componentDidMount(){
    for(var i=0;i<10;i++){
      SplashScreen.hide();
    }
    if(Platform.OS=='ios'){
      await requestNotifications(['alert', 'sound']).then(async ({status, settings}) => {

      });
      const contactsStatus = await request(PERMISSIONS.IOS.CONTACTS);
      if(parseInt(Platform.Version)>=13){
        this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
          console.warn('Credential Revoked');
          this.fetchAndUpdateCredentialState().catch(error =>
            this.setState({ credentialStateForUser: `Error: ${error.code}` }),
          );
        });
    
        this.fetchAndUpdateCredentialState()
          .then(res => this.setState({ credentialStateForUser: res }))
          .catch(error => this.setState({ credentialStateForUser: `Error: ${error.code}` }))      
      }
    }else{
      const contactsStatus = await request(PERMISSIONS.ANDROID.READ_CONTACTS);
    }
  }
  async kakao_login(){
    this.push();
    var isConnected=await _isConnected();
    if(!isConnected){
      this.setState({
        dialogA:true
      })
      return;
    }
    try{
      console.log('kakao')
      KakaoLogins.login()
      .then(result => {
        let datam={
          accessToken:result.accessToken,
        };
        const obj = {
          body: JSON.stringify(datam),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST'
        }
        fetch(`${URL}/signupkakao`, obj)
        .then((response) => response.json())
        .then(async (responseJson) => {
          if(responseJson.status==200){
            console.log(responseJson);
            await AsyncStorage.setItem('_id', responseJson._id);
            await AsyncStorage.setItem('uid', responseJson.uid);
            await AsyncStorage.setItem('id', responseJson.id);
            await AsyncStorage.setItem('user_id', responseJson.user_id);
            await AsyncStorage.setItem('coin', responseJson.coin.toString());
            await AsyncStorage.setItem('pwindex', responseJson.pwindex);
            await this.props.setall(responseJson._id,responseJson.id,responseJson.user_id,responseJson.coin.toString(),'ph',responseJson.pwindex,responseJson.uid);
            if(this.userinfoindex===true){
              Toast.show('이미 가입한 계정이 있습니다.');
            }
            this.props.navigation.replace('Parent');
          }else if(responseJson.status==100){
            await AsyncStorage.setItem('_id', responseJson._id);
            await AsyncStorage.setItem('uid', responseJson.uid);
            await AsyncStorage.setItem('id', responseJson.id);
            await AsyncStorage.setItem('user_id', responseJson.user_id);
            await AsyncStorage.setItem('coin', '0');
            await AsyncStorage.setItem('pwindex', 'false');
            await this.props.setall(responseJson._id,responseJson.id,responseJson.user_id,'0','ph','false',responseJson.uid);
            if(this.userinfoindex===false){
              this.props.navigation.replace('Userinfo',{
                token:result.accessToken,
                type:'ph',
                from:this.props.navigation.getParam('from','Login')
              });
            }else{
              this.props.navigation.replace('SetPhone',{
                token:result.accessToken,
                type:'ph',
                from:this.props.navigation.getParam('from','Login')
              });
            }
            // this.props.mgrefresh(parseInt(Date.now()));
          }else{
          }
        })
        .catch((error) => {
          console.error(error);
        }); 
      }).catch(error=>{
        console.log('aa');
        console.log(error);
      });
      console.log('akakakak')
    }catch(err){
      console.log(err);
    }

  }

  async naver_login(){
    this.push();
    NaverLogin.login(initials, (err, token) => {
      console.log(`\n\n  Token is fetched  :: ${JSON.stringify(token)} \n\n`);
      if (err) {
        console.log(err);
        return;
      }
      let datam={
        accessToken:token.accessToken,
      };
      const obj = {
        body: JSON.stringify(datam),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }
      fetch(`${URL}/signupnaver`, obj)
      .then((response) => response.json())
      .then(async (responseJson) => {
        if(responseJson.status==200){
          console.log(responseJson);
          await AsyncStorage.setItem('_id', responseJson._id);
          await AsyncStorage.setItem('id', responseJson.id);
          await AsyncStorage.setItem('uid', responseJson.uid);
          await AsyncStorage.setItem('user_id', responseJson.user_id);
          await AsyncStorage.setItem('coin', responseJson.coin.toString());
          await AsyncStorage.setItem('pwindex', responseJson.pwindex);
          this.props.setall(responseJson._id,responseJson.id,responseJson.user_id,responseJson.coin.toString(),'ph',responseJson.pwindex,responseJson.uid);
          if(this.userinfoindex===true){
            Toast.show('이미 가입한 계정이 있습니다.');
          }
          this.props.navigation.replace('Parent');
        }else if(responseJson.status==100){
          await AsyncStorage.setItem('_id', responseJson._id);
          await AsyncStorage.setItem('id', responseJson.id);
          await AsyncStorage.setItem('uid', responseJson.uid);
          await AsyncStorage.setItem('user_id', responseJson.user_id);
          await AsyncStorage.setItem('coin', '0');
          await AsyncStorage.setItem('pwindex', 'false');
          this.props.setall(responseJson._id,responseJson.id,responseJson.user_id,'0','ph','false',responseJson.uid);
          if(this.userinfoindex===false){
            this.props.navigation.replace('Userinfo',{
              token:token.accessToken,
              type:'ph',
              from:this.props.navigation.getParam('from','Login')
            });
          }else{
            this.props.navigation.replace('SetName',{
              token:token.accessToken,
              type:'ph',
              from:this.props.navigation.getParam('from','Login')
            });
          }
          // this.props.mgrefresh(parseInt(Date.now()));
        }else{
        }
      })
      .catch((error) => {
        console.error(error);
      });
    });
  }
  async apple_login(){
    this.push();
    var isConnected=await _isConnected();
    if(!isConnected){
      this.setState({
        dialogA:true
      })
      return;
    }
    //
    try {
      console.log('try');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);
      const {
        user: newUser,
        email,
        nonce,
        identityToken,
        realUserStatus /* etc */,
      } = appleAuthRequestResponse;
    
      let datam={
        accessToken:identityToken,
        fullName:appleAuthRequestResponse.fullName
      };
      const obj = {
        body: JSON.stringify(datam),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }
      fetch(`${URL}/signupapple`, obj)
      .then((response) => response.json())
      .then(async (responseJson) => {
        if(responseJson.status==200){
          console.log(responseJson);
          await AsyncStorage.setItem('_id', responseJson._id);
          await AsyncStorage.setItem('uid', responseJson.uid);
          await AsyncStorage.setItem('id', responseJson.id);
          await AsyncStorage.setItem('user_id', responseJson.user_id);
          await AsyncStorage.setItem('coin', responseJson.coin.toString());
          await AsyncStorage.setItem('pwindex', responseJson.pwindex);
          await this.props.setall(responseJson._id,responseJson.id,responseJson.user_id,responseJson.coin.toString(),'ph',responseJson.pwindex,responseJson.uid);
          if(this.userinfoindex===true){
            Toast.show('이미 가입한 계정이 있습니다.');
          }
          this.props.navigation.replace('Parent');
        }else if(responseJson.status==100){
          await AsyncStorage.setItem('_id', responseJson._id);
          await AsyncStorage.setItem('uid', responseJson.uid);
          await AsyncStorage.setItem('id', responseJson.id);
          await AsyncStorage.setItem('user_id', responseJson.user_id);
          await AsyncStorage.setItem('coin', '0');
          await AsyncStorage.setItem('pwindex', 'false');
          await this.props.setall(responseJson._id,responseJson.id,responseJson.user_id,'0','ph','false',responseJson.uid);
          if(this.userinfoindex===false){
            this.props.navigation.replace('Userinfo',{
              token:identityToken,
              type:'ph',
              from:this.props.navigation.getParam('from','Login')
            });
          }else{
            this.props.navigation.replace('SetPhone',{
              token:identityToken,
              type:'ph',
              from:this.props.navigation.getParam('from','Login')
            });
          }
          // this.props.mgrefresh(parseInt(Date.now()));
        }else{
        }
      })
      .catch((error) => {
        console.error(error);
      }); 
    } catch (error) {
      console.log('sign in error')
      if (error.code === AppleAuthError.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.error(error);
      }
    };
  }
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
        <TouchableOpacity style={styles1.nextbutton} onPress={()=>{
            this.setState({
              status:2
            });
            this.userinfoindex=true;
          }} >
          <Text style={styles1.nextbutton_txt}>다음</Text>
        </TouchableOpacity>
      )
    }else{
      return(
        <Text style={styles1.readybutton}>다음</Text>
      )
    }
  }
  componentWillUnmount() {
    /**
     * cleans up event listener
     */
    if(Platform.OS=='ios'&&parseInt(Platform.Version)>=13){
      this.authCredentialListener();
    }
  }
  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      this.setState({ credentialStateForUser: 'N/A' });
    } else {
      const credentialState = await appleAuth.getCredentialStateForUser(this.user);
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        this.setState({ credentialStateForUser: 'AUTHORIZED' });
      } else {
        this.setState({ credentialStateForUser: credentialState });
      }
    }
  }
  //
  //
  //
  _renderComponent(status){
    switch(status){
      case 0:
        return(
          <View style={{flex:1}}>
            <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
            <View style={{flex:1,justifyContent:'center'}}>
              <Text style={{fontSize:width*0.15,width,textAlign:'center',fontFamily: "Pacifico-Regular",alignSelf:'center',color:'rgb(234,29,93)',marginTop:-height*0.2}}>V chat</Text>
              {
                Platform.OS=='ios'&&parseInt(Platform.Version)>=13?(
                  <>
                  <TouchableOpacity style={{...styles.enroll,bottom:24,borderWidth:0}}
                  onPress={()=>{
                    this.props.navigation.replace('Signin')
                  }}
                >
                  <Text style={styles.enroll_txt}>VCHAT 계정으로 로그인</Text>
                  </TouchableOpacity>
                  <AppleButton
                    style={{...styles.appleButton,bottom:88}}
                    cornerRadius={5}
                    buttonStyle={AppleButton.Style.BLACK}
                    buttonType={AppleButton.Type.SIGNIN}
                    onPress={() => this.apple_login()}
                  />
                  </>
                ):(
                  <>
                    <TouchableOpacity style={{...styles.enroll,bottom:30,borderWidth:0}}
                      onPress={()=>{
                        this.props.navigation.replace('Signin')
                      }}
                    >
                      <Text style={styles.enroll_txt}>VCHAT 계정으로 로그인</Text>
                    </TouchableOpacity>
                      <TouchableOpacity style={{...styles.enroll,borderColor:'#fbb034',bottom:88,borderWidth:1}}
                        onPress={()=>{
                          this.kakao_login();
                        }}
                      >
                      <Image source={require('../assets/kakao.jpeg')} style={{width:100,height:40}}/>
                      {/* <Text style={styles.enroll_txt}>카카오 아이디로 로그인하기</Text> */}
                    </TouchableOpacity>
                  </>
                )
              }
            </View>
            {
              this.state.dialogA==true?(
                <DialogA 
                  subject={'인터넷 연결'}
                  main={'오프라인 상태입니다.\n인터넷 연결을 확인하세요.'}
                  _cancel={()=>{
                    this.setState({dialogA:false})
                  }}
                />
              ):(null)
            }
          </View>
        )
      case 1:
       return(
         <View style={styles1.container}>
           <MyStatusBar backgroundColor='rgba(255,255,255,0)' barStyle='dark-content'/> 
           <TouchableOpacity style={styles1.leftbtn}
            onPress={()=>{this.setState({status:0})}}
            >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <Text style={styles1.subject}>V CHAT</Text>
          <View style={{flex:1}}>
            <View style={styles1.box1}>
              <Text style={styles1.box1_subject}>모두 동의합니다.</Text>
              <Text style={styles1.box1_info}>개인정보처리방침, 사용자이용약관, 유료서비스 이용약관에 모두 동의합니다.</Text>
              <TouchableOpacity style={styles1.check}  onPress={this._check1} activeOpacity={1}>
                <LottieView style={styles1.check_lottie} source={require('../assets/animation/check.json')} progress={this.state.progress1} resizeMode="cover"/>
              </TouchableOpacity>
            </View>
            <View style={styles1.box2}>
              <Text style={styles1.box2_subject}>개인정보처리방침 동의</Text>
              <TouchableOpacity style={styles1.check}  onPress={this._check2} activeOpacity={1}>
                <LottieView style={styles1.check_lottie} source={require('../assets/animation/check.json')} progress={this.state.progress2} resizeMode="cover"/>
              </TouchableOpacity>
              <TouchableOpacity style={styles1.goWeb}
                onPress={()=>{
                  this.props.navigation.navigate('Web',{type:1})
                }}
              >
                <Text style={styles1.goWeb_txt}>보기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles1.box2}>
              <Text style={styles1.box2_subject}>사용자이용약관 동의</Text>
              <TouchableOpacity style={styles1.check}  onPress={this._check3} activeOpacity={1}>
                <LottieView style={styles1.check_lottie} source={require('../assets/animation/check.json')} progress={this.state.progress3} resizeMode="cover"/>
              </TouchableOpacity>
              <TouchableOpacity style={styles1.goWeb}
                onPress={()=>{
                  this.props.navigation.navigate('Web',{type:2})
                }}
              >
                <Text style={styles1.goWeb_txt}>보기</Text>
              </TouchableOpacity>
            </View>
            <View style={styles1.box2}>
              <Text style={styles1.box2_subject}>유료서비스이용약관 동의</Text>
              <TouchableOpacity style={styles1.check}  onPress={this._check4} activeOpacity={1}>
                <LottieView style={styles1.check_lottie} source={require('../assets/animation/check.json')} progress={this.state.progress4} resizeMode="cover"/>
              </TouchableOpacity>
              <TouchableOpacity style={styles1.goWeb}
                onPress={()=>{
                  this.props.navigation.navigate('Web',{type:3})
                }}
              >
                <Text style={styles1.goWeb_txt}>보기</Text>
              </TouchableOpacity>
            </View>
          </View>
          {
            this._renderNext()
          }
         </View>
       )           
      case 2:
        return(
          <View style={styles.container}>
            <MyStatusBar backgroundColor='rgba(255,255,255,0)' barStyle='dark-content'/>
            <TouchableOpacity style={styles.leftbtn}
                onPress={() => {
                  this.setState({status:1})
                }}
              >
                <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
            </TouchableOpacity>
            <View style={{flex:1,justifyContent:'center'}}>
              <Text style={styles.header_txt}>본인 인증</Text>
              <View style={{width:'100%',height:200,marginTop:20,flexDirection:'row'}}>
                <TouchableOpacity style={styles.login_phone} onPress={this.login_phone}>
                  <Image style={{width:50,height:50}} source={require('../assets/sms.png')}/>
                  <Text style={styles.login_phone_txt}>{'SMS\n인증'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.login_email} onPress={this.login_email}>
                  <Image style={{width:50,height:50}} source={require('../assets/email.png')}/>
                  <Text style={styles.login_email_txt}>{'이메일\n인증'}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.subject2}>{'둘 중 한 가지 인증방법을\n선택해 주세요.'}</Text>
            </View>
          </View>
        )    
    }
  }
  render() {
    if(Platform.OS=='ios'){
      return(
        <SafeAreaView style={styles.container}>
          <View style={{flex:1,backgroundColor:'#fff'}} onLayout={async (event) => {
            console.log('loglog')
            var safeHeight = event.nativeEvent.layout.height;
            var bottom_height=height-safeHeight-STATUSBAR_HEIGHT
            if(bottom_height>0){
              await AsyncStorage.setItem('bottom',bottom_height.toString() );
            }
          }}>
          {
            this._renderComponent(this.state.status)
          }
          </View>
        </SafeAreaView>
      )
    }else{
      return (
        <View style={{flex:1}}>
          {
            this._renderComponent(this.state.status)
          }
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  signin_c:{
    width:width,
    alignItems:'center',
    height:40,
    marginTop:40
  },
  header_txt:{
    fontSize:27,
    color:'#000',
    marginLeft:40,
    fontWeight:'600',
    marginTop:-height*0.1
  },
  ceter_txt:{
    textAlign:'center',
    fontSize:16,
    marginTop:30,
    color:'#ea1d5d',
    fontWeight:'bold'
  },
  signin_c2:{
    position:'absolute',
    width:width,
    bottom:10,
  },
  signin_c_txt:{
    fontSize:14,
    color:'#555'
  },
  signin_c2_txt:{
    marginLeft:30,
    fontSize:14,
    color:'#555'
  },    
  signin1:{
    height:40,
    justifyContent:'center',
    alignItems:'center',
  },
  signin1_txt:{
    fontSize:16,
    color:'#002663'
  },
  signin2:{
    height:30,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:30
  },
  signin3:{
    height:30,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:20
  },
  signin_txt:{
    color:'#000',
    fontSize:14
  },
  enroll:{
    position:'absolute',
    width:width-100,
    height:56,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center',
    marginTop:40,
    borderRadius:8,
    borderWidth:0.5
  },
  enroll_txt:{
    color:'rgba(0,0,0,0.7)',
    fontSize:17,
    fontWeight:'bold'
  },
  subject:{
    fontSize:14,
    color:'rgba(0,0,0,0.7)',
    width:'100%',
    textAlign:'center',
    position:'absolute',
    bottom:56
  },
  subject2:{
    fontSize:19,
    color:'#444',
    width:'100%',
    textAlign:'center',
    lineHeight:30,
    marginTop:30,
  },
  leftbtn:{
    marginTop:0,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  login_phone:{
    width:width/2-25,
    height:200,
    backgroundColor:'#000',
    alignItems:'center',
    justifyContent:'center',
    borderTopLeftRadius:30,
    borderBottomLeftRadius:30,
    marginLeft:20
  },
  login_phone_txt:{
    fontSize:18,
    color:'#ffffff',
    textAlign:'center',
    marginTop:20,
    lineHeight:23
  },
  login_email:{
    width:width/2-25,
    height:200,
    backgroundColor:'#2d364c',
    alignItems:'center',
    justifyContent:'center',
    marginLeft:10,
    borderTopRightRadius:30,
    borderBottomRightRadius:30,
  },
  login_email_txt:{
    fontSize:18,
    color:'#ffffff',
    textAlign:'center',
    marginTop:20,
    lineHeight:23
  },
  touchbox:{
    width:55,
    height:55,
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    top:0,
    right:20
  },
  use_url_c:{
    position:'absolute',
    bottom:225,
    width:'100%',
    flexDirection:'row',
    height:20,
  },
  use_url_c2:{
    position:'absolute',
    bottom:205,
    width:'100%',
    flexDirection:'row',
    height:20,
  },
  use_url1:{
    height:20,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:40,
    borderBottomWidth:0.5,
    borderColor:'#fff'
  },
  use_url2:{
    height:20,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:8,
    borderBottomWidth:0.5,
    borderColor:'#fff'
  },
  use_url3:{
    position:'absolute',
    height:20,
    bottom:205,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:8,
    borderBottomWidth:0.5,
    borderColor:'#fff',
    marginLeft:40
  },
  use_url_txt:{
    fontSize:14,
    color:'rgb(220,220,220)',
  },
  use_sub:{
    position:'absolute',
    bottom:165,
    width:'100%',
    height:40,
    paddingHorizontal:40,
    fontSize:14,
    lineHeight:20,
    color:'rgb(220,220,220)',
  },
  appleButton: {
    position:'absolute',
    alignSelf:'center',
    bottom:150,
    width:width-100,
    height:56,
    margin: 10,
  },
});
const styles1 = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  leftbtn:{
    marginTop:0,
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
const mapStateToProps = (state) =>{
  return{
    uid:state.setinfo.uid,
    itr:state.setinfo.itr,
    backhandler:state.sidefunc.backhandler,
    barStyle:state.sidefunc.barStyle,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
      set_id: (_id)=>{
        dispatch(actions.set_id(_id));
      },
      setall: (_id,id,user_id,coin,logintype,pwindex,uid)=>{
        dispatch(actions.setall(_id,id,user_id,coin,logintype,pwindex,uid));
      },
      setkit:(ph,email)=>{
        dispatch(actions.setkit(ph,email))
      },
      setitr:(itr)=>{
        dispatch(actions.setitr(itr))
      },
      backhandler_f: (boolean)=>{
        dispatch(actions.backhandler(boolean));
      },
      mgrefresh: (index)=>{
        dispatch(actions.mgrefresh(index));
      }
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);