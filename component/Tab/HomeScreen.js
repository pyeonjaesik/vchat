import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,StatusBar,Animated,Easing,AppState,RefreshControl,BackHandler,TouchableOpacity,Image,KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {URL,_isConnected, STATUSBAR_HEIGHT} from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import CellContainer from './list/CellContainer';
import CellContainerPause from './list/CellContainerPause';

import io from 'socket.io-client';
import { GiftedChat } from 'react-native-gifted-chat'
import { NavigationEvents } from 'react-navigation';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import Ripple from '../Ripple';
import Comment from '../Comment';
import DialogV from '../dialog/DialogV';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import VideoProgress from '../dialog/VideoProgress';
import LottieView from 'lottie-react-native';
import {sendcontact} from '../../func/sendcontact';
import {getchat} from '../../func/getchat';
import {getalarm} from '../../func/getalarm';

import SplashScreen from 'react-native-splash-screen'

var RNFS = require('react-native-fs');

const AnimatedCellContainer = Animated.createAnimatedComponent(CellContainer);
const AnimatedCellContainerPause = Animated.createAnimatedComponent(CellContainerPause);

const AnimatedRecyclerListView= Animated.createAnimatedComponent(RecyclerListView);
const AnimatedVideoProgress= Animated.createAnimatedComponent(VideoProgress);


const {width,height}=Dimensions.get("window");

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2
};
class HomeScreen extends React.Component {
  scroll = new Animated.Value(0);
  page_height=0;
  dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  });
  constructor(props){
    super(props);
    this._layoutProvider = new LayoutProvider(
      index => {
        return ViewTypes.FULL;
      },
      (type, dim) => {
        dim.width = width;
        dim.height = this.state.height;
      }
    );
    this.state={
      scrollY: new Animated.Value(0),
      post:[],
      appState: AppState.currentState,
      height:0,
      paused:new Animated.Value(0),
      barStyle:'light-content',
      dataProvider: this.dataProvider.cloneWithRows([{type:700}]),
      refreshing: false,
      before:0,
      loading:false,
      starting:false,
      ripple:false,
      comment:false,
      user_arr:[],
      dialogV:false,
      post_user_id:'',
      post_id:'',
      refreshIndex:new Animated.Value(0),
      netinfo:'connected',
      focused:true,
      backInt:0,
      highIndex:0
    }
    this._login=this._login.bind(this);
    this._getfetch=this._getfetch.bind(this);
    this._socket=this._socket.bind(this);
    this._chatstartUp=this._chatstartUp.bind(this);
    this._chatbedgeUp=this._chatbedgeUp.bind(this);
    this._getScroll=this._getScroll.bind(this);
    this.videogetter=this.videogetter.bind(this);
    this._love=this._love.bind(this);
    this._unlove=this._unlove.bind(this);
    this._refresh=this._refresh.bind(this);
    this._setBefore=this._setBefore.bind(this);
    this._change=this._change.bind(this);
    this._ripple=this._ripple.bind(this);
    this._comment=this._comment.bind(this);

    this._dialogV=this._dialogV.bind(this);
    this._deletePost=this._deletePost.bind(this);
    this._deletePostArray=this._deletePostArray.bind(this);

    this.backAction=this.backAction.bind(this);
    this._handleAppStateChange=this._handleAppStateChange.bind(this);

    this._reLoad=this._reLoad.bind(this);
    this._highIndex=this._highIndex.bind(this);

    console.disableYellowBox = true;

  };
  videogetter_index=true;
  _dialogV(boolean,post_user_id,post_id){
    this.setState({
      dialogV:boolean,
      post_user_id,
      post_id
    })
  }
  async _deletePost(post_id){
    let post=this.state.post;
    let p_i=post.findIndex(em=>em.post_id==post_id);
    post.splice(p_i,1);
    var _data=this.state.dataProvider._data;
    _data.splice(p_i,1);
    _data=_data.map((em,index)=>{
      return{
        ...em,
        currentIndex:index
      }
    })
    await this.setState({
      post,
      dataProvider: this.dataProvider.cloneWithRows(_data)
    });  
    this.videogetter(1,false)
  }
  async _deletePostArray(user_id){
    let post=[];
    this.state.post.map(em=>{
      if(em.user_id!=user_id){
        post.push(em);
      }
    });
    var _data=[];
    this.state.dataProvider._data.map((em)=>{
      if(em.user_id!=user_id){
        _data.push(em)
      }
    });
    _data=_data.map((em,index)=>{
      return{
        ...em,
        currentIndex:index
      }
    });
    await this.setState({
      post,
      dataProvider: this.dataProvider.cloneWithRows(_data)
    });  
    this.videogetter(1,false)
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
  videogetter = async (pages,refresh)=>{
    console.log('videogetter');
    if(this.videogetter_index==false){
      return
    };
    this.videogetter_index=false;
    var _data=this.state.dataProvider._data;
    if(refresh){
      _data=[];
      await this.setState({
        dataProvider: this.dataProvider.cloneWithRows([{type:700}])
      })
    }else{
      await this.setState({
        loading:true
      })
    }
    var state_post=await this.state.post.map(x=>x);
    if(_data.length+pages<=state_post.length){
      var count_loop=0;
      var post_temp=state_post.splice(_data.length,pages);
      var result_post=[];      
      post_temp.map(async (em,index)=>{
        console.log(em);
        if(em.show=='200'){
          result_post[index]={
            ...em,
          }
          count_loop++;
          // result_post.push({
          //   ...em,
          //   roll:path_name
          // });
          if(count_loop==pages){
            var result=_data.concat(result_post);
            result = await result.map((em,index)=>{
              return{
                ...em,
                like:this.props.lv.indexOf(em.post_id)===-1?false:true,
                currentIndex:index,
                exists:1111
              }
            })
            if(refresh){
              await this.setState({
                dataProvider: this.dataProvider.cloneWithRows([{type:700}])
              })
            };
            await this.setState({
              refreshing:false,
              dataProvider: this.dataProvider.cloneWithRows(result),
              loading:false,
              starting:true
            });
            this.videogetter_index=true;
            if(this.state.dataProvider._data.length-this.state.highIndex<5){
              var isConnected=await _isConnected();
              if(!isConnected){
                await this.setState({
                  loading:true,
                  netinfo:'fail_reached'
                })
                return;
              }
              this.videogetter(1,false)
            }
          }
        }else{
          var videoURL=em.roll;
          let filename =videoURL.split('/')[3];
          var path_name = RNFS.DocumentDirectoryPath +'/'+ filename;
          RNFS.exists(path_name).then(async exists => {

            if (exists) {
              result_post[index]={
                ...em,
                roll:path_name
              }
              count_loop++;
              // result_post.push({
              //   ...em,
              //   roll:path_name
              // });
              if(count_loop==pages){
                var result=_data.concat(result_post);
                result = await result.map((em,index)=>{
                  return{
                    ...em,
                    like:this.props.lv.indexOf(em.post_id)===-1?false:true,
                    currentIndex:index,
                    exists:1111
                  }
                })
                if(refresh){
                  await this.setState({
                    dataProvider: this.dataProvider.cloneWithRows([{type:700}])
                  })
                };
                await this.setState({
                  refreshing:false,
                  dataProvider: this.dataProvider.cloneWithRows(result),
                  loading:false,
                  starting:true
                });
                this.videogetter_index=true;
                if(this.state.dataProvider._data.length-this.state.highIndex<5){
                  var isConnected=await _isConnected();
                  if(!isConnected){
                    await this.setState({
                      loading:true,
                      netinfo:'fail_reached'
                    })
                    return;
                  }
                  this.videogetter(1,false)
                }
              }
            } else {
              RNFS.downloadFile({
                fromUrl: videoURL,
                toFile: path_name.replace(/%20/g, "_"),
                background: true
              })
                .promise.then(async res => {
                  result_post[index]={
                    ...em,
                    roll:path_name
                  };
                  count_loop++;
                  // result_post.push({
                  //   ...em,
                  //   roll:path_name
                  // });
                  if(count_loop==pages){
                    var result=_data.concat(result_post);
                    result = await result.map((em,index)=>{
                      return{
                        ...em,
                        like:this.props.lv.indexOf(em.post_id)===-1?false:true,
                        currentIndex:index,
                        exists:222
                      }
                    });
                    if(refresh){
                      await this.setState({
                        dataProvider: this.dataProvider.cloneWithRows([{type:700}])
                      })
                    };
                    await this.setState({
                      refreshing:false,
                      dataProvider: this.dataProvider.cloneWithRows(result),
                      loading:false,
                      starting:true
                    });
                    this.videogetter_index=true;
                    if(this.state.dataProvider._data.length-this.state.highIndex<5){
                      var isConnected=await _isConnected();
                      if(!isConnected){
                        await this.setState({
                          loading:true,
                          netinfo:'fail_reached'
                        })
                        return;
                      }
                      this.videogetter(1,false)
                    }
                  }
                })
                .catch(err => {
                  console.log("err downloadFile", err);
                });
            }
          });
        }
      });
    }else{
      if((state_post.length-_data.length==0)){
        this.setState({
          refreshing:false,
          loading:false,
        });
      }else{
        this.videogetter_index=true;
        this.videogetter(state_post.length-_data.length,refresh);
      }
    }
  }
  _refresh=async ()=>{
    this.videogetter_index=true;
    if(this.state.starting==false){return}
    var _data=this.state.dataProvider._data;
    await this.setState({
      refreshing: true,
      post:[],
      dataProvider: _data.length>0?this.dataProvider.cloneWithRows([_data[0]]):this.dataProvider.cloneWithRows([{type:700}])
     // footloader: true
    });
    await this._getfetch();
  }
  _getfetch =async ()=>{
    var isConnected=await _isConnected();
    this.videogetter_index=true;
    if(!isConnected){
      this.setState({
        refreshing:false,
        post:[],
        dataProvider:this.dataProvider.cloneWithRows([{type:600}]),
        starting:true,
        loading:false
      })
      return;
    }
    Animated.timing(this.state.paused, {
      toValue: 0,
      duration: 10,
      easing: Easing.linear,
    }).start();
    let data={
      _id:this.props._id,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getmainpost140`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        var videolist=[];
        responseJson.post.map(emP=>{
          let f_i=responseJson.user_arr.findIndex(emS=>emS.user_id==emP.user_id);
          if(f_i!==-1){
            videolist.push({
              ...emP,
              profile:{id:responseJson.user_arr[f_i].id,img:responseJson.user_arr[f_i].img},
              type:0
            });
          }
        });
        await this.setState({
          post:videolist,
          user_arr:responseJson.user_arr
        });
        this.videogetter_index=true;
        this.videogetter(1,true);

      }else if(responseJson.status==102){
        this.setState({
          refreshing:false,
          dataProvider: this.dataProvider.cloneWithRows([{type:102}]),
          loading:false,
          starting:true
        });
        this.videogetter_index=true;
      }else{
        console.log('getmainpost: err status:'+responseJson.status);

      }
    })
    .catch((error) => {
      console.error(error);
    });
  } 
  async componentWillMount(){
    var bottom_height= await AsyncStorage.getItem('bottom')||0;
    if(parseInt(bottom_height)!=0){
      this.props.bottom_f(parseInt(bottom_height));
    }else{
      this.props.bottom_f(0);
    }
  }
  async _login(){
    const _id = await AsyncStorage.getItem('_id');
    if(_id!==null){
      var isConnected=await _isConnected();
      if(!isConnected){
        this.setState({netinfo:'fail_login'})
        return;
      }
      const uid = await AsyncStorage.getItem('uid');
      const id = await AsyncStorage.getItem('id');
      const user_id = await AsyncStorage.getItem('user_id');
      const coin = '000';
      const type = await AsyncStorage.getItem('type');
      const pwindex = await AsyncStorage.getItem('pwindex');
      const itr = await AsyncStorage.getItem('itr');
      const fcmToken = await AsyncStorage.getItem('fcmToken')||0;
      await this.props.setall(_id,id,user_id,coin,type,pwindex,uid);
      if(itr=='0'){
        this.props.setitr(0);
      }else{
        this.props.setitr(1);
      }
      let data={
        _id,
        user_id,
        fcmToken
      };
      const obj = {
        body: JSON.stringify(data),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }
      fetch(`${URL}/autologin`, obj)
      .then((response) => response.json())
      .then(async (responseJson) => {
        if(responseJson.status==100){
          responseJson.follow.sort((a,b)=>{
            return a.id < b.id? -1: a.id>b.id?1:0
          });
          responseJson.group.sort((a,b)=>{
            return a.id < b.id? -1: a.id>b.id?1:0
          });
          var chatlist=[];
          responseJson.chatlist.map(emP=>{
            for(var i=0;i<2;i++){
              if(emP.info[i].user_id!=this.props.user_id){
                let f_i=responseJson.user_arr_chat.findIndex(emS=>emS.user_id==emP.info[i].user_id);
                if(f_i!==-1){
                  chatlist.push({
                    ...emP,
                    profile:{
                      id:responseJson.user_arr_chat[f_i].id,
                      img:responseJson.user_arr_chat[f_i].img,
                    }
                  })
                }
              }
            }
          });
          if(chatlist.length==0){
            console.log('채팅 내역 없음')
          }
          this.props.setchatlist(chatlist);
          this.props.setall(_id,responseJson.id,user_id,responseJson.coin,type,responseJson.pwindex,responseJson.uid);
          this.props.setitr(responseJson.itr);
          this.props.setimg(responseJson.img);
          this.props.setvideo(responseJson.video);
          this.props.setintro(responseJson.intro);
          this.props.setsns(responseJson.sns);
          this.props.setprice(responseJson.price);
          this.props.setfollow(responseJson.follow);
          this.props.setfollower(responseJson.follower);
          this.props.setgroup(responseJson.group);
          this.props.setlv(responseJson.lv);
          // this.props.navigation.replace('Parent');
          this._getfetch();
          this._socket();
          getalarm({props:this.props,refresh:false})
          await sendcontact(this.props.setfollow);
        }else if(responseJson.status==102){
          this.props.signout();
          await AsyncStorage.setItem('_id', '');
          await AsyncStorage.setItem('id', '');
          await AsyncStorage.setItem('uid', '');
          await AsyncStorage.setItem('user_id', '');
          await AsyncStorage.setItem('coin', '');
          await AsyncStorage.setItem('type', '');
          await AsyncStorage.setItem('pwindex', '');
          await AsyncStorage.setItem('itr', '');
          this.props.navigation.replace('Login');
        }else{
          alert('auto login err:'+responseJson.status);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }else{
      this.props.signout();
      await AsyncStorage.setItem('_id', '');
      await AsyncStorage.setItem('id', '');
      await AsyncStorage.setItem('uid', '');
      await AsyncStorage.setItem('user_id', '');
      await AsyncStorage.setItem('coin', '');
      await AsyncStorage.setItem('type', '');
      await AsyncStorage.setItem('pwindex', '');
      await AsyncStorage.setItem('itr', '');
      this.props.navigation.replace('Login');
    }
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
    SplashScreen.hide();
    AppState.addEventListener('change', this._handleAppStateChange);
    this._login();
  }

  home1refresh=0;
  mainrefresh=0;
  async _reLoad(){
    this.videogetter_index=true;
    if(this.state.starting==false){return}
    var _data=this.state.dataProvider._data;
    await this.setState({
      post:[],
      dataProvider: _data.length>0?this.dataProvider.cloneWithRows([_data[0]]):this.dataProvider.cloneWithRows([{type:700}])
     // footloader: true
    });
    await this._getfetch();
  }
  async componentWillReceiveProps(nextProps) {
    if(this.home1refresh!=nextProps.home1refresh){
      this.home1refresh=nextProps.home1refresh;
      Animated.timing(this.state.refreshIndex, {
        toValue: parseInt(Date.now()),
        duration: 0,
        easing: Easing.linear,
      }).start();
    }
    if(this.mainrefresh!=nextProps.mainrefresh){
      console.log('reLoad!!!!@@@@');
      this.mainrefresh=nextProps.mainrefresh;
      this._reLoad();
    }
  }
  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._socket();
      getchat(this.props);
      getalarm({props:this.props,refresh:true})
      this.props.home1refresh_f(parseInt(Date.now()));
      var findkey;
      for(var key in this.props.chatroom){
        if(this.props.chatroom[key].focus===true){
          findkey=key;
          break;
        }
      }
      let datam={
        my_id:this.props._id,
        your_user_id:findkey,
      };
      const obj = {
        body: JSON.stringify(datam),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }
      fetch(`${URL}/talkread`, obj)
      .then((response) => response.json())
      .then((responseJson) => {

      })
      .catch((error) => {
        console.error(error);
      });
    }else if(nextAppState === 'background'){
      this.props.page_f('background')
    }
    this.setState({appState: nextAppState});
  };
  async _chatstartUp({type,text,user_id,id,img}){
    var chatlist=this.props.chatlist;
    chatlist.unshift({
      info:[
        {
          user_id:this.props.user_id,
          show:true,
          bedge:1
        },
        {
          user_id:user_id,
          show:true,
          bedge:0
        }
      ],
      room:{
        type,
        user_id,
        text,
        ct:parseInt(Date.now())
      },
      profile:{
        id,
        img
      },
      updatetime:parseInt(Date.now())
    });
    await this.props.setchatlist([]);
    this.props.setchatlist(chatlist);
  }
  async _chatbedgeUp({type,text,user_id,bedge}){
    var temp_chat;
    var temp_index=0;
    var chatlist=this.props.chatlist.map((em,index)=>{
      var your_f_i=em.info.findIndex(emS=>emS.user_id==user_id);
      if(your_f_i!=-1){
        temp_index=index;
        if(your_f_i==0){
          var my_f_i=1;
        }else{
          var my_f_i=0;
        }
        temp_chat={
          ...em,
          info:[
            {
              user_id:em.info[my_f_i].user_id,
              show:true,
              bedge
            },
            {
              user_id:em.info[your_f_i].user_id,
              show:true,
              bedge:0
            }
          ],
          room:{
            type,
            user_id:em.info[your_f_i].user_id,
            text,
            ct:parseInt(Date.now())
          },
          updatetime:parseInt(Date.now())
        }
        return temp_chat;
      }else{
        return em;
      }
    });
    chatlist.splice(temp_index,1);
    chatlist.unshift(temp_chat);
    await this.props.setchatlist([]);
    this.props.setchatlist(chatlist);
  }
  async _socket(){
    var socket = io(`${URL}`);
    await this.props.setsocket(socket);
    this.props.socket.emit('login', {
      _id:this.props._id
    });
    this.props.socket.on('VIDEO', (async data => {
      var alarm_temp=this.props.alarm.map(x=>x);
      alarm_temp.unshift({
        ...data,
        ct:parseInt(Date.now()),
        comment:0,
        love_user:[],
        personList:data.individual?[this.props.id]:[],
        show:true,
        type:'new'
      });
      this.props.setalarm(alarm_temp);
    }).bind(this));

    this.props.socket.on('VCHAT', (async data => {
      if(this.props.comment[data.post_id]==undefined){
        var comment_temp=[]
      }else{
        var comment_temp=this.props.comment[data.post_id]
      }
      comment_temp.push({
        user_id:data.user_id,
        text:data.text,
        ct:parseInt(Date.now()),
        id:data.id,
        img:data.img,
      });
      await this.props.setcomment({
        ...this.props.comment,
        [data.post_id]:comment_temp
      });
      if('comment'+data.post_id!==this.props.page){
        console.log(data);
        var alarm_temp=this.props.alarm.map(x=>x);
        var a_i=alarm_temp.findIndex(em=>em.post_id==data.post_id);
        if(a_i==-1){
          alarm_temp.unshift({
            ...data,
            personList:data.personList.indexOf(this.props.user_id)!=-1?[this.props.id]:[],
            user_id:data.post_user_profile.user_id,
            id:data.post_user_profile.id,
            img:data.post_user_profile.img,
            ct:parseInt(Date.now()),
            comment:1,
            love_user:[],
            show:true,
            type:'new'
          })
        }else{
          var alarm_comp=alarm_temp[a_i];
          alarm_temp.splice(a_i,1);
          alarm_temp.unshift({
            ...data,
            personList:data.personList.indexOf(this.props.user_id)!=-1?[this.props.id]:[],
            user_id:data.post_user_profile.user_id,
            id:data.post_user_profile.id,
            img:data.post_user_profile.img,
            ct:parseInt(Date.now()),
            comment:alarm_comp.comment+1,
            love_user:alarm_comp.love_user,
            show:true,
            type:'new'
          })
        }
        console.log(alarm_temp)
        this.props.setalarm(alarm_temp);
      }
    }).bind(this));

    this.props.socket.on('CHAT', (data => {
      var created_time = parseInt(Date.now());
      var chat_length=this.props.chatlist.length;
      var chat_boolean=false;
      for(var i=0;i<chat_length;i++){
        if(this.props.chatlist[i].info.findIndex(em=>em.user_id==data.user_id)!=-1){
          chat_boolean=true;
          break;
        }
      }
      if(chat_boolean===false){ //상대방과 대화한 이력이 한 번도 없음
        this._chatstartUp({
            type:data.type,
            text:data.text,
            user_id:data.user_id,
            id:data.id,
            img:data.img
        });
      }else{
        if(this.props.chatroom[data.user_id]==undefined){ //대화한 이력은 있지만 앱을 새로 키고 챗룸에 한 번도 들어가보지 않음.
          this._chatbedgeUp({
              type:data.type,
              text:data.text,
              user_id:data.user_id,
              bedge:data.bedge
          });
        }else{ //대화한 이력도 있고 앱을 키고 챗룸에 한번 이상 들어가 보았음.
          console.log('대화한 이력도 있고 앱을 키고 챗룸에 한번 이상 들어가 보았음')
          if(data.type==2){
            var chatroom_temp=this.props.chatroom[data.user_id].room;
            let c_fi=chatroom_temp.findIndex(em=>em.type==1&&em.post_id==data.post_id);
            var chatroom_component=chatroom_temp[c_fi];
            chatroom_temp.splice(c_fi,1,{
              ...chatroom_component,
              type:10
            });
            chatroom_temp.unshift({
              _id:created_time,
              text:data.text,
              createdAt:created_time,
              read:true,
              user:{
                _id:2,
                name:data.id,
                avatar:data.img
              },
              type:data.type,
              user_id:data.user_id,
              coin:data.post_coin,
              post_id:data.post_id,
              ms_id:data.ms_id,
              clip:data.files
            });
            this.props.setchatroom({
              ...this.props.chatroom,
              [data.user_id]:{
                room:[],
                focus:this.props.chatroom[data.user_id].focus
              }
            })
            this.props.setchatroom({
              ...this.props.chatroom,
              [data.user_id]:{
                room:chatroom_temp,
                focus:this.props.chatroom[data.user_id].focus
              }
            });          
          }else{
            var chatroom_temp=this.props.chatroom[data.user_id].room;
            this.props.setchatroom({
              ...this.props.chatroom,
              [data.user_id]:{
                room:GiftedChat.append(chatroom_temp, [{
                  _id:created_time,
                  text:data.text,
                  createdAt:created_time,
                  read:true,
                  user:{
                    _id:2,
                    name:data.id,
                    avatar:data.img
                  },
                  type:data.type,
                  user_id:data.user_id,
                  myname:data.type==1?data.myname:'',
                  friendname:data.type==1?data.friendname:'',
                  coin:data.type==1?data.coin:'',
                  post_id:data.type==1?data.post_id:''
                }]),
                focus:this.props.chatroom[data.user_id].focus
              }
            });
          }
          if(this.props.chatroom[data.user_id].focus===true){
            console.log('대화한 이력도 있고 앱을 키고 챗룸에 들어가 있는 상태')
            this._chatbedgeUp({
              type:data.type,
              text:data.text,
              user_id:data.user_id,
              bedge:0
            });
            if(this.state.appState!='active'){return;}
            let datam={
              my_id:this.props._id,
              your_user_id:data.user_id,
            };
            const obj = {
              body: JSON.stringify(datam),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              method: 'POST'
            }
            fetch(`${URL}/talkread`, obj)
            .then((response) => response.json())
            .then((responseJson) => {
    
            })
            .catch((error) => {
              console.error(error);
            });
          }else{
            this._chatbedgeUp({
              type:data.type,
              text:data.text,
              user_id:data.user_id,
              bedge:data.bedge
          });
          }
        }
      }
    }).bind(this));
    this.props.socket.on('READ', (data => {
      var created_time = parseInt(Date.now());
      if(this.props.chatroom[data.user_id]==undefined){return;}
      this.props.setchatroom({
        ...this.props.chatroom,
        [data.user_id]:{
          room:this.props.chatroom[data.user_id].room.map(em=>{
            return{
              ...em,
              read:true
            }
          }),
          focus:this.props.chatroom[data.user_id].focus
        }
      });
    }).bind(this));
  }
  beforeY=0;
  _getScroll = () => {
    const {scrollY} = this.state;
    return scrollY.interpolate({
        inputRange: [0, this.state.height*10000],
        outputRange: [0, 10000],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  _setBefore = (before) =>{
    this.setState({
      before
    })
  }
  _change = ()=>{
    var _data=this.state.dataProvider._data;
    var _post=this.state.post;
    _data.splice(0,1,{
      ..._post[3],
      like:true,
      currentIndex:0
    });
    this.setState({
      dataProvider: this.dataProvider.cloneWithRows(_data)
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
  async _highIndex(index){
    await this.setState({
      highIndex:index
    })
    if(index==0){
      return;
    }
    if(this.state.dataProvider._data.length-index<5){
      var isConnected=await _isConnected();
      if(!isConnected){
        await this.setState({
          loading:true,
          netinfo:'fail_reached'
        })
        return;
      }
      this.videogetter(1,false)
    }
  }
  lastScroll=0;
  groupLength=0;
  currentHeight=0;
  render() {
    const scrollY = this._getScroll();
    return (
      <>
      <View style={{
                  backgroundColor:'#000',
                  position:'absolute',top:0,left:0,
                  width,height:this.state.height>0?this.state.height:height
      }}
        onLayout={async (event) => {
          var {x, y, width, height} = event.nativeEvent.layout;
          this.page_height=height;
          this.setState({height});           
        }}
        behavior={Platform.OS==='ios'?"height":""} enabled
      >
        <NavigationEvents
          onDidFocus={async ()=>{
            this.backHandler = BackHandler.addEventListener(
              "hardwareBackPress",
              this.backAction
            );
            this.props.home1refresh_f(parseInt(Date.now()));
            this.props.barStyle_f('light-content');
            changeNavigationBarColor('black');
            if(this.groupLength!=this.props.group.length){
              this._reLoad();
            }
            this.setState({
              focused:true
            })
          }}
          onWillFocus={payload => {
            this.props.page_f('Home');
            Animated.timing(this.state.paused, {
              toValue: 0,
              duration: 10,
              easing: Easing.linear,
            }).start();
            if(this.groupLength!=this.props.group.length){
              this.setState({
                post:[],
                dataProvider: this.dataProvider.cloneWithRows([{type:700}])
              });
            }
          }}
          onWillBlur={payload => {
            if(this.backHandler!==undefined){
              this.backHandler.remove();
            }
            this.setState({
              focused:false
            })
            this.groupLength=this.props.group.length;
            this.lastScroll=parseInt(JSON.stringify(this.state.scrollY));
            Animated.timing(this.state.paused, {
              toValue: 1,
              duration: 10,
              easing: Easing.linear,
            }).start();
          }
          }
        />
        <StatusBar barStyle={this.props.barStyle} backgroundColor={'transparent'} translucent={true}/>
        <AnimatedRecyclerListView 
          layoutProvider={this._layoutProvider} 
          dataProvider={this.state.dataProvider} 
          ref='_scrollView'
          scrollEnabled={!this.state.refreshing}
          // onEndReached={async ()=>{
          //   if(this.state.dataProvider._data.length>=3){
          //     var isConnected=await _isConnected();
          //     if(!isConnected){
          //       await this.setState({
          //         loading:true,
          //         netinfo:'fail_reached'
          //       })
          //       return;
          //     }
          //     this.videogetter(3,false)
          //   }
          // }}
          // onEndReachedThreshold={0}
          renderFooter={()=>{
            if(this.state.loading===true){
              if(this.state.netinfo=='connected'){
                var _data=this.state.dataProvider._data;
                if(_data.length>=1){
                  return(
                    <View style={{width,height:this.state.height,backgroundColor:'#000',justifyContent:'center',alignItems:'center'}}>
                      <LottieView source={require('../../assets/animation/loading_home.json')} 
                    autoPlay loop style={{width:width*0.9,height:width*0.9}} resizeMode="cover"/>
                    </View>
                  )
                }else{
                  return null
                }
              }else{
                return(
                  <View style={{width,height,backgroundColor:'#222',justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:width*0.3,height:width*0.3,opacity:0.7}} source={require('../../assets/data_error.png')}/>
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
            }else{
              return(
                null
              )
            }
          }}
          rowRenderer={(type,data)=>{
            switch(data.type){
              case 0:
                if(Platform.OS=='ios'||Platform.Version<25){
                  return(
                    <AnimatedCellContainerPause 
                      style={{backgroundColor:"red",width,height:this.state.height}}
                      bottom={this.props.bottom}
                      index={data.currentIndex} 
                      scrollY={scrollY} 
                      // key={index.toString()}
                      item={data}
                      navigation={this.props.navigation}
                      paused={this.state.paused}
                      _id={this.props._id}
                      _love={this._love}
                      _unlove={this._unlove}
                      _setBefore={this._setBefore}
                      before={this.state.before}
                      _change={this._change}
                      _ripple={this._ripple}
                      _comment={this._comment}
                      user_arr={this.state.user_arr}
                      user_id={this.props.user_id}
                      group={this.props.group}
                      _dialogV={this._dialogV}
                      refreshIndex={this.state.refreshIndex}
                      height={this.state.height}
                      _highIndex={this._highIndex}
                    />
                  )
                }else{
                  return(
                    <AnimatedCellContainer 
                      style={{backgroundColor:"red",width,height:this.state.height}}
                      bottom={this.props.bottom}
                      index={data.currentIndex} 
                      scrollY={scrollY} 
                      // key={index.toString()}
                      item={data}
                      navigation={this.props.navigation}
                      paused={this.state.paused}
                      _id={this.props._id}
                      _love={this._love}
                      _unlove={this._unlove}
                      _setBefore={this._setBefore}
                      before={this.state.before}
                      _change={this._change}
                      _ripple={this._ripple}
                      _comment={this._comment}
                      user_arr={this.state.user_arr}
                      user_id={this.props.user_id}
                      group={this.props.group}
                      _dialogV={this._dialogV}
                      refreshIndex={this.state.refreshIndex}
                      height={this.state.height}
                      _highIndex={this._highIndex}
                    />
                  )
                }
              case 102:
                return(
                  <View style={{width,height,backgroundColor:'#000',justifyContent:'center',alignItems:'center'}}>
                    <Text style={{color:"rgba(255,255,255,0.9)",fontSize:14}}>영상편지가 없습니다.</Text>
                    <TouchableOpacity style={{backgroundColor:'rgba(234,29,93,1)',marginTop:16,height:40,justifyContent:'center',alignItems:'center',width:110,borderRadius:8}} 
                      onPress={()=>{
                        this.props.navigation.navigate('Reco',{activePage:1})
                      }}
                    >
                      <Text style={{color:"rgba(255,255,255,0.8)",fontWeight:'bold'}}>그룹 가입하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:'#279b37',marginTop:16,height:40,justifyContent:'center',alignItems:'center',width:110,borderRadius:8}}
                      onPress={()=>{
                        this.props.navigation.navigate('Reco',{activePage:0})
                      }}
                    >
                      <Text style={{color:"rgba(255,255,255,0.8)",fontWeight:'bold'}}>친구 찾기</Text>
                    </TouchableOpacity>
                  </View>
                )
              case 4:
                return(
                  <View style={{width,height:this.state.height,backgroundColor:'blue'}}>
                  </View>
                )
              case 600:
                return(
                  <View style={{width,height,backgroundColor:'#222',justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:width*0.3,height:width*0.3,opacity:0.7}} source={require('../../assets/data_error.png')}/>
                    <Text style={{fontSize:16,color:'#f2f2f2',fontWeight:'bold',marginBottom:16}}>인터넷 연결</Text>
                    <Text style={{fontSize:14,color:'#f2f2f2',textAlign:'center',marginBottom:32}} >{'오프라인 상태입니다.\n인터넷 연결을 확인하세요.'}</Text>
                    <TouchableOpacity style={{height:40,paddingHorizontal:24,borderWidth:1,borderColor:'#f2f2f2',borderRadius:8,justifyContent:'center',alignItems:'center'}} onPress={ async ()=>{
                      var isConnected=await _isConnected();
                      if(isConnected){
                        await this.setState({
                          post:[],
                          dataProvider: this.dataProvider.cloneWithRows([{type:700}]),
                        })
                        this._getfetch();
                        this.setState({netinfo:'connected'})
                      }
                    }}>
                      <Text style={{color:'#f2f2f2',fontSize:14,fontWeight:'bold'}}>재시도</Text>
                    </TouchableOpacity>
                  </View>
                )
              case 700:
                return(
                  <View style={{width,height:this.state.height,backgroundColor:'#000',justifyContent:'center',alignItems:'center'}}>
                    <LottieView source={require('../../assets/animation/loading_home.json')} 
                  autoPlay loop style={{width:width*0.9,height:width*0.9}} resizeMode="cover"/>
                  </View>
                )
              default:
                break;          
            }

          }}
          pagingEnabled={true} 
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: this.state.scrollY}}
              }
            ]
          )}

          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                tintColor="#fff"
                refreshing={this.state.refreshing}
                onRefresh={async () => {
                  this._refresh();
                }}
                progressViewOffset={56}
              />
            )
          }}
        >
        </AnimatedRecyclerListView >
        <TouchableOpacity style={{width,height:STATUSBAR_HEIGHT+56,top:0,left:0,position:'absolute'}}
          onPress={()=>{
            this.refs._scrollView._component.scrollToOffset(0,0,0);
          }}
        />
        <View style={{...styles.bottom_container,height:(56+this.props.bottom)}}>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Home')
          }}>
            <Image source={require(`../../assets/homeBtn_filled.png`)} style={{width:56*width/450,height:56*width/450}}/> 
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Search')
          }}>
            <View>
              <Image source={require(`../../assets/alarmBtn_outlined_white.png`)} style={{width:46*width/450,height:46*width/450,opacity:0.8}}/>
              {
                (()=>{
                  var number=0;
                  this.props.alarm.map(em=>{
                    if(em.show==true){
                      number++;
                    }
                  });
                  if(number>0){
                    return(
                      <View style={number<10?styles.bedgeStyle1:styles.bedgeStyle2}>
                        <Text style={{color:'#fff',fontSize:9,fontWeight:'bold'}}>{number}</Text>
                      </View>
                    )
                  }else{
                    return null;
                  }
                })()
              }
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Post')
          }}>
            <Image source={require(`../../assets/sendBtn_outlined_white.png`)} style={{width:48*width/450,height:48*width/450,opacity:0.8}}/> 
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Chat')
          }}>
            <View>
              <Image source={require(`../../assets/chatBtn_outlined_white.png`)} style={{width:43*width/450,height:43*width/450,opacity:0.8}}/>
              {
                (()=>{
                  var number=0;
                  this.props.chatlist.map(emP=>{
                    var info_i=emP.info.findIndex(em=>em.user_id==this.props.user_id);
                    number+=emP.info[info_i].bedge
                  });
                  if(number>0){
                    return(
                      <View style={number<10?styles.bedgeStyle1_chat:styles.bedgeStyle2_chat}>
                        <Text style={{color:'#fff',fontSize:9,fontWeight:'bold'}}>{number}</Text>
                      </View>
                    )
                  }else{
                    return null;
                  }
                })()
              }
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Profile')
          }}>
            <Image source={require(`../../assets/profileBtn_outlined_white.png`)} style={{width:38*width/450,height:38*width/450,opacity:0.8}}/> 
          </TouchableOpacity>
        </View>
        {
          this.props.progress!==0?(
            <AnimatedVideoProgress progress={this.props.progress}/>
          ):(null)
        }
        {
          this.state.ripple===true?(
            <Ripple 
              height={height*0.4} 
              _ripple={this._ripple} 
              user_id={this.props.user_id} 
              post_id={this.state.post_id} 
              navigation={this.props.navigation}
              backInt={this.state.backInt}
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
              _deletePost={this._deletePost}
              _deletePostArray={this._deletePostArray}
              follow={this.props.follow}
              setfollow={this.props.setfollow}
              chatlist={this.props.chatlist}
              setchatlist={this.props.setchatlist}
            />
          ):(null)
        }
        <View style={{width:0,height:0,left:-3000,bottom:-3000,overflow:'hidden'}}>
          <Image source={require(`../../assets/homeBtn_outlined.png`)} style={{width:42,height:42,opacity:0.7}}/> 
          <Image source={require(`../../assets/searchBtn_outlined_black.png`)} style={{width:40,height:40,opacity:0.7}}/> 
          <Image source={require(`../../assets/chatBtn_outlined_black.png`)} style={{width:40,height:40,opacity:0.7}}/>
          <Image source={require(`../../assets/profileBtn_outlined_black.png`)} style={{width:38,height:38,opacity:0.7}}/>
          <Image source={require(`../../assets/searchBtn_outlined_pink.png`)} style={{width:40,height:40}}/> 
          <Image source={require(`../../assets/chatBtn_outlined_pink.png`)} style={{width:40,height:40}}/>
          <Image source={require(`../../assets/profileBtn_outlined_pink.png`)} style={{width:38,height:38}}/>
          <Image source={require(`../../assets/sendBtn_outlined_black.png`)} style={{width:38,height:38}}/>
          <Image source={require(`../../assets/sendBtn_outlined_white.png`)} style={{width:38,height:38}}/>
          <Image source={require(`../../assets/sendBtn_outlined_pink.png`)} style={{width:38,height:38}}/>
          <Image source={require(`../../assets/homeBtn_outlined_white.png`)}  style={{width:38,height:38}}/> 
          <Image source={require(`../../assets/profileBtn_filled_white.png`)}  style={{width:38,height:38}}/>
          <Image source={require(`../../assets/alarmBtn_outlined_white.png`)}  style={{width:38,height:38}}/>
          <Image source={require(`../../assets/alarmBtn_outlined_black.png`)}  style={{width:38,height:38}}/>
          <Image source={require(`../../assets/alarmBtn_outlined_pink.png`)}  style={{width:38,height:38}}/>

        </View>
        {
          (()=>{
            switch(this.state.netinfo){
              case 'connected':
                return null;
              case 'fail_login':
                return(
                  <View style={{width,height,backgroundColor:'#222',position:'absolute',top:0,left:0,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:width*0.3,height:width*0.3,opacity:0.7}} source={require('../../assets/data_error.png')}/>
                    <Text style={{fontSize:16,color:'#f2f2f2',fontWeight:'bold',marginBottom:16}}>인터넷 연결</Text>
                    <Text style={{fontSize:14,color:'#f2f2f2',textAlign:'center',marginBottom:32}} >{'오프라인 상태입니다.\n인터넷 연결을 확인하세요.'}</Text>
                    <TouchableOpacity style={{height:40,paddingHorizontal:24,borderWidth:1,borderColor:'#f2f2f2',borderRadius:8,justifyContent:'center',alignItems:'center'}} onPress={ async ()=>{
                      var isConnected=await _isConnected();
                      if(isConnected){
                        this._login();
                        this.setState({netinfo:'connected'})
                      }
                    }}>
                      <Text style={{color:'#f2f2f2',fontSize:14,fontWeight:'bold'}}>재시도</Text>
                    </TouchableOpacity>
                  </View>
                );
              default:
                return null;
            }
          })()
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#000',
    justifyContent:'center',
    alignItems:'center'
  },
  child: {
    height: height,
    width,
    justifyContent: 'center'
  },
  text: {
    fontSize: width * 0.5,
    textAlign: 'center'
  },
  bottom_container:{
    position:'absolute',
    flexDirection:'row',
    bottom:0,
    left:0,
    width,
    backgroundColor:'rgba(0,0,0,0)',

  },
  bottom_button:{
    width:width/5,
    height:56,
    backgroundColor:'rgba(0,0,0,0)',
    justifyContent:'center',
    alignItems:'center'
  },
  bedgeStyle1:{
    position:'absolute',
    left:46*width/450*0.55,
    top:46*width/450*0.05,
    width:16,
    height:16,
    backgroundColor:'rgb(234,29,93)',
    borderRadius:24,
    justifyContent:'center',
    alignItems:'center'
  },
  bedgeStyle2:{
    position:'absolute',
    left:46*width/450*0.55,
    top:46*width/450*0.05,
    paddingHorizontal:4,
    height:16,
    backgroundColor:'rgb(234,29,93)',
    borderRadius:24,
    justifyContent:'center',
    alignItems:'center'
  },
  bedgeStyle1_chat:{
    position:'absolute',
    left:40*width/450*0.55,
    top:40*width/450*0.05,
    width:16,
    height:16,
    backgroundColor:'rgb(234,29,93)',
    borderRadius:24,
    justifyContent:'center',
    alignItems:'center'
  },
  bedgeStyle2_chat:{
    position:'absolute',
    left:40*width/450*0.55,
    top:40*width/450*0.05,
    paddingHorizontal:4,
    height:16,
    backgroundColor:'rgb(234,29,93)',
    borderRadius:24,
    justifyContent:'center',
    alignItems:'center'
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    uid:state.setinfo.uid,
    user_id:state.setinfo.user_id,
    id:state.setinfo.id,
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
    mainrefresh:state.sidefunc.mainrefresh,
    alarm:state.sidefunc.alarm,
    comment:state.sidefunc.comment,
    userarr:state.sidefunc.userarr,

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
    mainrefresh_f: (mainrefresh)=>{
      dispatch(actions.mainrefresh(mainrefresh));
    },
    setcomment: (comment)=>{
      dispatch(actions.setcomment(comment));
    },
  }   
}

export default connect(mapStateToProps,mapDispatchToProps)(HomeScreen);
