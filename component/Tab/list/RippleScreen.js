import React,{Component} from 'react';
import {View, StyleSheet,Dimensions,Image,Text,TouchableOpacity,Scro} from 'react-native';
import FastImage from 'react-native-fast-image'
import Ripple from 'react-native-material-ripple';


const {width}=Dimensions.get("window");
export default function RippleScreen(){
  return(
    <View style={{width:100,height:100,backgroundColor:'blue'}}>

    </View>
  )
}
// export default class RippleScreen extends Component{
//   constructor(props){
//     super(props);
//   }
//   render(){
//     return(
//       <View style={{width:300,height:300,backgroundColor:'blue',margniTop:100}}>
//         {/* <TouchableOpacity style={{height:this.props.height*0.3,backgroundColor:'red'}}
//           onPress={()=>{
//             alert(JSON.stringify(this.state.rippleY));
//             return;
//             this.refs._rippleView._component.scrollTo({y:this.props.height});
//           }}
//         />
//         <Animated.ScrollView 
//           style={{height:this.props.height*0.7,backgroundColor:'rgba(0,0,123,0.3)'}}
//           pagingEnabled={true} 
//           nestedScrollEnabled={true}
//           showsVerticalScrollIndicator={false}
//           bounces={false}
//           scrollEventThrottle={16}
//           ref='_rippleView'
//           onScroll={Animated.event(
//             [
//               {
//                 nativeEvent: {contentOffset: {y: this.state.rippleY}}
//               }
//             ]
//           )}
//         > 
//           <View style={{height:this.props.height*0.7,backgroundColor:'green'}}>
//           </View>
//           <View style={{height:this.props.height*0.7,backgroundColor:'blue'}}>
//             <ScrollView style={{height:this.props.height*0.7,backgroundColor:'orange'}}
//             bounces={true}
//             >
//               <View style={{height:100,backgroundColor:'blue',marginBottom:100}}>
//               </View>
//               <View style={{height:100,backgroundColor:'blue',marginBottom:100}}>
//               </View>
//               <View style={{height:100,backgroundColor:'blue',marginBottom:100}}>
//               </View>
//               <View style={{height:100,backgroundColor:'blue',marginBottom:100}}>
//               </View>
//               <View style={{height:100,backgroundColor:'blue',marginBottom:100}}>
//               </View>
//             </ScrollView>
//           </View>
//         </Animated.ScrollView> */}
//       </View>
//     )
//   }
// }
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