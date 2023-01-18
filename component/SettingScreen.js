import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,ScrollView,Dimensions,StatusBar,Platform,ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL,initials} from '../config';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import FastImage from 'react-native-fast-image'
import {PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import Dialog from './dialog/Dialog';
import DialogA from './dialog/DialogA';
import KakaoLogins from '@react-native-seoul/kakao-login';
import { NaverLogin, getProfile } from "@react-native-seoul/naver-login";
import {check,request, PERMISSIONS} from 'react-native-permissions';
import appleAuth, {
  AppleButton,
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRealUserStatus,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() :  StatusBar.currentHeight;

async function requestCameraPermission() {
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

const {width}=Dimensions.get("window");
class SettingScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      imgLoading:false,
      dialog1:false,
      dialog2:false,
      dialog3:false,
      dialog4:false,

    }
    this._postIMG=this._postIMG.bind(this);
    this._ok=this._ok.bind(this);
    this._cancel=this._cancel.bind(this);
  }

  static navigationOptions = {
    header:null
  };
  _cancel(){
    this.setState({
      dialog1:false,
      dialog2:false,
      dialogA:false
    })
  }
  async _ok(setindex){
    this.setState({
      dialog1:false,
      dialog2:false,
    })
    if(this.props.user_id[0] =='k'){
      KakaoLogins.login()
      .then(result => {
        let datam={
          accessToken:result.accessToken,
          _id:this.props._id
        };
        const obj = {
          body: JSON.stringify(datam),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST'
        }
        fetch(`${URL}/verifykakao`, obj)
        .then((response) => response.json())
        .then(async (responseJson) => {
          if(responseJson.status==100){
            console.log('setindex:'+setindex);
            if(setindex==0){
              this.props.navigation.navigate('SetName',{
                token:result.accessToken,
                from:'Setting'
              });
            }else if(setindex==1){
              this.props.navigation.navigate('SetPass',{
                token:result.accessToken,
                from:'Setting'
              });
            }
          }else if(responseJson.status==200){
            this.setState({
              dialogA:true
            });            
          }else{
            alert('settingscreen verifyfb err');
          }
        })
        .catch((error) => {
          console.error(error);
        });
      });
    }else if(this.props.user_id[0] =='n'){
      NaverLogin.login(initials, (err, token) => {
        console.log(`\n\n  Token is fetched  :: ${JSON.stringify(token)} \n\n`);
        if (err) {
          console.log(err);
          return;
        }
        let datam={
          accessToken:token.accessToken,
          _id:this.props._id
        };
        const obj = {
          body: JSON.stringify(datam),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST'
        }
        fetch(`${URL}/verifynaver`, obj)
        .then((response) => response.json())
        .then(async (responseJson) => {
          if(responseJson.status==100){
            if(setindex==0){
              this.props.navigation.navigate('SetName',{
                token:token.accessToken,
                from:'Setting'
              });
            }else if(setindex==1){
              this.props.navigation.navigate('SetPass',{
                token:token.accessToken,
                from:'Setting'
              });
            }
          }else if(responseJson.status==200){
            this.setState({
              dialogA:true
            });
          }else{
            alert('settingscreen verifyfb err');
          }
        })
        .catch((error) => {
          console.error(error);
        });
      });
    }else if(this.props.user_id[0] =='a'){
      if(Platform.OS!='ios'){
        alert('아이폰으로 회원가입한것이 감지되었습니다. 아이폰으로 다시 시도해주세요.');
        return;
      }
      if(parseInt(Platform.Version)<13){
        alert('IOS 버전을 13 이상으로 업그레이드해주세요.');
        return;
      }
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
        _id:this.props._id
      };
      const obj = {
        body: JSON.stringify(datam),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }
      fetch(`${URL}/verifyapple`, obj)
      .then((response) => response.json())
      .then(async (responseJson) => {
        if(responseJson.status==100){
          console.log('setindex:'+setindex);
          if(setindex==0){
            this.props.navigation.navigate('SetName',{
              token:identityToken,
              from:'Setting'
            });
          }else if(setindex==1){
            this.props.navigation.navigate('SetPass',{
              token:identityToken,
              from:'Setting'
            });
          }
        }else if(responseJson.status==200){
          this.setState({
            dialogA:true
          });            
        }else{
          alert('settingscreen verifyfb err');
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }
  _postIMG = (roll) =>{
    this.props.setimg(roll.path);
    let formData = new FormData();
    formData.append("file", {
      uri: roll.path,
      type: roll.mime,
      name: 'profileImg',
    });
    formData.append('_id',this.props._id);
    const options = {
      method: 'POST',
      body: formData
    };
    fetch(`${URL}/uploadprofileimg`, options)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status===100){
        this.setState({
          imgLoading:false
        })
        Toast.show('이미지를 업로드 하였습니다.')
      }else{
        Toast.show('이미지 업로드중 문제가 발생하였습니다.');
      }

    })
    .catch((error) => {
      console.error(error);
    });
  }
  render(){
    return(
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <TouchableOpacity style={styles.leftbtn}
            onPress={() => this.props.navigation.goBack()}
        >
          <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
        </TouchableOpacity>
        <ScrollView style={styles.main}>
          <View style={{alignItems:'center',justifyContent:'center',height:130}}>
            <TouchableOpacity style={{width:110,height:130,backgroundColor:'#fff',alignItems:'center'}} onPress={async  ()=>{
              if(Platform.OS === 'ios'){
                const phtoStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                if(phtoStatus!='granted'){
                  alert('설정에서 사진 접근권한을 허용해주세요.');
                  return;
                }
                ImagePicker.openPicker({
                  width: 400,
                  height: 400,
                  cropping: true,
                }).then(async image => {
                  await this.setState({imgLoading:true})
                  this._postIMG(image)
                }); 
              }else{
                let avail=await requestCameraPermission();
                if(avail ===0){
                  ImagePicker.openPicker({
                    width: 500,
                    height: 500,
                    cropping: true,
                  }).then(async image => {
                    await this.setState({imgLoading:true})
                    this._postIMG(image)
                  });                
                }else if(avail ===1){
                  alert('흥!')
                }else{
                  alert('헿... 뭐지.. ㅜㅜ')
                }
              }
          }}
            >
            {
              this.props.img===''?(
                <View style={{width:100,height:100,borderRadius:100,overflow:'hidden'}}>
                  <Image source={require('../assets/dog.png')} style={{width:100,height:100}}/>
                  <View style={styles.camera_c}>
                    {
                      this.state.imgLoading===true?(
                        <ActivityIndicator size={'small'} color="#fff" />
                      ):(
                        <Image source={require('../assets/camera.png')} style={{width:32,height:32,opacity:0.7}}/>
                      )
                    }
                  </View>
                </View>
              ):(
                <View style={{width:100,height:100,backgroundColor:'#999',borderRadius:100,overflow:'hidden'}}>
                  <FastImage
                    style={{width:100,height:100}}
                    source={{
                        uri: this.props.img,
                        priority: FastImage.priority.normal,
                    }}
                  />
                  <View style={styles.camera_c}>
                    {
                      this.state.imgLoading===true?(
                        <ActivityIndicator size={'small'} color="#fff" />
                      ):(
                        <Image source={require('../assets/camera.png')} style={{width:32,height:32,opacity:0.7}}/>
                      )
                    }
                  </View>
                </View>
              )
            }
              <Text style={{color:"rgba(0,0,0,0.8)",marginTop:8,fontSize:14}}>사진 변경</Text>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity style={styles.setnick}
            onPress={()=>{
              this.props.navigation.navigate('Point');
            }}
          >
              <Text style={{...styles.setnick_txt,color:'#ea1d5d'}}>{`해피볼`}
              </Text>
              <View style={styles.right_c}>
                <Text style={styles.right_txt}>{`    ${this.props.coin}개 보유`}</Text>
                <Image source={require('../assets/right-arrow.png')}
                  style={styles.right}
                />
              </View>
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.setnick}
            onPress={()=>{
              this.props.navigation.navigate('Price');
            }}
          >
              <Text style={{...styles.setnick_txt}}>{`내 영상 가격`}</Text>
              <View style={styles.right_c}>
                <Text style={styles.right_txt}>{`${this.props.price}개`}</Text>
                <Image source={require('../assets/right-arrow.png')}
                  style={styles.right}
                />
              </View>
          </TouchableOpacity> */}
          <View style={{width:width-100,borderBottomWidth:0.5,borderColor:'rgba(100,100,100,0.3)',marginLeft:50,heigt:10,marginTop:25,marginBottom:10}}/>
          <TouchableOpacity style={styles.setnick}
            onPress={()=>{
              this.props.navigation.navigate('Introduce')
            }}
          >
              <Text style={styles.setnick_txt}>자기소개</Text>
              <View style={styles.right_c}>
                <Text style={styles.right_txt}>{`프로필에 자기소개 추가`}</Text>
                <Image source={require('../assets/right-arrow.png')}
                  style={styles.right}
                />
              </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.setnick}
            onPress={()=>{
              this.props.navigation.navigate('Category');
            }}
          >
              <Text style={styles.setnick_txt}>SNS</Text>
              <View style={styles.right_c}>
                <Text style={styles.right_txt}>{`프로필에 SNS 추가`}</Text>
                <Image source={require('../assets/right-arrow.png')}
                  style={styles.right}
                />
              </View>
          </TouchableOpacity>
          <View style={{width:width-100,borderBottomWidth:0.5,borderColor:'rgba(100,100,100,0.3)',marginLeft:50,heigt:10,marginTop:25,marginBottom:10}}/>
          <TouchableOpacity style={styles.setnick}
            onPress={()=>{
              this.setState({dialog1:true})
            }}
          >
              <Text style={styles.setnick_txt}>이름 변경하기</Text>
              <View style={styles.right_c}>
                <Text style={styles.right_txt}>{`${this.props.id}`}</Text>
                <Image source={require('../assets/right-arrow.png')}
                  style={styles.right}
                />
              </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.setpw}
            onPress={()=>{
              this.setState({dialog2:true})
            }}
          >
            <Text style={styles.setpw_txt}>{this.props.pwindex=='true'?'비밀번호 변경하기':'비밀번호 설정하기'}</Text>
              <View style={styles.right_c}>
                <Text style={styles.right_txt}>{`비밀번호 설정`}</Text>
                <Image source={require('../assets/right-arrow.png')}
                  style={styles.right}
                />
              </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.signout}
            onPress={()=>{
              // this.setState({dialog3:true})
            }}
          >
            <Text style={styles.signout_txt}>회원탈퇴</Text>
            <Image source={require('../assets/right-arrow.png')}
              style={styles.right}
            />
          </TouchableOpacity> */}
        </ScrollView>
        {
          this.state.dialog1===true?(
            <Dialog subject='본인인증'
            main={'본인인증을 위해 \n 한번 더 로그인 합니다.'} _cancel={this._cancel}
            _ok={()=>{this._ok(0)}}
            />
          ):(null)
        }
        {
          this.state.dialog2===true?(
            <Dialog subject='본인인증'
            main={'본인인증을 위해 \n 한번 더 로그인 합니다.'} _cancel={this._cancel}
            _ok={()=>{this._ok(1)}}
            />
          ):(null)
        }
        {
          this.state.dialogA===true?(
            <DialogA subject='본인인증 실패'
              main={'회원님의 계정과 연동되지 않은 \n개인정보로 로그인 하셨습니다.'} _cancel={this._cancel}
            />
          ):(null)
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
  camera_c:{
    position:'absolute',
    top:0,
    left:0,
    width:100,
    height:100,
    backgroundColor:'rgba(0,0,0,0.2)',
    justifyContent:'center',
    alignItems:'center'
  },
  right_c:{
    position:'absolute',
    right:10,
    height:40,
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center'
  },
  right_txt:{
    color:'rgba(0,0,0,0.7)',
    fontSize:15
  },
  right:{
    marginLeft:10,
    width:20,
    height:20,
  },
  main:{
    flex:1,
  },
  subject_info:{
    marginTop:10,
    marginLeft:25,
    fontSize:27,
    color:'#000000',
    fontWeight:'500'
  },
  setnick:{
    marginTop:25,
    marginLeft:20,
    width:width-40,
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  setnick_txt:{
    fontSize:16,
    marginLeft:10
  },
  setpw:{
    marginTop:15,
    marginLeft:20,
    width:width-40,
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  setpw_txt:{
    fontSize:16,
    marginLeft:10
  },
  setpw:{
    marginTop:15,
    marginLeft:20,
    width:width-40,
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  setpw_txt:{
    fontSize:16,
    marginLeft:10
  },
  signout:{
    marginTop:15,
    marginLeft:20,
    width:width-40,
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  signout_txt:{
    fontSize:16,
    marginLeft:10
  },
  qna:{
    marginTop:15,
    marginLeft:20,
    width:width-40,
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  qna_txt:{
    fontSize:16,
    marginLeft:10
  },
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    id:state.setinfo.id,
    user_id:state.setinfo.user_id,
    coin:state.setinfo.coin,
    img:state.setinfo.img,
    logintype:state.setinfo.logintype,
    ph:state.setinfo.ph,
    email:state.setinfo.email,
    pwindex:state.setinfo.pwindex,
    price:state.setinfo.price,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
      setimg:(img)=>{
        dispatch(actions.setimg(img))
      },
      setvideo:(video)=>{
        dispatch(actions.setvideo(video))
      },
      setintro:(intro)=>{
        dispatch(actions.setintro(intro))
      },
      setsns: (sns)=>{
        dispatch(actions.setsns(sns));
      },
      setprice: (price)=>{
        dispatch(actions.setprice(price));
      },
      signout: ()=>{
        dispatch(actions.signout());
      },
      setsocket: (socket)=>{
        dispatch(actions.setsocket(socket));
      },
  }   
}

export default connect(mapStateToProps,mapDispatchToProps)(SettingScreen);