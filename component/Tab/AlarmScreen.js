import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,Animated,FlatList,TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Header from '../header/Header'
import {URL,STATUSBAR_HEIGHT} from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import AlarmList from './list/AlarmList';
import { NavigationEvents } from 'react-navigation';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const {width,height}=Dimensions.get("window");
class AlarmScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      scrollY: new Animated.Value(0),
      barStyle:'dark-content'
    }
    this._getBlack=this._getBlack.bind(this);
    this._getElevation=this._getElevation.bind(this);
  };
  async componentDidMount(){

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
            this.props.page_f('Search');
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
            <Text style={{color:"#fff",zIndex:13,position:'absolute',bottom:0,left:24,height:55,lineHeight:55,color:"rgba(0,0,0,0.9)",fontSize:20,fontWeight:'bold'}}>알림</Text>
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
          data={this.props.alarm}
          renderItem={(item)=>{
            return(
              <AlarmList 
                item={item.item} 
                navigation={this.props.navigation} 
                user_arr={this.props.userarr} 
                user_id={this.props.user_id}
                id={this.props.id}
                group={this.props.group}
              />
            ) 
          }}
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
            this.props.alarm.length==0?(
              <View style={{position:'absolute',height:320,width,top:(height*0.5-160),left:0,justifyContent:'center',alignItems:'center'}}>
                <Text style={{fontSize:16,color:'rgba(0,0,0,0.7)'}}>새로운 알림이 없습니다.</Text>
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
                <Image source={require(`../../assets/alarmBtn_outlined_pink.png`)} style={{width:46*width/450,height:46*width/450}}/>
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
              <Image source={require(`../../assets/chatBtn_outlined_black.png`)} style={{width:43*width/450,height:43*width/450,opacity:0.7}}/>
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
    id:state.setinfo.id,
    socket:state.sidefunc.socket,
    chatlist:state.sidefunc.chatlist,
    barStyle:state.sidefunc.barStyle,
    bottom:state.sidefunc.bottom,
    alarm:state.sidefunc.alarm,
    userarr:state.sidefunc.userarr,
    group:state.setinfo.group,

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
    setalarm: (alarm)=>{
      dispatch(actions.setalarm(alarm));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(AlarmScreen);