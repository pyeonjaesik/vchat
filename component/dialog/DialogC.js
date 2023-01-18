import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions} from 'react-native';
const {width}=Dimensions.get("window");
export default class DialogC extends Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <TouchableOpacity 
       style={styles.container}
       activeOpacity={1}
      >
        <TouchableOpacity style={styles.space} onPress={this.props._cancel}/>
        <View style={styles.main}>
          <Text style={styles.subject}>{this.props.subject}</Text>
          <Text style={styles.main_txt}>{this.props.main}</Text>
          
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.btn2} onPress={this.props._btnL}>
              <Text style={styles.btn2_txt}>{this.props.btnL_txt}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn1} onPress={this.props._btnR}>
              <Text style={styles.btn1_txt}>{this.props.btnR_txt}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.space} onPress={this.props._cancel}/>
      </TouchableOpacity>
    )
  }

}
const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:0,
    left:0,
    width:'100%',
    height:'100%',
    backgroundColor:'rgba(40,40,40,0.3)',
    justifyContent:'center',
    alignItems:'center'
  },
  main:{
    width:'85%',
    backgroundColor:'white',
    borderRadius:35,
    alignItems:'center',
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84, 
    // elevation: 5,
  },
  subject:{
    fontSize:25,
    color:'#000000',
    marginTop:10,
    fontWeight:'500'
  },
  main_txt:{
    width:'100%',
    fontSize:17,
    color:'rgba(22,23,27,0.9)',
    textAlign:'center',
    marginTop:20,
    paddingHorizontal:30,
    lineHeight:22
  },
  bottom:{
    flexDirection:'row',
    width:'100%',
    height:70,
    marginTop:15,
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  btn1:{
    width:100,
    height:50,
    justifyContent:'center',
    alignItems:'center',

  },
  btn1_txt:{
    color:'#000000',
    fontSize:18,
  },
  btn2:{
    width:140,
    height:50,
    justifyContent:'center',
    alignItems:'center',
  },
  btn2_txt:{
    color:'#000000',
    fontSize:16
  },
  space:{
    flex:1,
    width:'100%',
  }
});