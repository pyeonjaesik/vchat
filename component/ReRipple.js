import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions,Animated,TextInput,FlatList,KeyboardAvoidingView,Keyboard} from 'react-native';

const {width}=Dimensions.get("window");
const AnimatedFlatList= Animated.createAnimatedComponent(FlatList);

export default class Ripple extends Component{
  constructor(props){
    super(props);
    this.state={
      heightIndex: this.props.height*0.7-30,
      re_ripple:false
    }
    this._keyboardDidHide=this._keyboardDidHide.bind(this)
  }
  hideIndex=false;
  
  componentDidMount(){
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide,
    );
  }
  _keyboardDidShow(){
    console.log('show')
  }
  _keyboardDidHide(){
    this.setState({
      re_ripple:false
    })
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <TouchableOpacity style={{flex:1,backgroundColor:'rgba(0,0,100,0.3)'}} onPress={()=>{
          Keyboard.dismiss()
        }}/>
        <TextInput
          style={{...styles.main_input}}
          placeholder='댓글을 입력해 주세요.'
          autoFocus={true}
          ref='mainInput'
          autofocus={true}
          onBlur={()=>{
            alert('a')
          }}
          multiline={true}
          onChangeText={(instagram)=>{
            // this.setState({
            //   instagram,
            //   instagramColor:'rgba(200,200,200,0.3)',
            //   instagramLoading:0
            // })
          }}
          // value={this.state.instagram}
        />
      </KeyboardAvoidingView>
    )
  }

}
const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:0,
    left:0,
    bottom:0,
    right:0,
    backgroundColor:'rgba(0,0,0,0.3)'
  },
  main_input:{
    position:'absolute',
    bottom:0,
    left:0,
    backgroundColor:'blue',
    paddingHorizontal:30,
    paddingBottom:4,
    fontSize:17,
    minHeight:56,
    maxHeight:200,
    width:width,
    color:'rgba(0,0,0,0.8)'
  },
});