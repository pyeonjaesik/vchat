import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions,Animated,TextInput,FlatList,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback} from 'react-native';
import {URL} from '../config';
import RipplePerson from './Tab/list/RipplePerson';

const {width,height}=Dimensions.get("window");
const AnimatedFlatList= Animated.createAnimatedComponent(FlatList);
const { State: TextInputState } = TextInput;

export default class KeyboardView extends Component{
  constructor(props){
    super(props);
    this.state={
      post:[],
      number:0,
      scrollEnabled:true
    }
    this.backInt=this.props.backInt;
    this._getfetch=this._getfetch.bind(this);
  }
  hideIndex=false;
  _getfetch(){
    let data={
      post_id:this.props.post_id,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getreadprofile`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        this.setState({
          post:responseJson.user_arr,
          number:responseJson.number
        })
      }else{

      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async componentWillReceiveProps(nextProps) {
    console.log(nextProps.backInt)
    if(this.backInt!=nextProps.backInt){
      this.hideIndex=false;
      await this.refs._rippleView._component.scrollTo({y: 0});
      setTimeout((()=>{
        this.props._ripple(false,'');
      }).bind(this),300);
    }
  }
  scroll=0;
  render(){
    return(
      <KeyboardAvoidingView style={styles.container}>
        <View style={{backgroundColor:'#fff',width,minHeight:48}}>
          <TextInput 
            style={{...styles.main_input}}
            placeholder='내용을 입력해 주세요.'
            multiline={true}
            autoFocus={true}
            ref='mainInput'
            onChangeText={(text)=>{
              this.setState({text});
            }}
            value={this.state.text}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }

}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'rgba(0,0,0,0.2)',
    justifyContent:'flex-end'
  },
  main_input:{
    paddingHorizontal:30,
    fontSize:14,
    minHeight:48,
    maxHeight:96,
    width:width,
    color:'rgba(0,0,0,0.8)',
    backgroundColor:'#fff',
    position:'absolute',
    left:0,
    bottom:0,
    width,
    minHeight:48,
    backgroundColor:'green'
  },
});