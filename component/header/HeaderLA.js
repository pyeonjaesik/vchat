import React from 'react';
import {StyleSheet,View, Text ,Image,TouchableOpacity,Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {PermissionsAndroid} from 'react-native';

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
export default class Header extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    console.log(this.props);
    return(
      <View style={styles.container}>
        {/* <TouchableOpacity style={styles.infoCoin}
          onPress={()=>{
            this.props.navigation.navigate('Dart');
          }}
        >
          <Image 
            source={require('../../assets/profile.png')}
            style={{width:16,height:16,marginRight:8}}
          />
          <Text style={styles.infoCoin_txt}>{`${this.props.info.coin} 다트`}</Text>
        </TouchableOpacity>   
        <TouchableOpacity style={{...styles.touchbox,right:0}} onPress={()=>{
          this.props.navigation.navigate('Setting');
        }}>
          <Image source={require('../../assets/3dot.png')} style={{width:35,height:35}}/>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.touchbox,right:45}} onPress={()=>{
          this.props.navigation.navigate('Alarm');
        }}>
          <Image source={require('../../assets/bell.png')} style={{width:60,height:60}}/>
          {
            this.props.alarm_leng>0?(
              <View style={styles.bell_badge}>
                <Text style={styles.bell_badge_txt}>{this.props.alarm_leng>99?99:this.props.alarm_leng}</Text>
              </View>
            ):(null)
          }
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.touchbox,right:90}} onPress={async ()=>{
          console.log('post clicked');
          let pwindex=await AsyncStorage.getItem('pwindex');
          console.log(pwindex);
          if(pwindex==='false'){
            console.log(this.props);
            this.props._dialog();
            return;
          }
          if(Platform.OS!=='ios'){
            let avail=await requestCameraPermission();
            if(avail ===0){
              this.props.navigation.navigate('Post');
            }else if(avail ===1){
              alert('흥!')
            }else{
              alert('헿... 뭐지.. ㅜㅜ')
            }
          }else{
            this.props.navigation.navigate('Post');
          }
          }}>
          <Image source={require('../../assets/pen.png')} style={{width:32,height:32}}/>
        </TouchableOpacity>
        {
          this.props.itr==0?(
            <TouchableOpacity style={{...styles.touchbox,right:130}} onPress={()=>{
                this.props.navigation.navigate('Question')
              }}>
              <Image source={require('../../assets/question.png')} style={{width:20,height:20}}/>
            </TouchableOpacity>
          ):(null)
        } */}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  },
  infoCoin:{
    paddingHorizontal:15,
    paddingVertical:5,
    backgroundColor:'rgba(255,255,255,0.1)',
    borderRadius:14,
    marginLeft:15,
    flexDirection:'row',
    alignItems:'center'
  },
  infoCoin_txt:{
    fontSize:15,
    color:'rgba(255,255,255,0.9)',
    fontWeight:'500'
  },
  touchbox:{
    position:'absolute',
    top:2.5,
    width:45,
    height:50,
      // backgroundColor:'rgba(1,65,22,0.2)',
    justifyContent:'center',
    alignItems:'center'
  },
  bell_badge:{
    position:'absolute',
    top:5,
    right:5,
    width:17,
    height:17,
    borderRadius:20,
    backgroundColor:'#db0011',
    justifyContent:'center',
    alignItems:'center'
  },
  bell_badge_txt:{
    fontSize:9,
    color:'#fff',
    fontWeight:'600'
  }
});