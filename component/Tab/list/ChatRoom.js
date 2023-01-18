import React,{Component} from 'react';
import {View, StyleSheet,Dimensions,Image,Text,TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image'
import Ripple from 'react-native-material-ripple';


const {width}=Dimensions.get("window");
export default class ChatRoom extends Component{
  constructor(props){
    super(props);
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
  render(){
    var props=this.props.item.item;
    var i=props.info.findIndex(em=>em.user_id!=this.props.user_id);
    if(i==0){
      var bedge=props.info[1].bedge;
    }else{
      var bedge=props.info[0].bedge;
    }
    var t_index=false;
    return(
      <Ripple style={styles.container} rippleSize={800} rippleOpacity={0.1} onPress={()=>{
        if(t_index==false){
          t_index=true;
          this.props.navigation.push('Talking',{item:{
            user_id:props.info[i].user_id,
            id:props.profile.id,
            img:props.profile.img,
          }});
        }
        setTimeout(()=>{t_index=false
          console.log('t_index ==> false');
        },500);
      }}>
        {
          props.profile.img===''?(
            <Image source={require('../../../assets/dog.png')} style={styles.img_c}/>
          ):(
            <FastImage
              style={styles.img_c}
              source={{
                  uri: props.profile.img,
                  priority: FastImage.priority.normal,
              }}
            />
          )
        }
        <View style={styles.main}>
          <Text style={styles.id}>{props.profile.id}</Text>
          <Text style={styles.main_text} numberOfLines={2} ellipsizeMode='tail'>{(()=>{
            switch(props.room.type){
              case 0:
                return props.room.text;
              case 1:
                return '영상 요청';
              case 2:
                return '영상 전송'
              default:
                return '';
            }
            })()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.info_time}>{this._timefunc(this.props.item.item.updatetime)}</Text>
          {
            (()=>{
              switch(props.room.type){
                case 1:
                  var backgroundColor='#ea1d5d'
                  break;
                default:
                  var backgroundColor='#ea1d5d'
                  break;
              }
              if(bedge==0){
                backgroundColor='#fff'
              }
              return(
                <View style={{...styles.info_bedge_container}}>
                  <View style={{width:7,height:7,backgroundColor,borderRadius:10}}/>
                  <Text style={{...styles.info_bedge_txt,color:backgroundColor}}>{bedge}</Text>
                </View>
              )
            })()
          }
        </View>
      </Ripple>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:width,
    height:70,
    // backgroundColor:'red',
    marginBottom:5,
    flexDirection:'row'
  },
  img_c:{
    width:45,
    height:45,
    backgroundColor:'rgba(100,100,100,0.3)',
    borderRadius:50,
    overflow:'hidden',
    alignSelf:'center',
    marginLeft:15
  },
  main:{
    flex:1,
    // backgroundColor:'blue',
    justifyContent:'center'
  },
  id:{
    color:'#000',
    fontSize:15,
    // backgroundColor:'yellow',
    paddingLeft:15,
    marginBottom:3
  },
  main_text:{
    paddingLeft:18,
    color:'#777',
    fontSize:13
  },
  info:{
    width:85,
    height:70,
    justifyContent:'center',
    alignItems:'flex-end',
  },
  info_time:{
    fontSize:12,
    color:'rgb(160,160,160)',
    marginRight:15,
    marginBottom:2,
  },
  info_bedge_container:{
    justifyContent:'flex-end',
    alignItems:'center',
    flexDirection:'row',
    marginRight:15,
    // backgroundColor:'blue'
  },
  info_bedge_txt:{
    fontSize:11,
    color:'#ea1d5d',
    fontWeight:'bold',
    paddingHorizontal:0,
    marginLeft:3
    // backgroundColor:'red',
    
  }
})