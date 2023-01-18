import React from 'react';
import {StyleSheet, Text ,Image,TouchableOpacity,View} from 'react-native';

export default class Header extends React.Component{
  render(){
    let t_index=false;
    return(
      <View style={styles.container} onPress={() => {
        if(t_index==false){
          t_index=true;
          // this.props.navigation.push('Login',{
          // });
        }
        setTimeout(()=>{t_index=false
          console.log('t_index ==> false');
        },500); 
      }}
      rippleColor='rgb(255,255,255)' rippleDuration={300}>
        {/* <Image source={require('../../assets/lock.png')} style={styles.lock}/> */}
        <TouchableOpacity style={styles.login}>
          <Text style={styles.logintxt}>로그인</Text>
        </TouchableOpacity>
        
        
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff'
  },
  login:{
    backgroundColor:'blue',
    height:55,
    paddingHorizontal:10,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'flex-end',
  },
  logintxt:{
    color:'#000',
    fontSize:15,
    lineHeight:20,
    height:20,
  }
});