import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,TextInput,ScrollView,Dimensions,StatusBar,Platform,FlatList,Animated, Easing,Keyboard} from 'react-native';
import Dialog from './dialog/Dialog';
import DialogA from './dialog/DialogA';
import DialogA2 from './dialog/DialogA';
import Toast from 'react-native-simple-toast';
import {KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Video from 'react-native-video';
import SelectedPerson2 from './Tab/list/SelectedPerson2';
import SelectedGroup2 from './Tab/list/SelectedGroup2';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-picker';
import ImagePickerCrop from 'react-native-image-crop-picker';

import {URL,requestCameraPermission} from '../config';
import { NavigationEvents } from 'react-navigation';

import RNVideoHelper from 'react-native-video-helper';
import {check,request, PERMISSIONS} from 'react-native-permissions';

const STATUSBAR_HEIGHT_R = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'videos',
    // mediaType:'video'
  },
  durationLimit:60,
  videoQuality:'high',
  mediaType:'video'
};

const {width,height}=Dimensions.get("window");
class PostScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      dialog:false,
      dialogA:false,
      dialogA2:false,
      text:'',
      roll:'',
      mime:'',
      personList:[],
      groupList:[],
      progress_show:new Animated.Value(0.5),
      save:true,
      show:100,
    }
    this._ok=this._ok.bind(this);
    this._cancel=this._cancel.bind(this);
    this._postVIDEO=this._postVIDEO.bind(this);
    this._selectPerson=this._selectPerson.bind(this);
    this._selectGroup=this._selectGroup.bind(this);
    this.setShowRange=this.setShowRange.bind(this);
    this._keyboardDidShow=this._keyboardDidShow.bind(this);
    this._keyboardDidHide=this._keyboardDidHide.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  update_index=false;
  resultcoin=0;
  componentWillMount () {
    if(Platform.OS==='ios'){
      this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);
    }else{
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  async _keyboardDidShow () {
    this.refs._scrollView.scrollTo(width);
  }
  async _keyboardDidHide () {
  }
  _postVIDEO = () =>{
    const sourceUri = this.state.roll;
    let text=this.state.text;
    let personList=this.state.personList;
    let groupList=this.state.groupList;
    let show =this.state.show;
    let mime=this.state.mime;
    this.props.progress_f(2);
    let formData = new FormData();
    formData.append("file", {
      uri: sourceUri,
      type: mime,
      name: parseInt(Date.now())+'jaesik',
    });
    formData.append('key',this.props._id);
    formData.append('user_id',this.props.user_id);
    formData.append('text',text);
    var personList_temp=personList.map(em=>em.user_id);
    var groupList_temp=groupList.map(em=>em.id);
    formData.append('personList',JSON.stringify(personList_temp));
    formData.append('groupList',JSON.stringify(groupList_temp));
    formData.append('show',show);
    formData.append('url_temp',sourceUri);
    const options = {
      method: 'POST',
      body: formData
    };
    console.log('uploadvideo!');
    fetch(`${URL}/uploadvideo`, options)
    .then((response) => response.json())
    .then((responseJson) => {
      this.props.progress_f(0);
      this.props.mainrefresh_f(parseInt(Date.now()))
      if(responseJson.status===100){
        Toast.show('동영상을 정상적으로 업로드 하였습니다.')
      }else{
        Toast.show('동영상 업로드중 문제가 발생하였습니다.');
      }

    })
    .catch((error) => {
      console.error(error);
    });
  }
  _ok(){
    this._postVIDEO();
    this.props.navigation.goBack();
  }
  async _cancel(){
    await this.setState({
      dialog:false,
      dialogA:false,
      dialogA2:false,
    });
    this.refs._scrollView.scrollResponderScrollToEnd();
  }
  async _selectPerson(profile,boolean){
    var selected=this.state.personList;
    if(boolean===true){
      selected.unshift(profile);
    }else{
      var s_i=selected.findIndex(em=>em.user_id==profile.user_id);
      selected.splice(s_i,1);
    }    
    await this.setState({
      personList:selected
    });
  }
  async _selectGroup(profile,boolean){
    var selected=this.state.groupList;
    if(boolean===true){
      selected.unshift(profile);
    }else{
      var s_i=selected.findIndex(em=>em.id==profile.id);
      selected.splice(s_i,1);
    }    
    await this.setState({
      groupList:selected
    });
  }
  setShowRange(){
    if(this.state.show==100){
      this.setState({
        show:101
      })
      Animated.timing(this.state.progress_show, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
      }).start();
    }else{
      this.setState({
        show:100
      })
      Animated.timing(this.state.progress_show, {
        toValue: 0.5,
        duration: 200,
        easing: Easing.linear,
      }).start();
    }
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"padding":""} enabled>
        <NavigationEvents
          onWillFocus={async payload => {
            var personList=await this.props.navigation.getParam('personList',[]);
            var groupList=await this.props.navigation.getParam('groupList',[]);
            this.setState({
              personList,
              groupList,
              paused:false
            });
          }}
          onWillBlur={payload => {
            this.setState({
              paused:true
            })
          }
          }
        />
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <View style={{marginTop:STATUSBAR_HEIGHT_R}}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{this.props.navigation.goBack()}}
          >
            <Image source={require('../assets/left_tri.png')} style={{width:20,height:20}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finish} onPress={()=>{
              this.refs.mainInput.blur();
              if(this.state.roll==''){
                this.setState({
                  dialogA2:true
                })
                return;
              }
              if(this.state.groupList.length+this.state.personList.length==0){
                this.setState({
                  dialogA:true
                })
              }else{
                this.setState({dialog:true})
              }
            }}>
            <Text style={styles.finish_txt}>보내기</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.main}
          keyboardShouldPersistTaps="always"
          ref='_scrollView'
          scrollEventThrottle={1}
        >
          {
            this.state.roll===''?(null):(
              <View style={{width,height:width,marginBottom:16}}>
                <Video source={{uri: this.state.roll}}   
                  muted={false}
                  repeat={true}
                  paused={this.state.paused}
                  resizeMode={'contain'}
                  style={styles.backgroundVideo} 
                />
              </View>
            )
          }
          <View style={styles.input_container}>
            <TextInput 
              style={{...styles.main_input}}
              placeholder='내용을 입력해 주세요.'
              multiline={true}
              autoFocus={true}
              ref='mainInput'
              onChangeText={(text)=>{
                this.setState({text});
              }}
              value={this.state.text}
            />
          </View>
          <View style={styles.box_container} activeOpacity={1}>
            <TouchableOpacity style={{...styles.box_upper}} onPress={async ()=>{   
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
                ImagePickerCrop.openCamera({
                  mediaType: 'video',
                }).then(async video => {
                  await this.setState({
                    roll:video.path,
                    mime:video.mime
                  });
                  this.props.home1refresh_f(parseInt(Date.now()));
                });
              }else{
                let avail=await requestCameraPermission();
                if(avail ===0){       
                  ImagePickerCrop.openCamera({
                    mediaType: 'video',
                  }).then(async video => {
                    console.log(video);
                    await this.setState({
                      roll:video.path,
                      mime:video.mime
                    });
                    this.props.home1refresh_f(parseInt(Date.now()));
                  });
                }else if(avail ===1){
                  alert('설정에서 저장공간 및 카메라에 대한 접근권한을 허용해주세요.')
                }else{
                  alert('헿... 뭐지.. ㅜㅜ')
                }
              }
            }}>
              <Image style={{width:32,height:32,marginLeft:8,opacity:0.85}} source={require('../assets/post_camera.png')}/>
              <Text style={styles.box_txt}>카메라</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.box_container} activeOpacity={1}>
            <TouchableOpacity style={{...styles.box_upper}} onPress={async ()=>{
              if(Platform.OS=='ios'){
                const phtoStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                if(phtoStatus!='granted'){
                  alert('설정에서 사진 접근권한을 허용해주세요.');
                  return;
                }
                ImagePickerCrop.openPicker({
                  mediaType: "video",
                  hideBottomControls:false
                }).then(async (video) => {
                  await this.setState({
                    roll:video.path,
                    mime:video.mime
                  });
                  this.props.home1refresh_f(parseInt(Date.now()));
                });
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
                      await this.setState({
                        roll:response.uri,
                        mime:'video/mp4'
                      });
                      this.props.home1refresh_f(parseInt(Date.now()));
                    }
                  });
                }else if(avail ===1){
                  alert('설정에서 저장공간 및 카메라에 대한 접근권한을 허용해주세요.')
                }else{
                  alert('헿... 뭐지.. ㅜㅜ')
                }
              }
            }}>
              <Image style={{width:32,height:32,marginLeft:8,opacity:0.85}} source={require('../assets/post_gallery.png')}/>
              <Text style={styles.box_txt}>갤러리</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.box_container} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('FindPerson',{
              personList:this.state.personList
            })
          }}>
            <TouchableOpacity style={styles.box_upper} onPress={()=>{
              this.props.navigation.navigate('FindPerson',{
                personList:this.state.personList
              })
            }}>
              <Image style={{width:32,height:32,marginLeft:8,opacity:0.85}} source={require('../assets/post_man.png')}/>
              <Text style={styles.box_txt}>영상을 받을 사람 추가</Text>
              {/* <Image style={{width:12,height:12,marginLeft:8,opacity:0.7}} source={require('../assets/plus.png')}/> */}
            </TouchableOpacity>
            {
              this.state.personList.length>0?(
                <View style={styles.selected}>
                  <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1,}}
                    keyboardShouldPersistTaps="always"
                    data={this.state.personList}
                    keyExtractor={(item,index)=>`a${index}`}
                    horizontal={true}
                    contentContainerStyle={{marginLeft:16}}
                    renderItem={({item,index}) => {
                      return (
                        <SelectedPerson2 item={item} _select={this._selectPerson} navigation={this.props.navigation}/>
                      )
                    }}
                  />
                </View>
              ):(null)
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.box_container} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('FindGroup',{
              groupList:this.state.groupList
            })
          }}>
            <TouchableOpacity style={styles.box_upper} onPress={()=>{
              this.props.navigation.navigate('FindGroup',{
                groupList:this.state.groupList
              })
            }}>
              <Image style={{width:40,height:40,marginLeft:4,opacity:0.85}} source={require('../assets/post_group.png')}/>
              <Text style={{...styles.box_txt,marginLeft:4}}>영상을 받을 그룹 추가</Text>
              {/* <Image style={{width:12,height:12,marginLeft:8,opacity:0.7}} source={require('../assets/plus.png')}/> */}
            </TouchableOpacity>
            {
              this.state.groupList.length>0?(
                <View style={styles.selected}>
                  <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1,}}
                    keyboardShouldPersistTaps="always"
                    data={this.state.groupList}
                    keyExtractor={(item,index)=>`a${index}`}
                    horizontal={true}
                    contentContainerStyle={{marginLeft:16}}
                    renderItem={({item,index}) => {
                      return (
                        <SelectedGroup2 item={item} _select={this._selectGroup} navigation={this.props.navigation}/>
                      )
                    }}
                  />
                </View>
              ):(null)
            }
          </TouchableOpacity>
          {/* <View style={styles.show_container} >
            <TouchableOpacity style={styles.show_save} activeOpacity={1} onPress={()=>{
              this._save();
            }}>
              <Text style={styles.show_txt}>프로필에 저장</Text>
              <View style={styles.LottieView_c}>
                <LottieView style={{}} source={require('../assets/animation/toggle.json')} progress={this.state.progress_save} esizeMode="cover"/>
              </View>
            </TouchableOpacity>
          </View> */}
        </ScrollView>
        {
          this.state.dialog===true?(
            <Dialog 
              _ok={this._ok} 
              _cancel={this._cancel} 
              subject='영상편지' 
              main='위 내용으로 영상을 전송하시겠습니까?'/>
            ):(null)
        }
        {
          this.state.dialogA===true?(
            <DialogA 
              _cancel={this._cancel} 
              subject='보낼 대상 설정' 
              main={`영상편지를 받을 사람 한 명 \n혹은 그룹 하나 이상을 선택해주세요.`}/>
            ):(null)
        }
        {
          this.state.dialogA2===true?(
            <DialogA2 
              _cancel={this._cancel} 
              subject='영상 업로드' 
              main={`카메라 혹은 갤러리를 클릭하여\n영상을 업로드해주세요.`}/>
            ):(null)
        }
      </KeyboardAvoidingView>
    )
    
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  leftbtn:{
    marginLeft:0,
    height:56,
    width:56,
    justifyContent:'center',
    alignItems:'center'
  },
  subject:{
    fontSize:25,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    textAlign:'center',
    alignSelf:'center',
    marginTop:-30,
  },
  main:{
    flex:1,
    //  backgroundColor:'blue',
  },
  input_container:{
    flex:1,
    flexDirection:'row',
    borderBottomWidth:1,
    borderColor:'rgba(150,150,150,0.2)',
    paddingBottom:8
  },
  main_input:{
    marginTop:0,
    paddingHorizontal:32,
    fontSize:18,
    // marginVertical:6,
    paddingBottom:5,
    width:width,
    backgroundColor:'#fff',
    marginBottom:10,
    minHeight:40,
    maxHeight:120
  }, 
  send_subject:{
    fontSize:14,
    color:'rgba(0,0,0,0.8)',
    marginLeft:15,
    marginBottom:5,
    marginTop:24
  },
  box_container:{
    width,
    minHeight:48,
    borderBottomWidth:1,
    borderColor:'rgba(150,150,150,0.2)',
  },
  bottom_container:{
    position:'absolute',
    left:0,
    bottom:0,
    width:'100%',
    height:50,
    backgroundColor:'white',
    borderTopWidth:1,
    borderColor:'rgba(150,150,150,0.2)',
    flexDirection:'row',
    alignItems:'center',
  },
  box_upper:{
    width,
    height:48,
    flexDirection:'row',
    alignItems:'center'
  },
  box_txt:{
    fontSize:16,
    marginLeft:8,
    color:'rgba(0,0,0,0.8)'
  },
  show_container:{
    width,
    minHeight:48,
    borderBottomWidth:1,
    borderColor:'rgba(150,150,150,0.2)',
    justifyContent:'center'
  },
  show_save:{
    width,
    height:48,
    justifyContent:'center',
  },
  show_txt:{
    color:'rgba(0,0,0,0.8)',
    fontSize:16,
    marginLeft:16,
  },
  LottieView_c:{
    position:'absolute',
    top:0,
    right:16,
    width:56,
    height:48,
    // backgroundColor:'blue',
    alignItems:'center'
  },
  LottieView:{
    width:48,
    height:48,
  },
  show_info:{
    fontSize:12,
    color:'rgba(0,0,0,0.6)',
    marginTop:16,
    marginLeft:16
  },
  backgroundVideo: {
    width:width,
    height:width,
    backgroundColor:'#222',
    alignSelf:'center'
  },
  finish:{
    position:'absolute',
    top:0,
    right:0,
    width:80,
    height:50,
    justifyContent:'center',
    alignItems:'center',
  },
  finish_txt:{
    fontSize:16,
    color:'rgba(0,0,0,0.8)',
    fontWeight:'bold'
  },
  selected:{
    width:'100%',
    flexDirection:'row',
    borderBottomWidth:0.5,
    borderColor:'rgba(150,150,150,0.2)',
    alignItems:'center',
  },
  selected_title:{
    color:'#222',
    fontSize:17,
    marginLeft:20,
    marginRight:10
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
    chatroom:state.sidefunc.chatroom,
    chatlist:state.sidefunc.chatlist,
    progress:state.sidefunc.progress,
    home1refresh:state.sidefunc.home1refresh,

  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setchatroom: (coin)=>{
      dispatch(actions.setchatroom(coin));
    },
    setchatlist: (chatlist)=>{
      dispatch(actions.setchatlist(chatlist));
    },
    progress_f: (progress)=>{
      dispatch(actions.progress(progress));
    },
    home1refresh_f: (home1refresh)=>{
      dispatch(actions.home1refresh(home1refresh));
    },
    mainrefresh_f: (mainrefresh)=>{
      dispatch(actions.mainrefresh(mainrefresh));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(PostScreen);