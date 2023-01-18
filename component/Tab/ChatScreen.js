import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,Animated,FlatList,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Header from '../header/Header'
import {URL,STATUSBAR_HEIGHT} from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import ChatRoom from './list/ChatRoom';
import { NavigationEvents } from 'react-navigation';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const {width,height}=Dimensions.get("window");
class ChatScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      scrollY: new Animated.Value(0),
      barStyle:'dark-content'
    }
    this._getfetch=this._getfetch.bind(this);
    this._getBlack=this._getBlack.bind(this);
    this._getElevation=this._getElevation.bind(this);
  };
  _getfetch =()=>{
    let data={
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
    fetch(`${URL}/getchatlist`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status==100){
        var chatlist=responseJson.post.map(emP=>{
          for(var i=0;i<2;i++){
            if(emP.info[i].user_id!=this.props.user_id){
              let f_i=responseJson.user_arr.findIndex(emS=>emS.user_id==emP.info[i].user_id);
              if(f_i!==-1){
                return{
                  ...emP,
                  profile:{
                    id:responseJson.user_arr[f_i].id,
                    img:responseJson.user_arr[f_i].img,
                  }
                }
              }
            }
          }
        });
        console.log(chatlist)
        this.props.setchatlist(chatlist);
        console.log(chatlist);
        if(chatlist.length==0){
          console.log('채팅 내역 없음')
        }
      }else{
        console.log('getchatlist: err status:'+responseJson.status);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async componentDidMount(){

    // this.socket.on('CHAT_RECIVE', data => {
    //   alert(`${data.from} send message: ${data.message}`)
    // })
  }
  _getBlack = () => {
    const {scrollY} = this.state;
    return scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: ['rgba(0,0,0,0)','rgba(0,0,0,1)'],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  _getElevation = () => {
    const {scrollY} = this.state;
    return scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0,3],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  userList;
  render() {
    const black = this._getBlack();
    const elevation = this._getElevation();
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            this.props.page_f('Chat');
          }}
          onDidFocus={payload => {
            this.props.barStyle_f('dark-content');
          }}
        />
        <StatusBar barStyle={this.props.barStyle} backgroundColor={'transparent'} translucent={true}/>
        <Animated.View style={Platform.OS === 'ios' ?{
            ...styles.header,
            shadowColor: black,
          }:{
            ...styles.header,
            elevation
          }}>
            <Text style={{color:"#fff",zIndex:13,position:'absolute',bottom:0,left:24,height:55,lineHeight:55,color:"rgba(0,0,0,0.9)",fontSize:20,fontWeight:'bold'}}>채팅</Text>
        </Animated.View>
        <AnimatedFlatList
          scrollEventThrottle={16}
          bounces={false}
          showsVerticalScrollIndicator={true}
          overScrollMode={'never'}
          style={{
            flex:1,
            zIndex: 10,
          }}
          data={(()=>{
            var chatlist_temp=[];
            let cl=this.props.chatlist.length;
            for(var i=0;i<cl;i++){
              if(this.props.chatlist[i].room.type!==9999){
                chatlist_temp.push(this.props.chatlist[i])

              }
            }
            return chatlist_temp
          })()}
          renderItem={(item)=>{return <ChatRoom item={item} navigation={this.props.navigation} user_id={this.props.user_id}/>}}
          keyExtractor={(item, i) => i.toString()}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {contentOffset: {y: this.state.scrollY}}
              }
            ]
          )}
          />
          {
            this.props.chatlist.length==0?(
              <View style={{position:'absolute',height:320,width,top:(height*0.5-160),left:0,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:16,color:'rgba(0,0,0,0.7)'}}>채팅 내역이 존재하지 않습니다.</Text>
              </View>
            ):(null)
          }
          <View style={{...styles.bottom_container,height:(56+this.props.bottom)}}>
            <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
              this.props.navigation.navigate('Home')
            }}>
              <Image source={require(`../../assets/homeBtn_outlined.png`)} style={{width:42*width/450,height:42*width/450,opacity:0.7}}/> 
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
              this.props.navigation.navigate('Search')
            }}>
              <View>
                <Image source={require(`../../assets/alarmBtn_outlined_black.png`)} style={{width:46*width/450,height:46*width/450,opacity:0.7}}/>
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
              <Image source={require(`../../assets/sendBtn_outlined_black.png`)} style={{width:48*width/450,height:48*width/450,opacity:0.8}}/> 
            </TouchableOpacity> 
            <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
              this.props.navigation.navigate('Chat')
            }}>
            <View>
              <Image source={require(`../../assets/chatBtn_outlined_pink.png`)} style={{width:43*width/450,height:43*width/450}}/>
              {
                (()=>{
                  var number=0;
                  console.log(this.props.chatlist);
                  this.props.chatlist.map(emP=>{
                    var info_i=emP.info.findIndex(em=>em.user_id==this.props.user_id);
                    console.log('info_i::'+info_i)
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
              <Image source={require(`../../assets/profileBtn_outlined_black.png`)} style={{width:38*width/450,height:38*width/450,opacity:0.7}}/> 
            </TouchableOpacity> 
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },
  header:{
    height:STATUSBAR_HEIGHT+55,
    width:width,
    backgroundColor:'#fff',
    zIndex:11,
    flexDirection:'row',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    shadowColor:'#000'
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
    user_id:state.setinfo.user_id,
    socket:state.sidefunc.socket,
    chatlist:state.sidefunc.chatlist,
    barStyle:state.sidefunc.barStyle,
    bottom:state.sidefunc.bottom,
    alarm:state.sidefunc.alarm,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setall: (_id,id,user_id,coin,logintype,pwindex)=>{
      dispatch(actions.setall(_id,id,user_id,coin,logintype,pwindex));
    },
    setsocket: (socket)=>{
      dispatch(actions.setsocket(socket));
    },
    setchatlist: (chatlist)=>{
      dispatch(actions.setchatlist(chatlist));
    }, 
    barStyle_f: (barStyle)=>{
      dispatch(actions.barStyle(barStyle));
    },
    page_f: (page)=>{
      dispatch(actions.page(page));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(ChatScreen);