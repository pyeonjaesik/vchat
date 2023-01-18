import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,TextInput,Keyboard,Dimensions,FlatList,Platform,StatusBar} from 'react-native';
import ShowItem from './ShowItem';
// import Dialog from './Dialog';
import Toast from 'react-native-simple-toast';
import {KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {URL} from '../config';
import BookPass from './BookPass';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import renderBubble,{renderTime} from './Tab/list/renderBubble'
import FastImage from 'react-native-fast-image'


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() :  StatusBar.currentHeight;
const {width,height}=Dimensions.get("window");
class TalkingScreen extends Component{
  constructor(props){
    super(props);
    var item=this.props.navigation.getParam('item');
    this.state={
      text:'',
      multiline:true,
      user_id:item.user_id,
      id:item.id,
      img:item.img,
      messages: [],
    }
    this.didFocus=this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.props.setchatroom({
          ...this.props.chatroom,
          [this.state.user_id]:{
            room:this.props.chatroom[this.state.user_id]==undefined?[]:this.props.chatroom[this.state.user_id].room,
            focus:true
          }
        });
        this._read();
        // alert('willFocusBlur');
      }
    );
    this.willBlur=this.props.navigation.addListener(
      'willBlur',
      payload => {
        this.props.setchatroom({
          ...this.props.chatroom,
          [this.state.user_id]:{
            room:this.props.chatroom[this.state.user_id]==undefined?[]:this.props.chatroom[this.state.user_id].room,
            focus:false
          }
        }); 
        this.willBlur.remove();
        this.didFocus.remove();
        // this._getfetch();
      }
    );
    this._send=this._send.bind(this);
    this._getfetch=this._getfetch.bind(this);
    this._read=this._read.bind(this);
    this._readUp=this._readUp.bind(this);
    this._mscp=this._mscp.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  didFocus;
  async _send(messages){
    this.props.setchatroom({
      ...this.props.chatroom,
      [this.state.user_id]:{
        room:GiftedChat.append(this.props.chatroom[this.state.user_id].room, [{
          ...messages[0],
          createdAt:parseInt(Date.now()),
          read:false
        }]),
        focus:true
      }
    });
    this._readUp({
      type:0,
      text:messages[0].text
    });
    let data={
      my_id:this.props._id,
      your_user_id:this.state.user_id,
      text:messages[0].text
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/talk`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status=100){

      }else{

      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _mscp=({post_id,user_id,video})=>{
    this.props.setcoin(this.props.coin+this.state.book_price);
    // let roll_result = this.state.roll_result;
    var chatroom_temp=this.props.chatroom[user_id].room;
    let c_fi=chatroom_temp.findIndex(em=>em.type==1&&em.post_id==post_id);
    var chatroom_component=chatroom_temp[c_fi];
    chatroom_temp.splice(c_fi,1,{
      ...chatroom_component,
      type:10
    });
    var created_time=parseInt(Date.now());
    chatroom_temp.unshift({
      _id:created_time,
      text:'',
      createdAt:created_time,
      read:false,
      user:{
        _id:1,
        name:this.props.id,
        avatar:this.props.img
      },
      type:2,
      user_id:this.props.user_id,
      coin:0,
      post_id:post_id,
      ms_id:'',
      clip:[
        {
          uri:video.path,
          focus:video.mime
        }
      ]
    });
    this.props.setchatroom({
      ...this.props.chatroom,
      [user_id]:{
        room:[],
        focus:this.props.chatroom[user_id].focus
      }
    })
    this.props.setchatroom({
      ...this.props.chatroom,
      [user_id]:{
        room:chatroom_temp,
        focus:this.props.chatroom[user_id].focus
      }
    }); 
    this._readUp({
      type:2,
      text:''
    });
    console.log('gdfdfs');
    ///
    ///
    ///
    ///
    let formData = new FormData();
    formData.append("file", {
      uri: video.path,
      type: video.mime,
      name: 'postvideo',
    });
    formData.append('book_id',this.props._id);
    formData.append('user_id',user_id);
    formData.append('post_id',post_id);
  
    const options = {
      method: 'POST',
      body: formData
    };
    console.log('mscp!!');
    fetch(`${URL}/uploadmscp`, options)
    .then((response) => response.json())
    .then(((responseJson) => {
      if(responseJson.status===100){
        Toast.show('영상 전송을 완료하였습니다.');
        // this.props.navigation.goBack();
        // this.props.setcoin(responseJson.coin);
      }else{
        Toast.show('영상 전송 중 문제가 발생하였습니다.');
      }
  
    }).bind(this))
    .catch((error) => {
      console.error(error);
    });
  }
  async _getfetch(){
    let data={
      my_id:this.props._id,
      your_user_id:this.state.user_id,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/gettalk`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status==100){
        console.log('gettalk');
        var my_f_i = responseJson.info.findIndex(em=>em.user_id==this.props.user_id);
        var your_f_i = responseJson.info.findIndex(em=>em.user_id==this.state.user_id);
        var room = responseJson.room.map((em,index)=>{
          switch(em.type){
            case 0:
              return{
                _id:index,
                text:em.text,
                createdAt:em.ct,
                type:em.type,
                read:index<responseJson.info[your_f_i].bedge?false:true,
                user_id:em.user_id,
                user:{
                  _id:em.user_id==responseJson.info[my_f_i].user_id?1:2,
                  name:this.state.id,
                  avatar:this.state.img
                }
              }
            case 1:
              return{
                ...em,
                _id:index,
                text:em.text,
                createdAt:em.ct,
                post_id:em.post_id,
                type:em.type,
                myname:em.myname,
                friendname:em.friendname,
                coin:em.coin,
                read:index<responseJson.info[your_f_i].bedge?false:true,
                user_id:em.user_id,
                user:{
                  _id:em.user_id==responseJson.info[my_f_i].user_id?1:2,
                  name:this.state.id,
                  avatar:this.state.img
                }
              }
              case 10:
                return{
                  ...em,
                  _id:index,
                  text:em.text,
                  createdAt:em.ct,
                  post_id:em.post_id,
                  ms_id:em.ms_id,
                  type:em.type,
                  coin:em.coin,
                  read:index<responseJson.info[your_f_i].bedge?false:true,
                  user_id:em.user_id,
                  user:{
                    _id:em.user_id==responseJson.info[my_f_i].user_id?1:2,
                    name:this.state.id,
                    avatar:this.state.img
                  }
                } 
              case 2:
                return{
                  ...em,
                  _id:index,
                  text:em.text,
                  createdAt:em.ct,
                  post_id:em.post_id,
                  ms_id:em.ms_id,
                  type:em.type,
                  coin:em.coin,
                  read:index<responseJson.info[your_f_i].bedge?false:true,
                  user_id:em.user_id,
                  user:{
                    _id:em.user_id==responseJson.info[my_f_i].user_id?1:2,
                    name:this.state.id,
                    avatar:this.state.img
                  }
                } 
          }
        });
        this.props.setchatroom({
          ...this.props.chatroom,
          [this.state.user_id]:{
            room,
            focus:true
          }
        });
      }else if(responseJson.status==102){
        this.props.setchatroom({
          ...this.props.chatroom,
          [this.state.user_id]:{
            room:[],
            focus:true
          }
        });
        var chatlist_index=false;
        var tpc_l=this.props.chatlist.length;
        var chatlist_temp=this.props.chatlist.map(x=>x);
        chatlist_temp.push({
          info:[
            {
              user_id:this.props.user_id,
              show:true,
              bedge:0
            },
            {
              user_id:this.state.user_id,
              show:true,
              bedge:0
            },
          ],
          room:{
            type:9999,
            user_id:this.state.user_id,
            text:'',
            ct:parseInt(Date.now())
          },
          updatetime:parseInt(Date.now()),
          profile:{id:this.state.id,img:this.state.img}
        })
        for(var i=0;i<tpc_l;i++){
          var your_f_i=this.props.chatlist[i].info.findIndex(em=>em.user_id==this.state.user_id);
          if(your_f_i!==-1){
            chatlist_index=true;
            break;
          }
        }
        if(chatlist_index===false){
          this.props.setchatlist(chatlist_temp)
        }
      }else{
        console.log('err');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  componentDidMount() {
    this._getfetch();
  }
  _readUp({type,text}){
    var temp_chat;
    var temp_index=0;
    var chatlist=this.props.chatlist.map((em,index)=>{
      var your_f_i=em.info.findIndex(em=>em.user_id==this.state.user_id);
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
              bedge:0
            },
            {
              user_id:em.info[your_f_i].user_id,
              show:true,
              bedge:em.info[your_f_i].bedge
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
    if(this.props.chatlist.length>0){
      chatlist.splice(temp_index,1);
      chatlist.unshift(temp_chat)
      this.props.setchatlist(chatlist);
    }
  }
  _read(){
    console.log('_read');
    var chatlist=this.props.chatlist.map(em=>{
      var your_f_i=em.info.findIndex(em=>em.user_id==this.state.user_id);
      if(your_f_i!=-1){
        if(your_f_i==0){
          var my_f_i=1;
        }else{
          var my_f_i=0;
        }
        return{
          ...em,
          info:[
            {
              user_id:em.info[my_f_i].user_id,
              show:true,
              bedge:0
            },
            {
              user_id:em.info[your_f_i].user_id,
              show:true,
              bedge:em.info[your_f_i].bedge
            }
          ]
        }
      }else{
        return em;
      }
    });
    this.props.setchatlist(chatlist);
  }
  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <View style={{...styles.header,zIndex:11}}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{this.props.navigation.goBack()}}
          >
            <Image source={require('../assets/left_tri.png')} style={{width:20,height:20}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.header_profile} onPress={()=>{
            this.props.navigation.navigate('Book',{
              item:{
                user_id:this.state.user_id,
                img:this.state.img,
                id:this.state.id
              }
            })
          }}>
            <Text style={styles.header_profile_txt}>{this.state.id}</Text>
          </TouchableOpacity>
        </View>
        <GiftedChat
          style={{zIndex:10}}
          onPressAvatar={()=>{
            this.props.navigation.navigate('Book',{
              item:{
                user_id:this.state.user_id,
                img:this.state.img,
                id:this.state.id
              }
            })
          }}
          isCustomViewBottom={true}
          scrollToBottom={false}
          
        // renderMessage={()=>{
        //   return(<View style={{width:100,height:100,backgroundColor:'blue'}}></View>)
        // }}
        // renderDay={()=>{
        //   return(<View style={{width:100,height:100,backgroundColor:'blue'}}></View>)

        // }}
          
        // renderBubble={()=>{
        //   return(<View style={{width:100,height:100,backgroundColor:'blue'}}></View>)
        // }}
        // renderCustomView={(image)=>{
        //   return(<View style={{alignSelf:'flex-end',width:10,height:10,backgroundColor:'blue'}}></View>)

        // }}
        renderSystemMessage={()=>{
          return(<View style={{width:50,height:50,backgroundColor:'blue'}}>
              <View style={{width:30,height:30,backgroundColor:'red',left:-10}}/>
            </View>
            )
        }}
          renderTime={renderTime}
          renderBubble={(item)=>{
            return renderBubble(item,this.props.user_id,this._mscp)
          }}

          renderMessageImage={(image)=>{
            return(<View style={{width:width*0.8,height:width*0.2,backgroundColor:'blue'}}></View>)

          }}
          renderUsernameOnMessage={false}
          placeholder={''}
          messages={this.props.chatroom[this.state.user_id]==undefined?[]:this.props.chatroom[this.state.user_id].room}
          onSend={messages => this._send(messages)}
          user={{
            _id: 1,
          }}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  header:{
    width,
    height:55+STATUSBAR_HEIGHT,
    backgroundColor:'#fff',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    shadowColor:'#000',
    flexDirection:'row'
  },
  leftbtn:{
    marginTop:STATUSBAR_HEIGHT,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  header_profile:{
    marginTop:STATUSBAR_HEIGHT,
    marginLeft:0,
    height:55,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  header_profile_img:{
    width:36,
    height:36,
    borderRadius:48,
    overflow:'hidden',
    justifyContent:'center',
    alignItems:'center'
  },
  header_profile_txt:{
    color:'rgba(0,0,0,0.8)',
    fontWeight:'bold',
    fontSize:18,
    marginLeft:8
  },
  ScrollView_container:{
    width,
    flex:1,
  },
  bottom_container:{
    position:'absolute',
    left:0,
    bottom:0,
    width:'100%',
    minHeight:50,
    maxHeight:100,
    backgroundColor:'white',
    borderTopWidth:1,
    borderColor:'rgba(150,150,150,0.2)',
    flexDirection:'row',
    alignItems:'center',
  },
  bottom_attach_container:{
    width:50,
    height:'100%',
    // backgroundColor:'blue'
  },
  bottom_talk:{
    marginTop:0,
    // backgroundColor:'red',
    flex:1,
    minHeight:50,
    paddingVertical:5
  },
  bottom_send_container:{
    width:50,
    height:'100%',
    // backgroundColor:'yellow',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  bottom_send:{
    width:50,
    height:'100%',
    // backgroundColor:'blue',
    justifyContent:'flex-end',
    alignItems:'center'
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    id:state.setinfo.id,
    user_id:state.setinfo.user_id,
    coin:state.setinfo.coin,
    socket:state.sidefunc.socket,
    chatroom:state.sidefunc.chatroom,
    chatlist:state.sidefunc.chatlist
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setcoin: (coin)=>{
      dispatch(actions.setcoin(coin));
    },
    setchatroom: (coin)=>{
      dispatch(actions.setchatroom(coin));
    },
    setchatlist: (chatlist)=>{
      dispatch(actions.setchatlist(chatlist));
    }, 
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(TalkingScreen);