import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,TextInput,ScrollView,Dimensions,StatusBar,Platform,FlatList,Animated, Easing,Keyboard} from 'react-native';
import Dialog from '../dialog/Dialog';
import DialogA from '../dialog/DialogA';
import DialogA2 from '../dialog/DialogA';

import Toast from 'react-native-simple-toast';
import {KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Video from 'react-native-video';
import SelectedPerson2 from './list/SelectedPerson2';
import SelectedGroup2 from './list/SelectedGroup2';
import LottieView from 'lottie-react-native';

import {URL,requestCameraPermission} from '../../config';
import { NavigationEvents } from 'react-navigation';

import RNVideoHelper from 'react-native-video-helper';
// import ImagePicker from 'react-native-image-crop-picker';

import ImagePicker from 'react-native-image-picker';

const STATUSBAR_HEIGHT_R = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

const {width,height}=Dimensions.get("window");
class SendScreen extends Component{
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
      progress_save:new Animated.Value(0.5),
      progress_show:new Animated.Value(0.5),
      save:true,
      show:100,
      keyboard:false,
      marginBottom:new Animated.Value(0),
      paused:false
    }
    this._ok=this._ok.bind(this);
    this._cancel=this._cancel.bind(this);
    this._postVIDEO=this._postVIDEO.bind(this);
    this._postVIDEO_temp=this._postVIDEO_temp.bind(this);
    this._selectPerson=this._selectPerson.bind(this);
    this._selectGroup=this._selectGroup.bind(this);
    this.setShowRange=this.setShowRange.bind(this);
    this._keyboardDidShow=this._keyboardDidShow.bind(this);
    this._keyboardDidHide=this._keyboardDidHide.bind(this);
    this.reset=this.reset.bind(this);
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
    await this.setState({
      keyboard:true
    });
    Animated.timing(this.state.marginBottom, {
      toValue: -(56+this.props.bottom),
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

  async _keyboardDidHide () {
    await this.setState({
      keyboard:false
    });
    Animated.timing(this.state.marginBottom, {
      toValue: 0,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }
  reset(){
    this.setState({
      dialog:false,
      dialogA:false,
      dialogA2:false,
      text:'',
      roll:'',
      mime:'',
      personList:[],
      groupList:[],
      show:100,
    })
  }
  _postVIDEO_temp = () =>{
    const sourceUri = this.state.roll;
    let text=this.state.text;
    let personList=this.state.personList;
    let groupList=this.state.groupList;
    let show =this.state.show;
    let mime=this.state.mime;
    this.reset();
    this.props.progress_f(0.01);
    var progress=0;
    this.props.progress_f(2);
    let formData = new FormData();
    formData.append("file", {
      uri: this.state.roll,
      type: 'video/mp4',
      name: 'profileVideo',
    });
    formData.append('key',this.props._id);
    formData.append('user_id',this.props.user_id);
    formData.append('text',text);
    var personList_temp=personList.map(em=>em.user_id);
    var groupList_temp=groupList.map(em=>em.id);
    formData.append('personList',JSON.stringify(personList_temp));
    formData.append('groupList',JSON.stringify(groupList_temp));
    formData.append('show',show);
      const options = {
        method: 'POST',
        body: formData
      };
      fetch(`${URL}/uploadvideo`, options)
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.progress_f(0);
        console.log(responseJson);
        if(responseJson.status===100){
          // this.setState({
          //   imgLoading:false
          // })
          Toast.show('동영상을 정상적으로 업로드 하였습니다.')
        }else{
          Toast.show('동영상 업로드중 문제가 발생하였습니다.');
        }
  
      })
      .catch((error) => {
        console.error(error);
      });
  }
  _postVIDEO = () =>{
    console.log('POSTVIDEO');
    const sourceUri = this.state.roll;
    let text=this.state.text;
    let personList=this.state.personList;
    let groupList=this.state.groupList;
    let show =this.state.show;
    let mime=this.state.mime;
    this.reset();
    this.props.progress_f(0.01);
    var progress=0;
    console.log('POSTVIDEO1');
    console.log(mime+'/'+sourceUri);
    RNVideoHelper.compress(sourceUri, {
        startTime: 0, // optional, in seconds, defaults to 0
        endTime: 100, //  optional, in seconds, defaults to video duration
        quality: 'low', // default low, can be medium or high
        defaultOrientation: 0 // By default is 0, some devices not save this property in metadata. Can be between 0 - 360
    }).progress(value => {
      console.log('POSTVIDEO2');

      if((value-progress)>0.1){
        progress=value;
        this.props.progress_f(value);
      }
    }).then(compressedUri => {
      console.log(compressedUri);
      return;
      this.props.progress_f(2);
      let formData = new FormData();
      formData.append("file", {
        uri: 'file://'+compressedUri,
        type: mime,
        name: 'profileVideo',
      });
      formData.append('key',this.props._id);
      formData.append('user_id',this.props.user_id);
      formData.append('text',text);
      var personList_temp=personList.map(em=>em.user_id);
      var groupList_temp=groupList.map(em=>em.id);
      formData.append('personList',JSON.stringify(personList_temp));
      formData.append('groupList',JSON.stringify(groupList_temp));
      formData.append('show',show);
        const options = {
          method: 'POST',
          body: formData
        };
        fetch(`${URL}/uploadvideo`, options)
        .then((response) => response.json())
        .then((responseJson) => {
          this.props.progress_f(0);
          console.log(responseJson);
          if(responseJson.status===100){
            // this.setState({
            //   imgLoading:false
            // })
            Toast.show('동영상을 정상적으로 업로드 하였습니다.')
          }else{
            Toast.show('동영상 업로드중 문제가 발생하였습니다.');
          }
    
        })
        .catch((error) => {
          console.error(error);
        });
    }).catch((e)=>{
      console.log(e)
    });
  }
  _ok(){
    this._postVIDEO();
    this.props.navigation.navigate('Home')
  }
  _cancel(){
    this.setState({
      dialog:false,
      dialogA:false,
      dialogA2:false,
    })
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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <NavigationEvents
          onDidFocus={async payload => {
            this.props.barStyle_f('dark-content');
            this.setState({
              paused:false
            })
          }}
          onWillBlur={async payload =>{
            this.setState({
              paused:true
            })
          }}
        />
        <StatusBar barStyle={this.props.barStyle} backgroundColor={'transparent'} translucent={true}/>
        <View style={{marginTop:STATUSBAR_HEIGHT_R,height:56}}>
          {
            this.state.keyboard===true?(
              <TouchableOpacity style={styles.leftbtn} onPress={()=>{
                this.refs.mainInput.blur();
              }}>
                <Image source={require('../../assets/left_mint.png')} style={{width:40,height:40,opacity:0.7}}/>
              </TouchableOpacity>
            ):(null)
          }
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
        >
          <View style={styles.input_container}>
            <TouchableOpacity onPress={async ()=>{
              const options = {
                title: 'Select Avatar',
                customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
                storageOptions: {
                  skipBackup: true,
                  path: 'videos',
                  // mediaType:'video'

                },
                durationLimit:60,
                videoQuality:'low',
                mediaType:'video'
              };
              // ImagePicker.launchCamera(options, async (response) => {
              //   // Same code as in above section!
              //   if (response.didCancel) {
              //     console.log('User cancelled image picker');
              //   } else if (response.error) {
              //     console.log('ImagePicker Error: ', response.error);
              //   } else if (response.customButton) {
              //     console.log('User tapped custom button: ', response.customButton);
              //   } else {
              //     const source = { uri: response.uri };
              //     console.log(response);
              //     await this.setState({
              //       roll:response.path,
              //       mime:'video/mp4'
              //     });
              //     this.props.home1refresh_f(parseInt(Date.now()));
              //     // You can also display the image using data:
              //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
               
              //   }
                
              // });
              // return;
              ImagePicker.launchImageLibrary(options, async (response) => {
                console.log('Response = ', response);
               
                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.error) {
                  console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                  console.log('User tapped custom button: ', response.customButton);
                } else {
                  const source = { uri: response.uri };
               console.log(response);
               await this.setState({
                roll:response.path,
                mime:'video/mp4'
              });
              this.props.home1refresh_f(parseInt(Date.now()));
                  // You can also display the image using data:
                  // const source = { uri: 'data:image/jpeg;base64,' + response.data };
               
                }
              });
              return;
              // ImagePicker.showImagePicker(options, (response) => {
              //   console.log('Response = ', response);
               
              //   if (response.didCancel) {
              //     console.log('User cancelled image picker');
              //   } else if (response.error) {
              //     console.log('ImagePicker Error: ', response.error);
              //   } else if (response.customButton) {
              //     console.log('User tapped custom button: ', response.customButton);
              //   } else {
              //     const source = { uri: response.uri };
              //  console.log(source);
              //     // You can also display the image using data:
              //     // const source = { uri: 'data:image/jpeg;base64,' + response.data };
               
              //   }
              // });
                return;
              if(Platform.OS === 'ios'){
                ImagePicker.openPicker({
                  mediaType: "video",
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
                  ImagePicker.openPicker({
                    mediaType: "video",
                  }).then(async (video) => {
                    alert(video.mime);
                    return;
                    await this.setState({
                      roll:video.path,
                      mime:video.mime
                    });
                    this.props.home1refresh_f(parseInt(Date.now()));
                  }).catch(e=>{
                    alert(e);
                  });
                }else if(avail ===1){
                  alert('흥!')
                }else{
                  alert('헿... 뭐지.. ㅜㅜ')
                }
              }
            }}>
              {
                this.state.roll==''?(
                  <View style={{...styles.backgroundVideo,backgroundColor:'#222',justifyContent:'center',alignItems:'center'}}>
                    <Image source={require('../../assets/add_white.png')} style={{width:24,height:24,opacity:0.9}}/>
                  </View>
                ):(
                  <Video source={{uri: this.state.roll}}   
                    muted={false}
                    repeat={true}
                    paused={this.state.paused}
                    resizeMode={'cover'}
                    onBuffer={(em)=>{
                      console.log('aa')
                      // console.log('buffer!!'+this.props.item.index+'/'+em.isBuffering);
                    }} 
                    onLoad={()=>{
                      console.log('onLoad:'+this.props.index)
                      this.setState({
                        pauseIndex:true
                      })
                    }}
                    style={styles.backgroundVideo} 
                  />
                )
              }
            </TouchableOpacity>
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
          <TouchableOpacity style={styles.box_container} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('FindPerson',{
              personList:this.state.personList,
              from:'Send'
            })
          }}>
            <TouchableOpacity style={styles.box_upper} onPress={()=>{
              this.props.navigation.navigate('FindPerson',{
                personList:this.state.personList,
                from:'Send'
              })
            }}>
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
              groupList:this.state.groupList,
              from:'Send'
            })
          }}>
            <TouchableOpacity style={styles.box_upper} onPress={()=>{
              this.props.navigation.navigate('FindGroup',{
                groupList:this.state.groupList,
                from:'Send'
              })
            }}>
              <Text style={styles.box_txt}>영상을 받을 그룹 추가</Text>
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
                <LottieView style={{}} source={require('../../assets/animation/toggle.json')} progress={this.state.progress_save} esizeMode="cover"/>
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
              main={`왼쪽 상단의 검정색 박스를 클릭하여 \n 영상을 선택해주세요.`}/>
            ):(null)
        }
        <Animated.View style={{...styles.bottom_container,
          height:(56+this.props.bottom),
          position:this.state.keyboard==false?null:'absolute',
          bottom:this.state.marginBottom}}>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Home')
          }}>
            <Image source={require(`../../assets/homeBtn_outlined.png`)} style={{width:42*width/450,height:42*width/450,opacity:0.7}}/> 
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Chat')
          }}>
            <Image source={require(`../../assets/chatBtn_outlined_black.png`)} style={{width:40*width/450,height:40*width/450,opacity:0.7}}/>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Send')
          }}>
            <Image source={require(`../../assets/sendBtn_outlined_pink.png`)} style={{width:48*width/450,height:48*width/450,opacity:0.8}}/> 
          </TouchableOpacity>  
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Search')
          }}>
            <Image source={require(`../../assets/searchBtn_outlined_black.png`)} style={{width:40*width/450,height:40*width/450,opacity:0.7}}/> 
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Profile')
          }}>
            <Image source={require(`../../assets/profileBtn_outlined_black.png`)} style={{width:38*width/450,height:38*width/450,opacity:0.7}}/>
          </TouchableOpacity>
          {/* <View style={{width,height:27,borderWidth:1,position:'absolute',top:15}}/> */}
        </Animated.View>
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
    paddingHorizontal:15,
    fontSize:15,
    // marginVertical:6,
    paddingBottom:5,
    width:width-width*0.2-5,
    backgroundColor:'#fff',
    marginBottom:10
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
    marginLeft:16,
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
    width:width*0.2,
    height:width*0.2*1.7,
    borderRadius:3,
    marginLeft:5,
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
  bottom_container:{
    flexDirection:'row',
    bottom:0,
    left:0,
    width,
    backgroundColor:'rgba(0,0,0,0)',
    borderTopWidth:0.5,
    borderColor:'rgba(100,100,100,0.3)'
  },
  bottom_button:{
    width:width/5,
    height:56,
    backgroundColor:'rgba(0,0,0,0)',
    justifyContent:'center',
    alignItems:'center'
  }
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
    bottom:state.sidefunc.bottom,
    barStyle:state.sidefunc.barStyle,
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
    barStyle_f: (barStyle)=>{
      dispatch(actions.barStyle(barStyle));
    },
    progress_f: (progress)=>{
      dispatch(actions.progress(progress));
    },
    home1refresh_f: (home1refresh)=>{
      dispatch(actions.home1refresh(home1refresh));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(SendScreen);