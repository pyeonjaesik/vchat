import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,TouchableOpacity,View} from 'react-native';
import {URL} from '../../../config';
import FastImage from 'react-native-fast-image'

const {width}=Dimensions.get("window");
export default class CommentList extends Component{
  constructor(props){
    super(props);
    var d = new Date(parseInt(this.props.item.ct));
    var h=d.getHours();
    var m=d.getMinutes();
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
    var dy=d.getFullYear();
    var dm=d.getMonth()+1;
    var dd=d.getDate();
    this.state={
      time:h,
      day:`${dy}년 ${dm}월 ${dd}일`
    }
  }
  render(){
    var dp = new Date(parseInt(this.props.prev.ct));
    var dpy=dp.getFullYear();
    var dpm=dp.getMonth()+1;
    var dpd=dp.getDate();
    var d = new Date(parseInt(this.props.item.ct));
    var dy=d.getFullYear();
    var dm=d.getMonth()+1;
    var dd=d.getDate();
    if(`${dpy}${dpm}${dpd}`!==`${dy}${dm}${dd}`){
      if(this.props.user_id==this.props.item.user_id){
        return(
          <View>
            <View style={styles.day}>
              <Text style={styles.day_txt}>{`${dy}년 ${dm}월 ${dd}일`}</Text>
            </View>
            <View style={styles.container_mine}>
              <View style={{
                ...styles.bubble_mine,
                borderBottomEndRadius:this.props.after.user_id==this.props.item.user_id?4:16,
                borderTopEndRadius:this.props.prev.user_id==this.props.item.user_id?4:16
                }}>
                <Text style={styles.bubble_txt_mine}>{this.props.item.text}</Text>
                <Text style={styles.time_mine}>{this.state.time}</Text>
              </View>
            </View>
          </View>
        )
      }else{
        return(
          <View>
            <View style={styles.day}>
              <Text style={styles.day_txt}>{`${dy}년 ${dm}월 ${dd}일`}</Text>
            </View>
            <View style={styles.container}>
              <TouchableOpacity style={this.props.post_user_id==this.props.item.user_id?styles.profileImg_poster:styles.profileImg} onPress={()=>{
                this.props.navigation.navigate('Book',{
                  item:{
                    user_id:this.props.item.user_id,
                    img:this.props.item.img,
                    id:this.props.item.id
                  }
                });
              }}>
                {
                  this.props.item.img===''?(
                    <Image source={require('../../../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                  ):(
                    <FastImage
                      style={{width:'100%',height:'100%'}}
                      source={{
                        uri: this.props.item.img,
                        priority: FastImage.priority.normal,
                      }}
                    />
                  )
                }
              </TouchableOpacity>
              <View style={{flex:1,flexDirection:'column'}}>
                <Text style={styles.id}>{this.props.item.id}</Text>
                <View style={{flexDirection:'row'}}>
                  <View style={{...styles.bubble,borderBottomStartRadius:this.props.after.user_id==this.props.item.user_id?4:16}}>
                    <Text style={styles.bubble_txt}>{this.props.item.text}</Text>
                    <Text style={styles.time}>{this.state.time}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )
      }
    }
    if(this.props.user_id==this.props.item.user_id){
      return(
        <View style={styles.container_mine}>
          <View style={{
            ...styles.bubble_mine,
            borderBottomEndRadius:this.props.after.user_id==this.props.item.user_id?4:16,
            borderTopEndRadius:this.props.prev.user_id==this.props.item.user_id?4:16
            }}>
            <Text style={styles.bubble_txt_mine}>{this.props.item.text}</Text>
            <Text style={styles.time_mine}>{this.state.time}</Text>
          </View>
        </View>
      )
    }else{
      if(this.props.prev.user_id==this.props.item.user_id){
        return(
          <View style={styles.container}>
            <View style={{...styles.bubble,marginLeft:56,marginTop:0,borderBottomStartRadius:this.props.after.user_id==this.props.item.user_id?4:16}}>
              <Text style={styles.bubble_txt}>{this.props.item.text}</Text>
              <Text style={styles.time}>{this.state.time}</Text>
            </View>
          </View>
        )
      }else{
        return(
          <View style={styles.container}>
            <TouchableOpacity style={this.props.post_user_id==this.props.item.user_id?styles.profileImg_poster:styles.profileImg} onPress={()=>{
              this.props.navigation.navigate('Book',{
                item:{
                  user_id:this.props.item.user_id,
                  img:this.props.item.img,
                  id:this.props.item.id
                }
              });
            }}>
              {
                this.props.item.img===''?(
                  <Image source={require('../../../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                ):(
                  <FastImage
                    style={{width:'100%',height:'100%'}}
                    source={{
                      uri: this.props.item.img,
                      priority: FastImage.priority.normal,
                    }}
                  />
                )
              }
            </TouchableOpacity>
            <View style={{flex:1,flexDirection:'column'}}>
              <Text style={styles.id}>{this.props.item.id}</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{...styles.bubble,borderBottomStartRadius:this.props.after.user_id==this.props.item.user_id?4:16}}>
                  <Text style={styles.bubble_txt}>{this.props.item.text}</Text>
                  <Text style={styles.time}>{this.state.time}</Text>
                </View>
              </View>
            </View>
          </View>
        )
      }
    }

  }
}
const styles = StyleSheet.create({
  container_mine:{
    width,
    marginBottom:4,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  container:{
    width,
    marginBottom:4,
    flexDirection:'row'
  },
  bubble_mine:{
    maxWidth:width*0.7,
    marginRight:8,
    paddingTop:6,
    paddingBottom:4,
    paddingLeft:12,
    justifyContent:'center',
    alignItems:'flex-end',
    backgroundColor:'rgba(220,220,220,0.2)',
    borderRadius:16
  },
  bubble:{
    marginLeft:8,
    paddingTop:6,
    paddingBottom:4,
    paddingLeft:10,
    justifyContent:'center',
    backgroundColor:'#fff',
    borderRadius:16,
    marginTop:4,
    borderTopStartRadius:4,
    borderWidth:0.5,
    borderColor:'rgba(0,0,0,0.1)'
  },
  bubble_txt_mine:{
    fontSize:14,
    color:'rgba(0,0,0,0.8)',
    marginRight:10
  },
  bubble_txt:{
    fontSize:14,
    color:'rgba(0,0,0,0.8)',
    marginRight:10
  },
  time_mine:{
    color:'rgba(0,0,0,0.8)',
    fontSize:10,
    paddingHorizontal:10,
    marginBottom:5,
    marginTop:2
  },
  time:{
    color:'rgba(100,100,100,0.9)',
    fontSize:10,
    paddingRight:8,
    marginBottom:5,
    marginTop:2
  },
  profileImg:{
    width:40,
    height:40,
    backgroundColor:'rgba(200,200,200,0.3)',
    marginLeft:8,
    borderRadius:40,
    overflow:'hidden'
  },
  profileImg_poster:{
    width:40,
    height:40,
    backgroundColor:'rgba(200,200,200,0.3)',
    marginLeft:8,
    borderRadius:40,
    overflow:'hidden',
    borderWidth:1.5,
    borderColor:'rgba(234,29,93,1)'
  },
  id:{
    color:'rgba(0,0,0,0.7)',
    fontSize:12,
    marginLeft:10,
    marginTop:4
  },
  day:{
    alignSelf:'center',
    paddingHorizontal:16,
    backgroundColor:'rgba(0,0,0,0.8)',
    borderRadius:16,
    paddingVertical:4,
    marginVertical:8
  },
  day_txt:{
    color:'#fff',
    fontSize:12
  },
})