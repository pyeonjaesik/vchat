import React,{Component} from 'react';
import {View, StyleSheet,Dimensions,Image,Text} from 'react-native';


const {width}=Dimensions.get("window");
export default function StarRating(props){
  return(
    <View style={{
      ...styles.contaienr,
      width:120*props.item.scale_x,
      height:20*props.item.scale_y
      }}>
      {
        (()=>{
          if(props.item.num<0.5){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star0.png`)}/>
          }else if(props.item.num<1){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star1.png`)}/>
          }else{
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star2.png`)}/>
          }
          
        })()
      }
      {
        (()=>{
          if(props.item.num<1.5){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star0.png`)}/>
          }else if(props.item.num<2){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star1.png`)}/>
          }else{
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star2.png`)}/>
          }
          
        })()
      }
      {
        (()=>{
          if(props.item.num<2.5){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star0.png`)}/>
          }else if(props.item.num<3){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star1.png`)}/>
          }else{
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star2.png`)}/>
          }
          
        })()
      }
      {
        (()=>{
          if(props.item.num<3.5){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star0.png`)}/>
          }else if(props.item.num<4){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star1.png`)}/>
          }else{
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star2.png`)}/>
          }
          
        })()
      }
      {
        (()=>{
          if(props.item.num<4.5){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star0.png`)}/>
          }else if(props.item.num<5){
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star1.png`)}/>
          }else{
            return <Image style={{
              width:20*props.item.scale_x,
              height:20*props.item.scale_x,
              marginHorizontal:2
            }} source={require(`../../assets/star2.png`)}/>
          }
          
        })()
      }
    </View>
  )
}
const styles = StyleSheet.create({
  contaienr:{
    backgroundColor:'rgba(0,0,0,0)',
    flexDirection:'row',
    alignItems:'center'
  },
  star:{
    width: 20,
    height:20,
    marginHorizontal:2
  }
})