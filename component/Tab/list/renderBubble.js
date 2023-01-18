import React,{Component} from 'react';
import { StyleSheet,Dimensions,Text,View,Platform,TouchableOpacity} from 'react-native';
import { Bubble } from 'react-native-gifted-chat'
import {PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import FastImage from 'react-native-fast-image'
import Swiper from 'react-native-swiper';

const {width}=Dimensions.get("window");

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return 0;
    } else {
      return 1;
    }
  } catch (err) {
    return 2;
  }
}
export var renderTime=(props)=>{
  var d = new Date(parseInt(props.currentMessage.createdAt));
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
  var time=h;
  return (
    <Text 
      style={
        props.currentMessage.user._id==1?{
          color:'rgba(0,0,0,0.8)',
          fontSize:10,
          paddingHorizontal:10,
          marginBottom:5
        }:{
          color:'rgba(100,100,100,0.9)',
          fontSize:10,
          paddingLeft:7,
          paddingRight:10,
          marginBottom:5
        }
        }>
    {time}
    </Text>
  );
}
export default function renderBubble(props,user_id,_mscp){
  if(props.currentMessage.type==1){
    if(props.currentMessage.user_id==user_id){
      return(
        <View style={{width:width*0.8,marginVertical:4}}>
          <View style={{width:'95%',height:48,backgroundColor:'#7d3f98',justifyContent:'center',alignItems:'center',borderRadius:24,overflow:'hidden',alignSelf:'center'}}>
          <Text style={{color:'#f0f0f0',fontSize:16,fontWeight:'bold'}}>영상요청</Text>
          </View>
          <View style={{marginTop:10,backgroundColor:'rgba(100,100,100,0.1)',borderRadius:20}}>
            {
                props.currentMessage.friendname==''?(
                  null
                ):(
                  <Text style={{padding:15,color:'rgba(0,0,0,0.9)',fontSize:16,fontWeight:'bold'}}>{`${props.currentMessage.myname}(이)가 ${props.currentMessage.friendname}에게`}</Text>
                )
              }
              <Text style={{paddingHorizontal:15,paddingBottom:10,color:'rgba(0,0,0,0.9)',fontSize:16}}>{props.currentMessage.text}</Text>
              <View style={{alignItems:'flex-end',paddingBottom:8,paddingRight:10}}>
              {
                renderTime({currentMessage:{
                  createdAt:props.currentMessage.createdAt,
                  user:{_id:props.currentMessage.user._id}
                }})
              }
            </View>
          </View>
        </View>
      )
    }else{
      return(
        <View style={{width:width*0.8,backgroundColor:'#fff',marginVertical:10}}>
          <View style={{width:'90%',height:24,justifyContent:'center',borderRadius:24,overflow:'hidden',alignSelf:'center'}}>
          <Text style={{color:'#333',fontSize:16,fontWeight:'bold'}}>영상요청</Text>
          </View>
          <View style={{borderRadius:20,borderWidth:0.5,borderColor:'rgb(200,200,200)',marginTop:10,marginBottom:10}}>
            {
                props.currentMessage.friendname==''?(
                  null
                ):(
                  <Text style={{padding:15,color:'rgba(0,0,0,0.9)',fontSize:16,fontWeight:'bold'}}>{`${props.currentMessage.myname}(이)가 ${props.currentMessage.friendname}에게`}</Text>
                )
              }
              <Text style={{paddingHorizontal:15,paddingBottom:10,color:'rgba(0,0,0,0.9)',fontSize:16}}>{props.currentMessage.text}</Text>
              <View style={{alignItems:'flex-start',paddingLeft:10,marginBottom:10}}>
                {
                  renderTime({currentMessage:{
                    createdAt:props.currentMessage.createdAt,
                    user:{_id:props.currentMessage.user._id}
                  }})
                }
              </View>
          </View>

            <View style={{width:'100%',height:48,flexDirection:'row',justifyContent:'space-around'}}>
              {/* <TouchableOpacity style={{paddingHorizontal:10,height:40,backgroundColor:'#fff',borderRadius:20,justifyContent:'center',alignItems:'center',borderWidth:2,flex:0.2,borderColor:'#999'}}>
                <Text style={{color:'#999',fontSize:15,fontWeight:'bold'}}>거절</Text>
              </TouchableOpacity> */}
              <TouchableOpacity style={{flex:1,height:48,backgroundColor:'#fff',borderRadius:10,justifyContent:'center',alignItems:'center',backgroundColor:'#ea1d5d'}} onPress={async ()=>{
                if(Platform.OS === 'ios'){
                  ImagePicker.openPicker({
                    mediaType: "video",
                  }).then((video) => {
                    _mscp({
                      post_id:props.currentMessage.post_id,
                      user_id:props.currentMessage.user_id,
                      video
                    });
                  });
                }else{
                  let avail=await requestCameraPermission();
                  if(avail ===0){
                    ImagePicker.openPicker({
                      mediaType: "video",
                    }).then((video) => {
                      _mscp({
                        post_id:props.currentMessage.post_id,
                        user_id:props.currentMessage.user_id,
                        video
                      });
                    });
                  }else if(avail ===1){
                    alert('흥!')
                  }else{
                    alert('헿... 뭐지.. ㅜㅜ')
                  }
                }
              }}>
                <Text style={{color:'#fff',fontSize:16,fontWeight:'bold'}}>영상 보내기</Text>
              </TouchableOpacity>
            </View>
        </View>
      )
    }
  }
  if(props.currentMessage.type==10){
    if(props.currentMessage.user_id==user_id){
      return(
        <View style={{width:width*0.8,marginVertical:4}}>
          <View style={{width:'95%',height:48,backgroundColor:'#7d3f98',justifyContent:'center',alignItems:'center',borderRadius:24,overflow:'hidden',alignSelf:'center'}}>
          <Text style={{color:'#f0f0f0',fontSize:16,fontWeight:'bold'}}>영상요청 완료</Text>
          </View>
          <View style={{marginTop:10,backgroundColor:'rgba(100,100,100,0.1)',borderRadius:20}}>
            {
                props.currentMessage.friendname==''?(
                  null
                ):(
                  <Text style={{padding:15,color:'rgba(0,0,0,0.9)',fontSize:16,fontWeight:'bold'}}>{`${props.currentMessage.myname}(이)가 ${props.currentMessage.friendname}에게`}</Text>
                )
              }
              <Text style={{paddingHorizontal:15,paddingBottom:10,color:'rgba(0,0,0,0.9)',fontSize:16}}>{props.currentMessage.text}</Text>
              <View style={{alignItems:'flex-end',paddingBottom:8,paddingRight:10}}>
              {
                renderTime({currentMessage:{
                  createdAt:props.currentMessage.createdAt,
                  user:{_id:props.currentMessage.user._id}
                }})
              }
            </View>
          </View>
        </View>
      )
    }else{
      return(
        <View style={{width:width*0.8,backgroundColor:'#fff',borderRadius:20,overflow:'hidden',marginVertical:10}}>
          <View style={{width:'90%',height:24,justifyContent:'center',borderRadius:24,overflow:'hidden',alignSelf:'center'}}>
          <Text style={{color:'#333',fontSize:16,fontWeight:'bold'}}>영상요청</Text>
          </View>
          <View style={{borderRadius:20,borderWidth:0.5,borderColor:'rgba(200,200,200,0.5)',marginTop:10,marginBottom:10}}>
            {
                props.currentMessage.friendname==''?(
                  null
                ):(
                  <Text style={{padding:15,color:'rgba(0,0,0,0.9)',fontSize:16,fontWeight:'bold'}}>{`${props.currentMessage.myname}(이)가 ${props.currentMessage.friendname}에게`}</Text>
                )
              }
              <Text style={{paddingHorizontal:15,paddingBottom:10,color:'rgba(0,0,0,0.9)',fontSize:16}}>{props.currentMessage.text}</Text>
              <View style={{alignItems:'flex-start',paddingLeft:10,marginBottom:10}}>
                {
                  renderTime({currentMessage:{
                    createdAt:props.currentMessage.createdAt,
                    user:{_id:props.currentMessage.user._id}
                  }})
                }
              </View>
          </View>
        </View>
      )
    }
  }
  if(props.currentMessage.type==2){
    if(props.currentMessage.user_id==user_id){
      return(
        <View style={{width:width*0.8,overflow:'hidden',marginVertical:4}}>
          <View style={{width:'95%',height:48,backgroundColor:'#333',marginVertical:10,borderRadius:24,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',fontSize:15,fontWeight:'bold'}}>영상을 전송하였습니다.</Text>
          </View> 
          <View>
            <FastImage
              style={{width:width*0.8,height:width*0.8,marginRight:-10,marginBottom:10,borderRadius:20}}
              source={{
                  uri: props.currentMessage.clip[0].uri,
                  priority: FastImage.priority.normal,
              }}
            />
          </View>
          <View style={{alignItems:'flex-end',paddingBottom:8,paddingRight:10}}>
            {
              renderTime({currentMessage:{
                createdAt:props.currentMessage.createdAt,
                user:{_id:props.currentMessage.user._id}
              }})
            }
          </View>
        </View>
      )
    }else{
      return(
        <View style={{width:width*0.8,overflow:'hidden',marginVertical:4}}>
          <View style={{width:'95%',height:48,backgroundColor:'#333',marginVertical:10,borderRadius:24,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',fontSize:15,fontWeight:'bold'}}>영상이 도착하였습니다.</Text>
          </View> 
          <View>
            <FastImage
              style={{width:width*0.8,height:width*0.8,marginRight:-10,marginBottom:10,borderRadius:20}}
              source={{
                  uri: 'https://puppytest.s3.ap-northeast-2.amazonaws.com/1579430996955',
                  priority: FastImage.priority.normal,
              }}
            />
          </View>
          <View style={{alignItems:'flex-start',paddingLeft:10}}>
            {
              renderTime({currentMessage:{
                createdAt:props.currentMessage.createdAt,
                user:{_id:props.currentMessage.user._id}
              }})
            }
          </View>
        </View>
      )
    }

  }
  return (
    <View>
      <Bubble
        {...props}
        textStyle={{
          left:{
            color:'#111'
          },
          right:{
            color:'#111'
          }
        }}
        linkStyle={{
          left:{
            color:'#007cc0',
          },
          right:{
            color:'#007cc0',
          }
        }}
        onLayout={()=>{
          alert('a')
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff',
            marginLeft:0,
            borderWidth:0.5,
            borderColor:'rgba(200,200,200,0.5)',
            overflow:'hidden'
          },
          right: {
            backgroundColor: 'rgba(240,240,240,0.5)',
            borderColor:'#999',
            overflow:'hidden'
          }
        }}
      >

      </Bubble>
      {
        props.currentMessage.read==false?(
          <View style={{position:'absolute',alignSelf:'flex-end',height:12,marginVertical:6,left:0,bottom:0,width:width*0.13,alignItems:'flex-end'}}>
            <Text style={{color:'#999',fontSize:12}}>안읽음</Text>
          </View>
        ):(null)
      }

    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    width:width-30,
    height:(width-30),
  },
  info:{
    position:'absolute',
    top:10,
    right:10,
    height:23,
    fontSize:15,
    backgroundColor:'rgba(0,0,0,0.5)',
    color:'#ffffff',
    lineHeight:23,
    textAlign:'center',
    paddingHorizontal:12,
    borderRadius:23,
  },
  swiper:{
    width:width-30,
    height:width-30,
    overflow:'hidden',
  },
  paginationStyle:{
    position:'absolute',
    top:10,
    right:10,
    backgroundColor:'rgba(0,0,0,0.4)',
    height:23,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:23
  }
})