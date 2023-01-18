import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,Animated,TouchableOpacity,ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL,STATUSBAR_HEIGHT,requestCameraPermission,options} from '../config';
import FastImage from 'react-native-fast-image'
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';
import RNVideoHelper from 'react-native-video-helper';
import VideoPannel from './Tab/list/VideoPannel';
import VideoProgress from './dialog/VideoProgress';

import ImagePicker from 'react-native-image-picker';
import ImagePickerCrop from 'react-native-image-crop-picker';
import {check,request, PERMISSIONS} from 'react-native-permissions';

const AnimatedVideoProgress= Animated.createAnimatedComponent(VideoProgress);

const {width,height}=Dimensions.get("window");
class MyBookScreen extends React.Component {
  scroll = new Animated.Value(0);
  constructor(props){
    super(props);
    this.state={
      scrollY: new Animated.Value(0),
      imgLoading:false,
      activePage:0,
      currentPage:0,
      paused:false,
      img_marginTop:0,
      add_toggle:false
    }
    this._postIMG=this._postIMG.bind(this);
    this._postProfileVIDEO=this._postProfileVIDEO.bind(this);

    this._postVIDEO=this._postVIDEO.bind(this);

  };
  static navigationOptions = {
    header:null
  };
  _postProfileVIDEO = async (roll) =>{
    this.setState({
      add_toggle:false
    })
    this.props.setvideo(roll);
    this.props.progress_f(2);
    let formData = new FormData();
    formData.append("file", {
      uri: roll,
      type: 'video/mp4',
      name: 'profileVideo',
    });
    formData.append('_id',this.props._id);
    const options = {
      method: 'POST',
      body: formData
    };
    fetch(`${URL}/uploadprofileVideo`, options)
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.progress_f(0);
      if(responseJson.status===100){
        Toast.show('동영상을 정상적으로 업로드 하였습니다.')
      }else{
        Toast.show('동영상 업로드중 문제가 발생하였습니다.');
      }

    })
    .catch((error) => {
      console.error(error);
    });  }
  _postVIDEO = (roll) =>{
    console.log('_post video');
    this.props.navigation.navigate('Post',{
      roll:roll.path,
      mime:roll.mime
    });
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
  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.props.page_f('Profile');
          }}
          onDidFocus={payload => {
            this.props.barStyle_f('light-content');
            this.setState({
              paused:false
            })
          }}
          onWillBlur={payload => {
            this.setState({
              paused:true
            })
          }}
        />
        <StatusBar barStyle={this.props.barStyle} backgroundColor={'transparent'} translucent={true}/>
        <View style={{flex:1,backgroundColor:'#2d364c',justifyContent:'flex-end'}}>
          {
            this.props.video==''?(
              null
              // <LottieView style={{width,height,position:'absolute',top:0,left:0}} source={require('../../assets/animation/background.json')} autoPlay loop resizeMode="cover"/>
            ):(
              <VideoPannel uri={this.props.video} paused={(()=>{
                  if(this.state.add_toggle){
                    return true;
                  }else{
                    return this.state.paused
                  }
                })()}
              />
            )
          }
          <View style={{width,height:56,position:'absolute',top:STATUSBAR_HEIGHT,left:0,flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity style={styles.leftbtn} onPress={()=>{
                this.props.navigation.goBack();
              }}>
                <Image source={require('../assets/left_white.png')} style={{width:24,height:24}}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.post_video_c_big} onPress={async ()=>{
                this.setState({
                  add_toggle:true
                });
            }}>
              <Image style={{width:12,height:12,marginRight:4,opacity:0.8}} source={require('../assets/add_white_small.png')}/>
              <Text style={styles.post_video_txt}>배경영상</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dot3_c} onPress={()=>{
                this.props.navigation.navigate('Setting')
            }}>
              <Image style={{width:28,height:28,opacity:0.9}} source={require('../assets/3dot.png')}/>
            </TouchableOpacity>
          </View>
          <View style={{...styles.hadan_c,marginBottom:this.props.bottom+32}}>
            <View style={styles.hadan_left}>
              <TouchableOpacity 
                style={{...styles.scorll_info_header_img_c,marginTop:this.state.img_marginTop}}
                activeOpacity={1}
                onPress={async ()=>{
                  if(Platform.OS === 'ios'){
                    const phtoStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                    if(phtoStatus!='granted'){
                      alert('설정에서 사진 접근권한을 허용해주세요.');
                      return;
                    }
                    ImagePickerCrop.openPicker({
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
                      ImagePickerCrop.openPicker({
                        width: 500,
                        height: 500,
                        cropping: true,
                      }).then(async image => {
                        await this.setState({imgLoading:true})
                        this._postIMG(image)
                      });                
                    }else if(avail ===1){
                      alert('설정에서 저장공간 및 카메라에 대한 접근권한을 허용해주세요.')
                    }else{
                      alert('헿... 뭐지.. ㅜㅜ')
                    }
                  }
                }}
              >
              {
                this.props.img===''?(
                  <Image source={require('../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                ):(
                  <FastImage
                    style={{width:'100%',height:'100%'}}
                    source={{
                        uri: this.props.img,
                        priority: FastImage.priority.normal,
                    }}
                  />
                )
              }
              {
                this.state.imgLoading===true?(
                  <View style={styles.camera_c}>
                    <ActivityIndicator size={'small'} color="#fff" />
                  </View>
                ):(null)
              }
              </TouchableOpacity>
            </View>
            <View style={styles.hadan_right} onLayout={(event) => {
                var {x, y, width, height} = event.nativeEvent.layout;
                this.setState({
                  img_marginTop:(56-height)*0.9
                })
              }}>
              <View style={styles.hadan_right_top}>
                <TouchableOpacity style={styles.profile_id_c} onPress={()=>{
                  this.props.navigation.navigate('Setting')
                }}>
                  <Text style={styles.profile_id_txt}>{this.props.id}</Text>
                </TouchableOpacity>
                <View style={styles.sns_container}>
                  {
                    (()=>{
                      var snsList=[];
                      for (const key in this.props.sns) {
                        if(this.props.sns[key].url!==''&&this.props.sns[key].url!==undefined){
                          snsList.push(
                            <TouchableOpacity key={key} style={key=='vanhana'?styles.sns_logo_container_vanhana:styles.sns_logo_container} onPress={()=>{
                              this.props.navigation.navigate('Web',{uri:this.props.sns[key].url});
                            }}>
                              {
                                (()=>{
                                  switch(key){
                                    case 'instagram':
                                      return(<Image source={require('../assets/instagram.png')} style={styles.sns_logo}/>);
                                    case 'youtube':
                                      return(<Image source={require('../assets/youtube.png')} style={styles.sns_logo}/>); 
                                    case 'tiktok':
                                      return(<Image source={require('../assets/tiktok.png')} style={styles.sns_logo}/>); 
                                    case 'vanhana':
                                      return(<Image source={require('../assets/vanhana.jpeg')} style={styles.sns_logo}/>);   
                                      default:
                                        break;
                                  }
                                })()
                              }
                              <Image/>
                            </TouchableOpacity>
                          )
                        }
                      } 
                      return snsList;
                    })()
                  }
                </View>
              </View>
              <View style={styles.hadan_right_bottom}>
                <TouchableOpacity style={styles.profile_intro_c} onPress={()=>{
                  this.props.navigation.navigate('Introduce')
                }}
                >
                  <Text style={styles.profile_intro_txt}>{this.props.intro==''?'자기소개를 작성해주세요.':this.props.intro}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* <View style={{...styles.profile_bottom_c,marginBottom:32+this.props.bottom}}>
              <TouchableOpacity style={{...styles.profile_bottom_btn}}  onPress={()=>{
                  this.props.navigation.navigate('SearchProfile',{
                    activePage:0,
                    user_id:this.state.user_id
                  })
                }}
              >
              <Text style={styles.profile_bottom_btn_txt_s}>{this.props.group.length}</Text>
              <Text style={styles.profile_bottom_btn_txt}>그룹</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.profile_bottom_btn}} onPress={()=>{
                  this.props.navigation.navigate('SearchProfile',{
                    activePage:1,
                    user_id:this.state.user_id
                  })
                }}
            >
              <Text style={styles.profile_bottom_btn_txt_s}>{this.props.follower}</Text>
              <Text style={styles.profile_bottom_btn_txt}>팔로워</Text>        
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.profile_bottom_btn}} onPress={()=>{
                this.props.navigation.navigate('SearchProfile',{
                  activePage:2,
                  user_id:this.state.user_id
                })
              }}
            >
              <Text style={styles.profile_bottom_btn_txt_s}>{this.props.follow.length}</Text>
              <Text style={styles.profile_bottom_btn_txt}>팔로잉</Text>
            </TouchableOpacity>
          </View> */}
        </View>
        {
          this.state.add_toggle==true?(
            <TouchableOpacity style={{width,height,position:'absolute',top:0,left:0,backgroundColor:'rgba(0,0,0,0.6)',justifyContent:'center',alignItems:'center',flexDirection:'row'}}
            activeOpacity={1}
            onPress={()=>{
              this.setState({add_toggle:false})
            }}
            >
              <TouchableOpacity style={styles.add_btn_c}
                activeOpacity={1}
                onPress={async ()=>{
                  if(Platform.OS === 'ios'){
                    const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
                    const mikeStatus = await request(PERMISSIONS.IOS.MICROPHONE);
                    if(cameraStatus!='granted'){
                      alert('설정에서 카메라 접근권한을 허용해주세요.');
                      return;
                    }
                    if(mikeStatus!='granted'){
                      alert('설정에서 마이크 접근권한을 허용해주세요.');
                      return;
                    }
                    console.log('1111')
                    ImagePickerCrop.openCamera({
                      mediaType: 'video',
                    }).then(async video => {
                      console.log('222')
                      this._postProfileVIDEO(video.path);
                    });
                    //
                    //
                    // ImagePicker.launchCamera(options, async (response) => {
                    //   if (response.didCancel) {
                    //     console.log('User cancelled image picker');
                    //   } else if (response.error) {
                    //     console.log('ImagePicker Error: ', response.error);
                    //   } else if (response.customButton) {
                    //     console.log('User tapped custom button: ', response.customButton);
                    //   } else {
                    //     console.log(response);
                    //     if(response.path!=null||response.path!=undefined){
                    //       this._postProfileVIDEO(response.path)
                    //     }else{
                    //       this._postProfileVIDEO(response.uri)
                    //     }
                    //   }
                    // }); 
                  }else{
                    let avail=await requestCameraPermission();
                    if(avail ===0){ 
                      ImagePickerCrop.openCamera({
                        mediaType: 'video',
                      }).then(async video => {
                        this._postProfileVIDEO(video.path)
                      });
                      //
                      //      
                      // ImagePicker.launchCamera(options, async (response) => {
                      //   if (response.didCancel) {
                      //     console.log('User cancelled image picker');
                      //   } else if (response.error) {
                      //     console.log('ImagePicker Error: ', response.error);
                      //   } else if (response.customButton) {
                      //     console.log('User tapped custom button: ', response.customButton);
                      //   } else {
                      //     console.log(response);
                      //     if(response.path!=null||response.path!=undefined){
                      //       this._postProfileVIDEO(response.path)
                      //     }else{
                      //       this._postProfileVIDEO(response.uri)
                      //     }
                      //   }
                      // }); 
                    }else if(avail ===1){
                      alert('설정에서 저장공간 및 카메라에 대한 접근권한을 허용해주세요.')
                    }else{
                      alert('헿... 뭐지.. ㅜㅜ')
                    }
                  }
                }}
              >
                <View style={{...styles.add_btn}}>
                  <Image style={{width:40,height:40}} source={require('../assets/post_camera.png')}/>
                </View>
                <Text style={styles.add_btn_txt}>카메라</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.add_btn_c}
                activeOpacity={1}
                onPress={async ()=>{
                  if(Platform.OS=='ios'){
                    const phtoStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                    if(phtoStatus!='granted'){
                      alert('설정에서 사진 접근권한을 허용해주세요.');
                      return;
                    }
                    //
                    ImagePickerCrop.openPicker({
                      mediaType: "video",
                      hideBottomControls:false
                    }).then(async (video) => {
                      this._postProfileVIDEO(video.path);
                    });
                    // ImagePickerCrop.openPicker({
                    //   mediaType: "video",
                    //   hideBottomControls:false
                    // }).then(async (video) => {
                    //   this._postProfileVIDEO(video.path)
                    // });
                  }else{
                    let avail=await requestCameraPermission();
                    if(avail ===0){       
                      ImagePicker.launchImageLibrary(options, async (response) => {
                        console.log('Response = ', response);
                        if (response.didCancel) {
                          console.log('User cancelled image picker');
                        } else if (response.error) {
                          console.log('ImagePicker Error: ', response.error);
                        } else if (response.customButton) {
                          console.log('User tapped custom button: ', response.customButton);
                        } else {
                          this._postProfileVIDEO(response.uri)
                        }
                      });
                    }else if(avail ===1){
                      alert('설정에서 저장공간 및 카메라에 대한 접근권한을 허용해주세요.')
                    }else{
                      alert('헿... 뭐지.. ㅜㅜ')
                    }
                  }
                }}
              >
                <View style={{...styles.add_btn}}>
                  <Image style={{width:40,height:40}} source={require('../assets/post_gallery.png')}/>
                </View>
                <Text style={styles.add_btn_txt}>갤러리</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ):(null)
        }
        {
          this.props.progress!=0?(
            <AnimatedVideoProgress progress={this.props.progress}/>
          ):(null)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },
  leftbtn:{
    position:'absolute',
    width:40,
    height:40,
    backgroundColor:'rgba(0,0,0,0.4)',
    left:16,
    zIndex:30,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:40,
  },
  hadan_c:{
    width:width,
    minHeight:56,
    // backgroundColor:'blue',
    flexDirection:'row',
    marginBottom:24
  },
  hadan_left:{
    width:88,
    minHeight:56,
    // backgroundColor:'red',
    // paddingTop:8,
    justifyContent:'center'
  },
  hadan_right:{
    width:width-88,
    minHeight:56,
    // backgroundColor:'green',
    justifyContent:'center'
  },
  hadan_right_top:{
    width:width-88,
    // backgroundColor:'blue',
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:4,
    flexDirection:'row',
  },
  hadan_right_bottom:{
    width:width-88,
    // backgroundColor:'purple',
    flexDirection:'row',
    alignItems:'center'
  },
  scorll_info_header_img_c:{
    width:48,
    height:48,
    borderRadius:100,
    overflow:'hidden',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.8)',
    marginLeft:24
  },
  profile_id_c:{
    paddingLeft:0,
    // backgroundColor:'black'
  },
  profile_id_txt:{
    fontSize:22,
    color:'#fff',
    fontWeight:'bold'
  },
  profile_intro_c:{
    // backgroundColor:'red',
    paddingLeft:0,
    paddingRight:32,
    marginLeft:0,
    flexDirection:'row',
  },
  profile_intro_txt:{
    fontSize:14,
    color:'rgba(255,255,255,0.8)',
    fontWeight:'600',
    paddingVertical:4
  },
  sns_container:{
    flexDirection:'row',
    height:48,
    alignItems:'center',
    marginLeft:8
  },
  sns_logo_container_vanhana:{
    width:28,
    height:28,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:4,
    backgroundColor:'#fff',
    borderRadius:40,
    overflow:'hidden'
  },
  sns_logo_container:{
    width:32,
    height:32,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:4,
  },
  sns_logo:{
    width:24,
    height:24,
  },
  profile_bottom_c:{
    width:width-48,
    marginLeft:24,
    height:32,
    flexDirection:'row',
    justifyContent:'space-around',
    marginBottom:32,
  },
  profile_bottom_btn:{
    paddingHorizontal:12,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"rgba(0,0,0,0.4)",
    flexDirection:'row',
    height:32,
    borderRadius:40,
  },
  profile_bottom_btn_txt_s:{
    fontSize:14,
    color:'rgba(255,255,255,0.9)',
    fontWeight:'bold',
    marginRight:8
  },
  profile_bottom_btn_txt:{
    fontSize:14,
    color:'rgba(255,255,255,0.8)',
    fontWeight:'bold'
  },
  dot3_c:{
    position:'absolute',
    right:8,
    width:40,
    height:40,
    borderRadius:48,
    backgroundColor:'rgba(0,0,0,0.3)',
    justifyContent:'center',
    alignItems:'center'
  },
  post_video_c:{
    height:32,
    backgroundColor:'rgba(0,0,0,0)',
    position:'absolute',
    top:STATUSBAR_HEIGHT+24,
    left:88,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:12,
    flexDirection:'row',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.6)'
  },
  post_video_c_big:{
    height:32,
    backgroundColor:'rgba(0,0,0,0)',
    position:'absolute',
    left:80,
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:12,
    flexDirection:'row',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.6)'
  },
  post_video_txt:{
    fontSize:14,
    color:'rgba(255,255,255,0.8)',
    fontWeight:'bold'
  },
  add_btn_c:{
    width:80,
    height:96,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:16
  },
  add_btn:{
    width:64,
    height:64,
    backgroundColor:'#fff',
    borderRadius:56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:16
  },
  add_btn_txt:{
    marginTop:12,
    fontWeight:'bold',
    fontSize:14,
    color:'rgba(255,255,255,0.9)'
  },
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    user_id:state.setinfo.user_id,
    id:state.setinfo.id,
    coin:state.setinfo.coin,
    logintype:state.setinfo.logintype,
    ph:state.setinfo.ph,
    email:state.setinfo.email,
    pwindex:state.setinfo.pwindex,
    img:state.setinfo.img,
    video:state.setinfo.video,
    intro:state.setinfo.intro,
    sns:state.setinfo.sns,
    price:state.setinfo.price,
    barStyle:state.sidefunc.barStyle,
    follow:state.setinfo.follow,
    follower:state.setinfo.follower,
    group:state.setinfo.group,
    bottom:state.sidefunc.bottom,
    progress:state.sidefunc.progress,

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
    setimg: (img)=>{
      dispatch(actions.setimg(img));
    },
    setvideo: (video)=>{
      dispatch(actions.setvideo(video));
    },
    setintro: (intro)=>{
      dispatch(actions.setintro(intro));
    },
    setprice: (price)=>{
      dispatch(actions.setprice(price));
    },
    barStyle_f: (barStyle)=>{
      dispatch(actions.barStyle(barStyle));
    },
    setgroup: (group)=>{
      dispatch(actions.setgroup(group));
    },
    page_f: (page)=>{
      dispatch(actions.page(page));
    },
    progress_f: (progress)=>{
      dispatch(actions.progress(progress));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(MyBookScreen);