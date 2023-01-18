import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,Animated,TouchableOpacity,ActivityIndicator} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL,STATUSBAR_HEIGHT,requestCameraPermission} from '../config';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image'
import Toast from 'react-native-simple-toast';
import { NavigationEvents } from 'react-navigation';
import RNVideoHelper from 'react-native-video-helper';
import VideoProgress from './dialog/VideoProgress';
import VideoPannel from './Tab/list/VideoPannel';
import DialogP from './dialog/DialogP';


const AnimatedVideoProgress= Animated.createAnimatedComponent(VideoProgress);

const {width,height}=Dimensions.get("window");
class BookScreen extends React.Component {
  scroll = new Animated.Value(0);
  headerY;
  constructor(props){
    super(props);
    var item=this.props.navigation.getParam('item');
    this.state={
      scrollY: new Animated.Value(0),
      imgLoading:false,
      activePage:0,
      currentPage:0,
      paused:false,
      group:[],
      follower:0,
      follow:[],
      follow_state:this.props.follow.findIndex(em=>em.user_id==item.user_id)==-1?false:true,
      img_marginTop:0,
      video:'',
      dialogP:false
    }
    this._follow=this._follow.bind(this);
    this.following=this.following.bind(this);
    this.unfollowing=this.unfollowing.bind(this);
    this._dialogP=this._dialogP.bind(this);

  };
  static navigationOptions = {
    header:null
  };
  _dialogP(boolean,user_id){
    this.setState({
      dialogP:boolean,
      user_id
    })
  }
  followindex=0;
  async following(){
    var follow_temp=this.props.follow;
    if(follow_temp.findIndex(em=>em.user_id==this.state.user_id)==-1){
      follow_temp.unshift({
        user_id:this.state.user_id,
        id:this.state.id,
        img:this.state.img
      });
      await this.props.setfollow([])
      this.props.setfollow(follow_temp);
    }
    let data={
      user_id:this.state.user_id,
      _id:this.props._id
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/following`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.followindex===1){
          this.followindex=0;
        }else if(this.followindex===2){
          this.unfollowing();
        }
      }else{
        await this.setState({
          follow_state:false
        });
        this.followindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async unfollowing(){
    var follow_temp=this.props.follow;
    var f_i=follow_temp.findIndex(em=>em.user_id==this.state.user_id);
    if(f_i!==-1){
      follow_temp.splice(f_i,1);
      await this.props.setfollow([])
      this.props.setfollow(follow_temp);
    }
    let data={
      user_id:this.state.user_id,
      _id:this.props._id
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/unfollowing`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.followindex===2){
          this.followindex=0;
        }else if(this.followindex===1){
          this.following();
        }
      }else{
        await this.setState({
          follow_state:true
        })
        this.followindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _follow(){
    if(this.state.follow_state===false){
      await this.setState(prev=>({
        follow_state:true,
        follower:prev.follower+1
      }))
      if(this.followindex===0){
        this.following();
      }
      this.followindex=1;
    }else{
      await this.setState(prev=>({
        follow_state:false,
        follower:prev.follower-1
      }))
      if(this.followindex===0){
        this.unfollowing();
      }
      this.followindex=2;
    }
  }
  async componentDidMount(){
    var item=await this.props.navigation.getParam('item');
    console.log(item);
    await this.setState({
      user_id:item.user_id,
      id:item.id,
      img:item.img
    });
    let data={
      user_id:this.state.user_id      
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getprofile`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        console.log(responseJson);
        this.setState({
          video:responseJson.profile.video,
          intro:responseJson.profile.intro,
          sns:responseJson.profile.sns,
          price:responseJson.profile.price,
          group:responseJson.group,
          follower:responseJson.follower,
          follow:responseJson.follow,
        });
      }else{
        console.log('get profile error');
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
            this.props.page_f('Book');
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
            this.state.video==''?(
              null
            ):(
              <VideoPannel uri={this.state.video} paused={this.state.paused}/>
            )
          }
          <View style={{width,height:56,position:'absolute',top:STATUSBAR_HEIGHT,left:0,flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity style={styles.leftbtn} onPress={()=>{
            this.props.navigation.goBack();
          }}>
            <Image source={require('../assets/left_white.png')} style={{width:24,height:24}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dot3_c} onPress={()=>{
                // this.props.navigation.navigate('Setting')
                this.setState({
                  dialogP:true
                })
            }}>
              <Image style={{width:28,height:28,opacity:0.9}} source={require('../assets/3dot.png')}/>
            </TouchableOpacity>
          </View>
          <View style={{...styles.hadan_c,marginBottom:this.props.bottom+32}}>
            <View style={styles.hadan_left}>
              <View 
                style={{...styles.scorll_info_header_img_c,marginTop:this.state.img_marginTop}}
              >
              {
                this.state.img===''?(
                  <Image source={require('../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                ):(
                  <FastImage
                    style={{width:'100%',height:'100%'}}
                    source={{
                        uri: this.state.img,
                        priority: FastImage.priority.normal,
                    }}
                  />
                )
              }
              </View>
            </View>
            <View style={styles.hadan_right} onLayout={(event) => {
                var {x, y, width, height} = event.nativeEvent.layout;
                this.setState({
                  img_marginTop:(56-height)*0.9
                })
              }}>
              <View style={styles.hadan_right_top}>
                <View style={styles.profile_id_c}>
                  <Text style={styles.profile_id_txt}>{this.state.id}</Text>
                </View>
                <View style={styles.sns_container}>
                  {
                    (()=>{
                      var snsList=[];
                      for (const key in this.state.sns) {
                        if(this.state.sns[key].url!==''&&this.state.sns[key].url!==undefined){
                          snsList.push(
                            <TouchableOpacity key={key} style={key=='vanhana'?styles.sns_logo_container_vanhana:styles.sns_logo_container} onPress={()=>{
                              this.props.navigation.navigate('Web',{uri:this.state.sns[key].url});
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
              {
                this.state.intro!=''?(
                  <View style={styles.hadan_right_bottom}>
                    <View style={styles.profile_intro_c}>
                      <Text style={styles.profile_intro_txt}>{this.state.intro}</Text>
                    </View>
                  </View>
                ):(null)
              }
            </View>
          </View>
          <View style={{...styles.sidebar,bottom:196+this.props.bottom}}>
            <TouchableOpacity style={styles.sidebar_ripple_c} onPress={async ()=>{
              this.props.navigation.navigate('Post',{
                personList:[{
                  user_id:this.state.user_id,
                  img:this.state.img,
                  id:this.state.id
                }]
              });
            }}>
              <Image style={{width:32,height:32,opacity:0.9}} source={require('../assets/send_paper.png')}/>
              <Text style={{color:'#fff',fontSize:12,fontWeight:'bold',marginTop:10}}>영상</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebar_ripple_c} onPress={async ()=>{
              this.props.navigation.push('Talking',{item:{
                user_id:this.state.user_id,
                id:this.state.id,
                img:this.state.img,
                bedge:0
              }});
            }}>
              <Image style={{width:40,height:40,opacity:0.88}} source={require('../assets/chat_filled_white.png')}/>
              <Text style={{color:'#fff',fontSize:12,fontWeight:'bold',marginTop:10}}>1:1 채팅</Text>
            </TouchableOpacity>
            {
              this.state.follow_state===true?(
                <TouchableOpacity style={styles.sidebar_ripple_c} onPress={this._follow}>
                  <Image style={{width:48,height:48,opacity:0.88,marginLeft:-4}} source={require('../assets/follow_filled_pink.png')}/>
                  <Text style={{color:'#fff',fontSize:12,fontWeight:'bold',marginTop:4}}>친구</Text>
                </TouchableOpacity>
              ):(
                <TouchableOpacity style={styles.sidebar_ripple_c} onPress={this._follow}>
                  <Image style={{width:48,height:48,opacity:0.88,marginLeft:-4}} source={require('../assets/follow_filled_white.png')}/>
                  <Text style={{color:'#fff',fontSize:12,fontWeight:'bold',marginTop:4}}>친구추가</Text>
                </TouchableOpacity>
              )
            }
          </View>
        </View>
        {
          this.props.progress!=0?(
            <AnimatedVideoProgress progress={this.props.progress}/>
          ):(null)
        }
        {
          this.state.dialogP===true?(
            <DialogP 
              _dialogP={this._dialogP} 
              _id={this.props._id} 
              user_id={this.props.user_id} 
              post_user_id={this.state.user_id} 
              _back={()=>{this.props.navigation.goBack()}}
              follow={this.props.follow}
              setfollow={this.props.setfollow}
              chatlist={this.props.chatlist}
              setchatlist={this.props.setchatlist}
              mainrefresh_f={this.props.mainrefresh_f}
            />
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
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:4
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
  scorll_info_header_img_c_big:{
    width:96,
    height:96,
    borderRadius:100,
    overflow:'hidden',
    alignSelf:'center',
    marginBottom:24
  },
  scorll_info_header_button2:{
    position:'absolute',
    right:16,
    width:64,
    paddingHorizontal:8,
    height:32,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:8,
    borderWidth:1,
    borderRadius:2,
    borderColor:'rgba(255,255,255,0.8)',
    borderRadius:40
  },
  scorll_info_header_button2_txt:{
    fontSize:15,
    color:'rgba(255,255,255,0.8)',
    fontWeight:'bold',
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
    // backgroundColor:'blue',
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
  sidebar:{
    position:'absolute',
    right:0,
    bottom:140,
    width:70,
    height:230,
    // backgroundColor:"red",
    alignItems:'center',
    justifyContent:'space-between'
  },
  sidebar_ripple_c:{
    width:56,
    height:56,
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'yellow'
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
    chatlist:state.sidefunc.chatlist,

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
    setfollow: (follow)=>{
      dispatch(actions.setfollow(follow));
    },
    setchatlist: (chatlist)=>{
      dispatch(actions.setchatlist(chatlist));
    },
    mainrefresh_f: (mainrefresh)=>{
      dispatch(actions.mainrefresh(mainrefresh));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(BookScreen);