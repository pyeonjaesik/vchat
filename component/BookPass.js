import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text, Dimensions, Animated, Easing} from 'react-native';
import {URL} from '../config';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const {width}=Dimensions.get("window");
export default class PostPass extends Component{
  constructor(props){
    super(props);
    this.state={
      subject_v:`비밀번호를 입력해주세요.`,
      passCodeLength:0,
      passMargin:new Animated.Value(0),

    }
    this._typeNumber=this._typeNumber.bind(this);
    this._backSpace=this._backSpace.bind(this);
    this._spring=this._spring.bind(this);

  }
  passCode='';
  async _typeNumber(n){
    if(this.passCode.length<6){
      this.passCode+=n;
      await this.setState({
        passCodeLength:this.passCode.length
      });
      if(this.passCode.length==6){
        let resultCode=this.passCode;
        this.props.setPW(resultCode);
        let data={
          _id:this.props._id,
          pw:resultCode
        };
        const obj = {
          body: JSON.stringify(data),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST'
        }
        fetch(`${URL}/verifypw`, obj)
        .then((response) => response.json())
        .then(async (responseJson) => {
          if(responseJson.status===100){
            this.props.success();            
          }else if(responseJson.status===200){
            this._spring(this.state.passMargin)
            await this.setState({
              subject_v:'비밀번호가 일치하지 않습니다.\n다시 입력해 주세요.',
              passCodeLength:0
            });
            this.passCode='';
          }else if(responseJson.status===600){
            await this.setState({
              subject_v:'잘못된 비밀번호를 \n지속적으로 입력하셨습니다.\n5분 후 다시 시도해주세요.',
              passCodeLength:0
            });
            this.passCode='';
          }else{
            alert('알 수 없는 오류 발생');
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }
  }
  _backSpace(){
    this.passCode=this.passCode.slice(0,-1);
    this.setState({
      passCodeLength:this.passCode.length
    })
  }
  _spring(object){
    Animated.sequence([
      Animated.timing(object, {
        toValue: 20,
        duration: 50,
        easing: Easing.linear,
      }),
      Animated.timing(object, {
        toValue: -20,
        duration: 50,
        easing: Easing.linear,
      }),
      Animated.timing(object, {
        toValue: 20,
        duration: 50,
        easing: Easing.linear,
      }),
      Animated.timing(object, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
      })
    ]).start();
  }
  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.subject}>암호</Text>
        <Text style={styles.subject_v}>{this.state.subject_v}</Text>
        <Animated.View style={{
          ...styles.passcodeContainer,
          left:this.state.passMargin
          }}>
          {
            this.state.passCodeLength>0 ?(
              <View style={styles.inputStyle2}>
                <View style={styles.dot}/>
              </View>
            ):(
              <View style={styles.inputStyle}></View>
            )
          }
          {
            this.state.passCodeLength>1 ?(
              <View style={styles.inputStyle2}>
                <View style={styles.dot}/>
              </View>
            ):(
              <View style={styles.inputStyle}></View>
            )
          }
          {
            this.state.passCodeLength>2 ?(
              <View style={styles.inputStyle2}>
                <View style={styles.dot}/>
              </View>
            ):(
              <View style={styles.inputStyle}></View>
            )
          }
          {
            this.state.passCodeLength>3 ?(
              <View style={styles.inputStyle2}>
                <View style={styles.dot}/>
              </View>
            ):(
              <View style={styles.inputStyle}></View>
            )
          }
          {
            this.state.passCodeLength>4 ?(
              <View style={styles.inputStyle2}>
                <View style={styles.dot}/>
              </View>
            ):(
              <View style={styles.inputStyle}></View>
            )
          }
          {
            this.state.passCodeLength>5 ?(
              <View style={styles.inputStyle2}>
                <View style={styles.dot}/>
              </View>
            ):(
              <View style={styles.inputStyle}></View>
            )
          }
        </Animated.View>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={{...styles.inputNumber,...{top:0,left:0}}} onPress={()=>{this._typeNumber('1')}}>
            <Text style={styles.inputNumber_txt}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:0,left:width/3}}} onPress={()=>{this._typeNumber('2')}}>
            <Text style={styles.inputNumber_txt}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:0,left:2*width/3}}} onPress={()=>{this._typeNumber('3')}}>
            <Text style={styles.inputNumber_txt}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:'25%',left:0}}} onPress={()=>{this._typeNumber('4')}}>
            <Text style={styles.inputNumber_txt}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:'25%',left:width/3}}} onPress={()=>{this._typeNumber('5')}}>
            <Text style={styles.inputNumber_txt}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:'25%',left:2*width/3}}} onPress={()=>{this._typeNumber('6')}}>
            <Text style={styles.inputNumber_txt}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:'50%',left:0}}} onPress={()=>{this._typeNumber('7')}}>
            <Text style={styles.inputNumber_txt}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:'50%',left:width/3}}} onPress={()=>{this._typeNumber('8')}}>
            <Text style={styles.inputNumber_txt}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:'50%',left:2*width/3}}} onPress={()=>{this._typeNumber('9')}}>
            <Text style={styles.inputNumber_txt}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:'75%',left:width/3}}} onPress={()=>{this._typeNumber('0')}}>
            <Text style={styles.inputNumber_txt}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.inputNumber,...{top:'75%',left:2*width/3}}} onPress={this._backSpace}>
            <Image source={require('../assets/backspace.png')} style={{width:38,height:38}} />
          </TouchableOpacity>
        </View>
      </View>
    )
    
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  leftbtn:{
    marginTop:0,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  subject:{
    fontSize:21,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    textAlign:'center',
    marginTop:'9%'
  },
  subject_v:{
    fontSize:17,
    color:'rgba(100,100,100,0.7)',
    textAlign:'center',
    marginTop:'4%'
  },
  passcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop:'16%',
    // backgroundColor:'blue'
  },
  inputStyle: {
    height: width/11,
    width: width/11,
    borderBottomWidth:3,
    borderColor:'rgba(22,23,27,0.5)',
  },
  inputStyle2: {
    height: width/11,
    width: width/11,
    justifyContent:'center',
    alignItems:'center'
  },
  inputContainer:{
    position:'absolute',
    width:'100%',
    height:'50%',
    bottom:0,
    left:0,
    backgroundColor:'white'
  },
  inputNumber:{
    position:'absolute',
    width:width/3,
    height:'25%',
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center'
  },
  inputNumber_txt:{
    fontSize:25,
    color:'rgb(22,23,27)'
  },
  dot:{
    width: width/18,
    height: width/18,
    backgroundColor:'#000000',
    borderRadius:50
  },
  number_img:{
    width: width/14,
    height: width/14
  }
})