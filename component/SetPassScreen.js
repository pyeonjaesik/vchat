import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text, Dimensions,StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {URL,STATUSBAR_HEIGHT} from '../config';
import { connect } from 'react-redux';
import * as actions from '../actions';

const {width}=Dimensions.get("window");
class SetPassScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      subject_v:`비밀번호를 입력해주세요.`,
      passCodeLength:0,
      status:0
    }
    this._typeNumber=this._typeNumber.bind(this);
    this._backSpace=this._backSpace.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  passCode='';
  result_passCode='';

  async _typeNumber(n){
    if(this.passCode.length<6){
      this.passCode+=n;
      await this.setState({
        passCodeLength:this.passCode.length
      });
      if(this.passCode.length==6){
        console.log(this.state.status);
        if(this.state.status==0){
          this.result_passCode=this.passCode;
          setTimeout(function(){
            if(this.passCode.length==6){
              this.setState({
                passCodeLength:0,
                subject_v:`확인을 위해 한번 더 입력해 주세요.`,
                status:1
              });
              this.passCode='';
            }
          }.bind(this),100);
        }else{
          if(this.result_passCode===this.passCode){
            if(this.props.navigation.getParam('from','')==='Login'){
              this.props.navigation.replace('Parent');
            }else if(this.props.navigation.getParam('from','')==='Setting'){
              this.props.navigation.goBack();
            }else{
              this.props.navigation.replace('Parent');
            }
            if(this.props.user_id[0]=='k'){
              var seturl=`/setpwkakao`;
            }else if(this.props.user_id[0]=='n'){
              var seturl=`/setpwnaver`
            }else if(this.props.user_id[0]=='a'){
              var seturl=`/setpwapple`
            }else{
              alert(`오류발생\n 오류코드: SetNameScreen 157`);
              return;
            }
            let data={
              token:this.props.navigation.getParam('token',''),
              pw:this.result_passCode
            };
            const obj = {
              body: JSON.stringify(data),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              method: 'POST'
            }
            fetch(`${URL}${seturl}`, obj)
            .then((response) => response.json())
            .then((responseJson) => {
              if(responseJson.status===100){
                console.log('infoPass Success');
               AsyncStorage.setItem('pwindex', 'true');
               this.props.setpwindex('true');
              }else{
                console.log('infoPass failed');
              }
            })
            .catch((error) => {
              console.error(error);
            });
          }else{
            this.passCode='';
            this.result_passCode='';
            this.setState({
              passCodeLength:0,
              subject_v:'비밀번호가 일치하지 않습니다.\n처음부터 다시 시도해주세요.',
              status:0
            })
          }
        }

      }
    }

    console.log(this.passCode+'length:'+this.passCode.length);
  }
  _backSpace(){
    this.passCode=this.passCode.slice(0,-1);
    this.setState({
      passCodeLength:this.passCode.length
    })
    console.log(this.passCode+'length:'+this.passCode.length);
  }

  render(){
    return(
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        {
          this.props.navigation.getParam('from','')==='Login'?(
            <View style={{height:55}}/>
          ):(
            <TouchableOpacity style={styles.leftbtn}
            onPress={() => {this.props.navigation.goBack()}}
            >
              <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
            </TouchableOpacity>
          )
        }
        <Text style={styles.subject}>암호</Text>
        <Text style={styles.subject_v}>{this.state.subject_v}</Text>
        <View style={styles.passcodeContainer}>
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
        </View>
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
    marginTop:STATUSBAR_HEIGHT,
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
    marginTop:'16%'
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
});
const mapStateToProps = (state) =>{
  return{
    user_id:state.setinfo.user_id,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
      setpwindex: (pwindex)=>{
        dispatch(actions.setpwindex(pwindex));
      },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(SetPassScreen);