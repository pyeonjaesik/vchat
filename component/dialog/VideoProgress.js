import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions} from 'react-native';
import {URL,STATUSBAR_HEIGHT} from '../../config';
import LottieView from 'lottie-react-native';

const {width}=Dimensions.get("window");
export default class VideoProgress extends Component{
  constructor(props){
    super(props);

  }
  render(){
    return(
      <View 
       style={styles.container}
      >
        {(()=>{
          if(this.props.progress>0&&this.props.progress<=1){
            return (
              <View>
                <View style={{justifyContent:'center',alignItems:'center',width:72,height:72}}>
                  <LottieView source={require('../../assets/animation/loading_white.json')} 
                    autoPlay loop style={{width:72,height:72,position:'absolute'}} resizeMode="cover"/>
                  <Text style={styles.main_txt}>{parseInt((1-this.props.progress)*10)}</Text>
                </View>
                <Text style={{fontSize:8,alignSelf:'center',position:'absolute',bottom:-4,color:'rgba(255,255,255,0.7)'}}>영상 압축중</Text>
              </View>
            )
          }else if(this.props.progress==2){
            return (
              <View>
                <View style={{justifyContent:'center',alignItems:'center',width:72,height:72}}>
                  <LottieView source={require('../../assets/animation/loading_white.json')} 
                    autoPlay loop style={{width:72,height:72,position:'absolute'}} resizeMode="cover"/>
                </View>
                <Text style={{fontSize:8,alignSelf:'center',position:'absolute',bottom:-4,color:'rgba(255,255,255,0.7)'}}>서버 업로드</Text>
              </View>
            )
          }
        })()}
      </View>
    )
  }

}
const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:56+STATUSBAR_HEIGHT,
    left:16,
    width:64,
    height:88,
    backgroundColor:'rgba(0,0,0,0.7)',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:3
  },
  main_txt:{
    fontSize:13,
    color:"#fff",
    fontWeight:'bold'
  },
  sub_txt:{
    fontSize:12,
    color:"rgba(255,255,255,0.8)"
  }
});