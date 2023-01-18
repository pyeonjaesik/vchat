import React,{Component} from 'react';
import {View, StyleSheet,Dimensions,Image,Text,TouchableOpacity,StatusBar,Platform,BackHandler} from 'react-native';
import FastImage from 'react-native-fast-image'
import Video from 'react-native-video';
import { Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import {URL,_isConnected, STATUSBAR_HEIGHT} from '../config';
import { connect } from 'react-redux';
import * as actions from '../actions';
import DialogV from './dialog/DialogV';
import Ripple from './Ripple';
import Comment from './Comment';

import { NavigationEvents } from 'react-navigation';

var RNFS = require('react-native-fs');

const {width,height}=Dimensions.get("window");
let containerCount = 0;
class VideoScreen extends React.Component {
  constructor(props) {
    super(props);
    this._containerId = containerCount++;
    this.state={
      pauseIndex:false,
      roll:'',
      path:'',
      info:{
        width:100,
        height:190
      },
      numberOfLines:4,
      view:true,
      dialogV:false,
      loading:true,
      netinfo:'connected',
      ripple:false,
      comment:false,
      playing:true,
      backInt:0,

    }
    this.love=this.love.bind(this);
    this.loving=this.loving.bind(this);
    this.unloving=this.unloving.bind(this);  
    this._postVIDEO=this._postVIDEO.bind(this);
    this._read=this._read.bind(this);
    this._love=this._love.bind(this);
    this._unlove=this._unlove.bind(this);
    this._dialogV=this._dialogV.bind(this);
    this._ripple=this._ripple.bind(this);
    this._comment=this._comment.bind(this);
    this._getfetch=this._getfetch.bind(this);
    this._alarmRead=this._alarmRead.bind(this);
    this.backAction=this.backAction.bind(this);

  }
  static navigationOptions = {
    header:null
  };
  path_name='';
  likeindex=0;
  _dialogV(boolean,post_user_id,post_id){
    this.setState({
      dialogV:boolean,
      post_user_id,
      post_id
    })
  }
  _ripple = (boolean,post_id)=>{
    this.setState({
      ripple:boolean,
      comment:false,
      post_id
    });
  }
  _comment = (boolean,post_id,post_user_id)=>{
    this.setState({
      comment:boolean,
      ripple:false,
      post_id,
      post_user_id
    });
  }
  _love=(post_id)=>{
    var lv_temp=this.props.lv;
    if(lv_temp.indexOf(post_id)===-1){
      lv_temp.unshift(post_id);
      this.props.setlv(lv_temp);
    }
  }
  _unlove=(post_id)=>{
    var lv_temp=this.props.lv;
    var lv_i=lv_temp.indexOf(post_id);
    if(lv_i!==-1){
      lv_temp.splice(lv_i,1);
      this.props.setlv(lv_temp);
    }
  }
  _timefunc(updatetime){
    var d1 = new Date(parseInt(Date.now()));
    var d1y=d1.getFullYear();
    var d1m=d1.getMonth()+1;
    var d1d=d1.getDate();
    var d1time=`${d1y}${d1m}${d1d}`;
    var d2 = new Date(updatetime);
    var d2y=d2.getFullYear();
    var d2m=d2.getMonth()+1;
    var d2d=d2.getDate();
    var d2time=`${d2y}${d2m}${d2d}`;
    if(d1time==d2time){
      var time=parseInt(Date.now())-updatetime;
      var h=d2.getHours();
      var m=d2.getMinutes();
      if(m<10){
        m='0'+m;  
      }    
      if(h>=13){
        h=' 오후 '+(h-12)+':'+m;  
      }else if(h>0){
        h=' 오전 '+h+':'+m;  
      }else{
        h=' 오후 '+'12'+':'+m;  
      }
      time=h;
    }else{
      var time=`${d2m}월 ${d2d}일`;
    }
    return time;
  }
  refreshIndex=0;
  async componentWillReceiveProps(nextProps){
    if(this.refreshIndex!=nextProps.home1refresh){
      this.refreshIndex=nextProps.home1refresh;
      await this.setState({pauseIndex:false});
      this.setState({pauseIndex:true});
    }
  }
  _postVIDEO = () =>{
    console.log('_post video');
    this.props.navigation.navigate('Post',{
      personList:[{
        user_id:this.state.item.user_id,
        img:this.state.item.profile.img,
        id:this.state.item.profile.id
      }]
    });
  }
  async _read(){
    if(this.state.item.read.indexOf(this.props.user_id)!=-1){
      return;
    }
    var isConnected=await _isConnected();
    if(!isConnected){
      return;
    }
    let data={
      video_id:this.state.item.post_id,
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
    fetch(`${URL}/videoread`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100){

      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  loving(){
    this._love(this.state.item.post_id)
    let data={
      post_id:this.state.item.post_id,
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
    fetch(`${URL}/loving`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.likeindex===1){
          this.likeindex=0;
        }else if(this.likeindex===2){
          this.unloving();
        }
      }else{
        await this.setState(prev=>({
          like:false,
          ln:prev.ln-1
        }));
        await Animated.timing(this.state.progress, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
        }).start();
        this.likeindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  unloving(){
    this._unlove(this.state.item.post_id)
    let data={
      post_id:this.state.item.post_id,
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
    fetch(`${URL}/unloving`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.likeindex===2){
          this.likeindex=0;
        }else if(this.likeindex===1){
          this.loving();
        }
      }else{
        await this.setState(prev=>({
          like:true,
          ln:prev.ln+1
        }))
        await Animated.timing(this.state.progress, {
          toValue: 1,
          duration: 0,
          easing: Easing.linear,
        }).start();
        this.likeindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async love(){
    if(this.state.like===false){
      await this.setState(prev=>({
        like:true,
        ln:prev.ln+1
      }))
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
      }).start();
      if(this.likeindex===0){
        this.loving();
      }
      this.likeindex=1;
    }else{
      await this.setState(prev=>({
        like:false,
        ln:prev.ln-1
      }))
      Animated.timing(this.state.progress, {
        toValue: 0,
        duration: 0,
        easing: Easing.linear,
      }).start();
      if(this.likeindex===0){
        this.unloving();
      }
      this.likeindex=2;
    }
  }
  user_arr=[];
  async _getfetch(){
    var post_id = this.props.navigation.getParam('post_id')
    var isConnected=await _isConnected();
    if(!isConnected){
      this.setState({netinfo:'fail_fetch'})
      return;
    }
    let data={
      post_id,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getonevideo`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        console.log(responseJson);
        this.user_arr=responseJson.user_arr;
        var u_i=this.user_arr.findIndex(em=>em.user_id==responseJson.video.user_id);
        
        let like=this.props.lv.indexOf(responseJson.video.post_id)===-1?false:true;

        await this.setState({
          item:{
            ...responseJson.video,
            profile:{
              user_id:this.user_arr[u_i].user_id,
              id:this.user_arr[u_i].id,
              img:this.user_arr[u_i].img,
            }
          },
          progress:like===true?new Animated.Value(1):new Animated.Value(0),
          like,
          ln:responseJson.video.ln,
        });
        await this.setState({
          loading:false
        });

        var videoURL=this.state.item.roll;
        let filename =videoURL.split('/')[3];
        var path_name = RNFS.DocumentDirectoryPath +'/'+ filename;
        RNFS.exists(path_name).then(async exists => {
          if (exists) {
            this.setState({
              roll:path_name,
              // loading:false
            });
          } else {
            RNFS.downloadFile({
              fromUrl: videoURL,
              toFile: path_name.replace(/%20/g, "_"),
              background: true
            })
              .promise.then(async res => {
                console.log('download');
                this.setState({
                  roll:path_name,
                  // loading:false
                })
              })
              .catch(err => {
                console.log("err downloadFile", err);
              });
          }
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _alarmRead=(post_id)=>{
    console.log('alarm read');
    let alarm =this.props.alarm.map(x=>x);
    console.log(alarm);
    let a_i=alarm.findIndex(em=>em.post_id==post_id);
    console.log('a_i:'+a_i);
    let alarm_comp=alarm[a_i];
    alarm.splice(a_i,1,{
      ...alarm_comp,
      show:false
    });
    console.log(alarm);
    this.props.setalarm(alarm);
  }
  backAction = () => {
    if(this.state.ripple==true||this.state.comment==true){
      this.setState({
        backInt:parseInt(Date.now())
      });
      return true;
    }else{
      return false;
    }
  };
  async componentDidMount(){
    this._getfetch();
  }
  readIndex=[]
  render(){
    return(
      <>
      <View style={{...styles.container}} activeOpacity={1}>
        <NavigationEvents
          onWillFocus={payload => {
            this.props.page_f('Video');
          }}
          onDidFocus={payload => {
            this.backHandler = BackHandler.addEventListener(
              "hardwareBackPress",
              this.backAction
            );
            this.setState({
              paused:false
            })
          }}
          onWillBlur={payload => {
            if(this.backHandler!==undefined){
              this.backHandler.remove();
            }
            this.setState({
              paused:true
            })
          }}
        />
        <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} translucent={true}/>
        {
          this.state.loading==true?(
            <TouchableOpacity style={styles.leftbtn} onPress={()=>{
              this.props.navigation.goBack();
            }}>
              <Image source={require('../assets/left_white.png')} style={{width:24,height:24}}/>
            </TouchableOpacity>
          ):(
            <TouchableOpacity style={{width,height}} activeOpacity={1} 
              onPress={()=>{
                this.setState(prev=>({
                  playing:!prev.playing
                }))
              }}
              onLongPress={()=>{
                this._dialogV(true,this.state.item.user_id,this.state.item.post_id);
              }}
             >
              {
                this.state.roll!=''?(
                    <Video source={{uri: this.state.roll}}   
                    // muted={(()=>{
                    //   return this.props.paused===0&&this.props.index===Math.round(this.props.scrollY)?false:true;
                    // })()}
                    repeat={true}
                    rate={
                      (()=>{
                        if(Platform.OS=='ios'||Platform.Version<25){
                          return 1;
                        }else{
                          if(this.state.pauseIndex===false){
                            return 1;
                          }else{
                            if(this.state.playing){
                              return this.state.paused===true?0:1;
                            }else{
                              return 0;
                            }
                          }
                        }
                      })()
                    }
                    paused={(()=>{
                      if(Platform.OS=='ios'||Platform.Version<25){
                        if(this.state.pauseIndex===false){
                          return false;
                        }else{
                          if(this.state.playing){
                            return this.state.paused;
                          }else{
                            return true;
                          }
                        }
                      }else{
                        return false
                      }
                    })()}
          
                    resizeMode={(()=>{
                      var ratio=height/width;
                      var ratio2=this.state.info.height/this.state.info.width;
                      var r_index=ratio2/ratio;
                      if(r_index>=0.85){
                        return 'cover';
                      }else{
                        return 'contain'
                      }
                    })()}
                    onLoad={async (info)=>{
                      this._alarmRead(this.state.item.post_id);
                      this._read();
                      await this.setState({
                        pauseIndex:true,
                        loading:false,
                        info:{
                          width:info.naturalSize.width,
                          height:info.naturalSize.height
                        }
                      });
                      
                      // this.player.seek(10)
                      // setTimeout((()=>{
                      //   this.setState({
                      //     pauseIndex:true,
                      //   })
                      // }).bind(this),10000)
          
                    }}
                    style={styles.backgroundVideo} 
                  />
                ):(null)
              }
              <TouchableOpacity style={styles.leftbtn} onPress={()=>{
                this.props.navigation.goBack();
              }}>
                <Image source={require('../assets/left_white.png')} style={{width:24,height:24}}/>
              </TouchableOpacity>
              <View style={{...styles.sidebar,bottom:196+this.props.bottom-32}}>
              <TouchableOpacity style={styles.profileImg_c} onPress={()=>{
                  if(this.state.item.user_id==this.props.user_id){
                    this.props.navigation.navigate('MyBook');
                  }else{
                    this.props.navigation.navigate('Book',{
                      item:{
                        user_id:this.state.item.user_id,
                        img:this.state.item.profile.img,
                        id:this.state.item.profile.id
                      }
                    });
                  }
                }}>
                {
                  this.state.item.profile.img===''?(
                    <Image source={require('../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                  ):(
                    <FastImage
                      style={{width:'100%',height:'100%'}}
                      source={{
                          uri: this.state.item.profile.img,
                          priority: FastImage.priority.normal,
                      }}
                    />
                  )
                }
                </TouchableOpacity>
                {
                  this.state.like===false?(
                    <TouchableOpacity style={styles.sidebar_love_c} activeOpacity={1} onPress={()=>{
                      this.love();
                    }}>
                      <Image style={{width:40,height:40,opacity:0.9}} source={require('../assets/love.png')}/>
                    </TouchableOpacity>
                  ):(
                    <TouchableOpacity style={styles.sidebar_love_c} activeOpacity={1} onPress={()=>{
                      this.love();
                    }}>
                      <LottieView style={styles.like_lottie} source={require('../assets/animation/love.json')} progress={this.state.progress} resizeMode="cover"/>
                    </TouchableOpacity>
                  )
                }
                <Text style={{color:'#fff',fontSize:12,fontWeight:'bold'}}>{this.state.ln}</Text>
                <TouchableOpacity style={styles.sidebar_ripple_c} onPress={async ()=>{
                  this._comment(true,this.state.item.post_id,this.state.item.user_id);
                }}>
                  <Image style={{width:44,height:44,opacity:0.9}} source={require('../assets/ripple.png')}/>
                </TouchableOpacity>
                <Text style={{color:'#fff',fontSize:12,fontWeight:'bold'}}>{this.state.item.cn}</Text>
                {/* <TouchableOpacity style={styles.sidebar_ripple_c} onPress={async ()=>{
                  this._postVIDEO();
                }}>
                  <Image style={{width:32,height:32,opacity:0.9}} source={require('../assets/send_paper.png')}/>
                </TouchableOpacity> */}
                {
                  this.props.user_id==this.state.item.user_id?(
                    null
                  ):(
                    <TouchableOpacity style={styles.sidebar_ripple_c} onPress={async ()=>{
                    this._postVIDEO();
                  }}>
                    <Image style={{width:30,height:30,opacity:0.9}} source={require('../assets/send_paper.png')}/>
                    {/* <Text style={{color:'#fff',fontSize:12,fontWeight:'bold',marginTop:10}}>회신</Text> */}
                  </TouchableOpacity>
                  )
                }
              </View>
              <TouchableOpacity style={{position:'absolute',bottom:56+this.props.bottom-32,right:8,width:56,height:56,justifyContent:'center',alignItems:'center',flexDirection:'row'}} onPress={()=>{
              this._ripple(true,this.state.item.post_id);
              }}>
                <Image style={{width:24,height:24,opacity:0.8}} source={require('../assets/play_small.png')}/>
                <Text style={{color:"rgba(255,255,255,0.9)",fontSize:12,marginLeft:4,fontWeight:'600'}}>{this.state.item.read.length}</Text>
              </TouchableOpacity>
              <View style={{...styles.bottom,bottom:this.props.bottom+56-32}}>
                <View style={{flexDirection:'row'}}> 
                  <TouchableOpacity style={styles.bottom_id_c} onPress={()=>{
                    this.props.navigation.navigate('Book',{
                      item:{
                        user_id:this.state.item.user_id,
                        img:this.state.item.profile.img,
                        id:this.state.item.profile.id
                      }
                    });
                  }}>
                    <Text style={styles.bottom_id_txt}>{this.state.item.profile.id}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.bottom_text_c} activeOpacity={1} onPress={()=>{
                  if(this.state.numberOfLines===4){
                    this.setState({
                      numberOfLines:30
                    })
                  }else{
                    this.setState({
                      numberOfLines:4
                    })
                  }
                }}>
                  {
                    this.state.item.text.length>0?(
                      <Text numberOfLines={this.state.numberOfLines} style={styles.bottom_text_txt}>{this.state.item.text}</Text>
                    ):(null)
                  }
                  <Text style={styles.bottom_ct}>{this._timefunc(this.state.item.ct)}</Text>
                  <View style={{width:width-90,minHeight:0,maxHeight:200,flexWrap:'wrap',flexDirection:'row',paddingLeft:8,paddingBottom:16,paddingTop:8}}>
                    {
                      (()=>{
                        let personList=this.state.item.personList;
                        let personListJSX=[];
                        personList.map((x)=>{
                          var u_i=this.user_arr.findIndex(em=>em.user_id==x);
                          if(u_i!=-1){
                            personListJSX.push(
                              <TouchableOpacity style={{...styles.personList_c,flexDirection:'row',backgroundColor:x==this.props.user_id?'rgba(0,200,0,0.7)':'rgba(0,0,0,0.6)'}}
                              key={x}  
                              onPress={()=>{
                                if(this.props.user_id==this.user_arr[u_i].user_id){
                                  var to='MyBook';
                                }else{
                                  var to='Book';
                                }
                                this.props.navigation.navigate(to,{
                                  item:{
                                    id:this.user_arr[u_i].id,
                                    user_id:this.user_arr[u_i].user_id,
                                    img:this.user_arr[u_i].img
                                  }
                                })
                              }}
                            >
                              <Text style={{...styles.groupList_txt,marginLeft:1}}>{`${this.user_arr[u_i].id}`}</Text>
                            </TouchableOpacity>
                            )
                          }
                        })
                        return personListJSX;
                      })()
                    }
                    {
                      (()=>{
                        let groupList=this.state.item.groupList;
                        let groupListJSX=groupList.map((x)=>{
                          return(
                            <TouchableOpacity style={{...styles.groupList_c,flexDirection:'row',backgroundColor:this.props.group.findIndex(em=>em.id==x)!=-1?'rgba(234,29,93,0.7)':'rgba(0,0,0,0.6)'}}
                              key={x}  
                              onPress={()=>{
                                this.props.navigation.navigate('Group',{
                                  id:x
                                })
                              }}
                            >
                              <Image style={{width:12,height:12}} source={require('../assets/at.png')}/>
                              <Text style={{...styles.groupList_txt,marginLeft:3}}>{`${x}`}</Text>
                            </TouchableOpacity>
                          )
                        })
                        return groupListJSX;
                      })()
                    }
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )
        }
        {
          !this.state.playing?(
            <TouchableOpacity style={{width:88,height:88,position:'absolute'}} onPress={()=>{
              this.setState({
                playing:true
              })
            }}>
              <Image style={{width:'100%',height:'100%',opacity:0.5}} source={require('../assets/play.png')}/>
            </TouchableOpacity>
          ):(null)
        }
        {
          (()=>{
            if(this.state.loading===true){
              if(this.state.netinfo=='connected'){
                return(
                  <View style={{width,height:this.state.height,backgroundColor:'rgba(0,0,0,0)',justifyContent:'center',alignItems:'center'}}>
                    <LottieView source={require('../assets/animation/loading_home.json')} 
                  autoPlay loop style={{width:width*0.9,height:width*0.9}} resizeMode="cover"/>
                  </View>
                )
              }else{
                return(
                  <View style={{width,height,backgroundColor:'#222',justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:width*0.3,height:width*0.3,opacity:0.7}} source={require('../assets/data_error.png')}/>
                    <Text style={{fontSize:16,color:'#f2f2f2',fontWeight:'bold',marginBottom:16}}>인터넷 연결</Text>
                    <Text style={{fontSize:14,color:'#f2f2f2',textAlign:'center',marginBottom:32}} >{'오프라인 상태입니다.\n인터넷 연결을 확인하세요.'}</Text>
                    <TouchableOpacity style={{height:40,paddingHorizontal:24,borderWidth:1,borderColor:'#f2f2f2',borderRadius:8,justifyContent:'center',alignItems:'center'}} onPress={ async ()=>{
                      var isConnected=await _isConnected();
                      if(isConnected){
                        this._getfetch();
                        this.setState({netinfo:'connected'})
                      }
                    }}>
                      <Text style={{color:'#f2f2f2',fontSize:14,fontWeight:'bold'}}>재시도</Text>
                    </TouchableOpacity>
                  </View>
                )
              }
            }
          })()
        }
        {
          this.state.ripple===true?(
            <Ripple 
              height={height*0.4} 
              _ripple={this._ripple} 
              user_id={this.props.user_id} 
              post_id={this.state.item.post_id} 
              navigation={this.props.navigation}
            />
          ):(null)
        }
        {
          this.state.dialogV===true?(
            <DialogV 
              _dialogV={this._dialogV} 
              _id={this.props._id} 
              user_id={this.props.user_id} 
              post_user_id={this.state.post_user_id} 
              post_id={this.state.post_id}
              _deletePost={()=>{
                let alarm=this.props.alarm.map(x=>x);
                var p_i=alarm.findIndex(em=>em.post_id==this.state.item.post_id);
                alarm.splice(p_i,1);
                this.props.setalarm(alarm);
                this.props.navigation.goBack();
              }}
            />
          ):(null)
        }
      </View>
      {
        this.state.comment===true?(
          <Comment 
            height={height*0.8} 
            _comment={this._comment} 
            _id={this.props._id}
            user_id={this.props.user_id} 
            post_id={this.state.post_id}
            post_user_id={this.state.post_user_id} 
            navigation={this.props.navigation}
            backInt={this.state.backInt}
            bottom={this.props.bottom}
            comment={this.props.comment}
            setcomment={this.props.setcomment}
            page_f={this.props.page_f}
            page={this.props.page}

          />
        ):(null)
      }
      </>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:width,
    backgroundColor:'#000',
    justifyContent:'center',
    alignItems:'center',
    position:'absolute',
    top:0,
    left:0,
    width,
    height
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
    top:STATUSBAR_HEIGHT+16
  },
  backgroundVideo:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:'#000'
  },
  sidebar:{
    position:'absolute',
    right:0,
    bottom:140,
    width:70,
    height:230,
    alignItems:'center',
  },
  profileImg_c:{
    width:52,
    height:52,
    // backgroundColor:'blue',
    overflow:'hidden',
    borderRadius:56,
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.8)',
    marginBottom:20
  },
  sidebar_love_c:{
    width:48,
    height:48,
    justifyContent:'center',
    alignItems:'center',
  //  backgroundColor:'green',
    marginBottom:2
  },
  sidebar_ripple_c:{
    width:48,
    height:48,
    justifyContent:'center',
    alignItems:'center',
    marginTop:8,
    // backgroundColor:'yellow',
    marginBottom:2
  },
  like_lottie:{
    width:64,
    height:64,
    marginLeft:0,
    marginRight:0
  },
  bottom:{
    position:'absolute',
    left:0,
    bottom:0,
    width:width-90,
    minHeight:50,
  },
  bottom_id_c:{
    justifyContent:'center',
    // backgroundColor:'red',
    height:24,
    paddingHorizontal:15,
  },
  bottom_id_txt:{
    fontWeight:"bold",
    color:'#fff',
    fontSize:14,
  },
  bottom_text_c:{
  },
  bottom_text_txt:{
    color:'#fff',
    paddingHorizontal:15,
  },
  bottom_ct:{
    color:'rgba(255,255,255,0.8)',
    fontSize:12,
    paddingHorizontal:13,
    marginTop:4
  },
  groupList_c:{
    paddingHorizontal:12,
    backgroundColor:'rgba(0,0,0,0.6)',
    marginLeft:8,
    marginBottom:4,
    borderRadius:20,
    height:25,
    alignItems:'center'
  },
  personList_c:{
    paddingHorizontal:12,
    backgroundColor:'rgba(0,0,0,0.6)',
    marginLeft:8,
    marginBottom:4,
    borderRadius:20,
    height:25,
    alignItems:'center'
  },
  groupList_txt:{
    fontSize:12,
    color:'#fff',
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    uid:state.setinfo.uid,
    user_id:state.setinfo.user_id,
    sns:state.setinfo.sns,
    socket:state.sidefunc.socket,
    chatroom:state.sidefunc.chatroom,
    chatlist:state.sidefunc.chatlist,
    barStyle:state.sidefunc.barStyle,
    follow:state.setinfo.follow,
    follower:state.setinfo.follower,
    group:state.setinfo.group,
    lv:state.sidefunc.lv,
    bottom:state.sidefunc.bottom,
    page:state.sidefunc.page,
    progress:state.sidefunc.progress,
    home1refresh:state.sidefunc.home1refresh,
    alarm:state.sidefunc.alarm,
    user_arr:state.sidefunc.userarr,
    alarm:state.sidefunc.alarm,
    comment:state.sidefunc.comment,

  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setall: (_id,id,user_id,coin,logintype,pwindex,uid)=>{
      dispatch(actions.setall(_id,id,user_id,coin,logintype,pwindex,uid));
    },
    setitr:(itr)=>{
      dispatch(actions.setitr(itr))
    },
    setkit:(ph,email)=>{
      dispatch(actions.setkit(ph,email))
    },
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
    setchatroom: (coin)=>{
      dispatch(actions.setchatroom(coin));
    },
    setchatlist: (chatlist)=>{
      dispatch(actions.setchatlist(chatlist));
    },
    setfollow: (follow)=>{
      dispatch(actions.setfollow(follow));
    },
    setfollower: (follower)=>{
      dispatch(actions.setfollower(follower));
    },
    setgroup: (group)=>{
      dispatch(actions.setgroup(group));
    },
    setlv: (lv)=>{
      dispatch(actions.setlv(lv));
    },
    setalarm: (alarm)=>{
      dispatch(actions.setalarm(alarm));
    },
    setuserarr: (userarr)=>{
      dispatch(actions.setuserarr(userarr));
    },
    backhandler_f: (boolean)=>{
      dispatch(actions.backhandler(boolean));
    },
    barStyle_f: (barStyle)=>{
      dispatch(actions.barStyle(barStyle));
    },
    page_f: (page)=>{
      dispatch(actions.page(page));
    },
    bottom_f: (bottom)=>{
      dispatch(actions.bottom(bottom));
    },
    home1refresh_f: (home1refresh)=>{
      dispatch(actions.home1refresh(home1refresh));
    },
    setcomment: (comment)=>{
      dispatch(actions.setcomment(comment));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(VideoScreen);