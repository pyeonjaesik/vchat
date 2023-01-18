import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text, TextInput,KeyboardAvoidingView,Platform,StatusBar} from 'react-native';
import {URL,STATUSBAR_HEIGHT} from '../config';

import { connect } from 'react-redux';
import * as actions from '../actions';
import AsyncStorage from '@react-native-community/async-storage';

class SetUidScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      btn_status:false,
      nickname:'',
      nickname_info:`아이디를 입력해 주세요.`,
      nickname_info_style:{},
    }
    this._finishName=this._finishName.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  checkindex=true;
  finalnickname='';

  checkname(){
    if(this.state.nickname.length<13 && this.state.nickname.length>=2){
      var txt_check = /^[a-z|A-Z|0-9|\*]+$/
      if(txt_check.test(this.state.nickname)){
        let data={
          id:this.state.nickname
        };
        const obj = {
          body: JSON.stringify(data),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST'
        }
        fetch(`${URL}/cert`, obj)
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status==1){
            this.setState({
              nickname_info:`사용 가능한 아이디 입니다.`,
              nickname_info_style:{color:'green'},
              btn_status:true
            })
          }else if(responseJson.status==2){
            this.setState({
              nickname_info:`이미 사용중인 아이디 입니다.`,
              nickname_info_style:{color:'red'}
            });
          }else{
            this.setState({
              nickname_info:`제대로 입력해 주세요.`,
              nickname_info_style:{color:'red'}
            });
          }      
          setTimeout(function(){
            if(this.checkindex===true){
              this.checkname();
            }
          }.bind(this),600);
        })
        .catch((error) => {
          console.error(error);
          setTimeout(function(){
            if(this.checkindex===true){
              this.checkname();
            }
          }.bind(this),600);
        });
      }else{
        console.log('11111111');
        setTimeout(function(){
          if(this.checkindex===true){
            this.checkname();
          }
        }.bind(this),600);
      }
    }else{
      setTimeout(function(){
        if(this.checkindex===true){
          this.checkname();
        }
      }.bind(this),600);
    }
  }
  async componentDidMount(){
    this.checkname();
  }

  _handleChange(nickname){
    if(nickname.length==0){
      this.setState({
        nickname:nickname,
        btn_status:false,
        nickname_info:'아이디를 입력해 주세요.',
        nickname_info_style:{color:'rgba(100,100,100,0.8)'}
      })
    }else if(nickname.length<2){
      this.setState({
        nickname:nickname,
        btn_status:false,
        nickname_info:`아이디가 너무 짧아요.`,
        nickname_info_style:{color:'rgba(100,100,100,0.8)'}
      });
      
    }else if(nickname.length<13){
      var txt_check = /^[a-z|A-Z|0-9|\*]+$/
      if(txt_check.test(nickname)){
        this.setState({
          nickname:nickname,
          btn_status:false,
          nickname_info:``
        })
      }else{
        this.setState({
          nickname:nickname,
          btn_status:false,
          nickname_info:`영문, 숫자만 가능합니다.`,
          nickname_info_style:{color:'red'}
        })
      }
    }else{
      this.setState({
        nickname:nickname,
        btn_status:false,
        nickname_info:`아이디가 너무 길어요.`,
        nickname_info_style:{color:'red'}
      });
    }
  }

  async _finishName(){
    this.checkindex=false;
    this.finalnickname=this.state.nickname;
    let data={
      _id:this.props._id,
      uid:this.finalnickname
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/setuid`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status===100){
        AsyncStorage.setItem('uid', this.finalnickname);
        this.props.setuid(this.finalnickname);
        this.props.navigation.replace('SetPhone',{
          token:this.props.navigation.getParam('token'),
          type:this.props.navigation.getParam('type'),
          from:this.props.navigation.getParam('from','Login')
        });
      }else{
        this.setState({
          btn_status:false,
          nickname:'',
          nickname_info:`앗! 고세 다른 사람이 이 아이디 사용하네요...
          다른 아이디를 입력해 주세요.`,
          nickname_info_style:{},
        });
        this.checkindex=true;
        this.checkname();
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <Text style={styles.subject}>아이디를 입력해주세요.</Text>
        <TextInput
          style={styles.txtinput}
          placeholder="아이디"
          autoFocus={true}
          clearButtonMode='always'
          onChangeText={(nickname) => this._handleChange(nickname)}
        />
        <Text style={{...styles.nickname_info, ...this.state.nickname_info_style}}>{this.state.nickname_info}</Text>
        {
          this.state.btn_status===false ? (
            <Text style={styles.readybutton}>다음</Text>
          ):(
            <TouchableOpacity style={styles.nextbutton} onPress={this._finishName} >
              <Text style={styles.nextbutton_txt}>다음</Text>
            </TouchableOpacity>
          )
        }
      </KeyboardAvoidingView>
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
    marginTop:STATUSBAR_HEIGHT+56,
    fontSize:21,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    paddingLeft:40
  },
  txtinput:{
    marginTop:30,
    width:'80%',
    height:50,
    borderRadius:5,
    borderWidth:1,
    borderColor:'rgba(100,100,100,0.3)',
    backgroundColor:'rgba(100,100,100,0.1)',
    marginLeft:'10%',
    paddingLeft:15,
    fontSize:16
  },
  nickname_info:{
    marginTop:10,
    fontSize:13,
    color:'rgba(100,100,100,0.8)',
    paddingLeft:'12%'
  },
  nextbutton:{
    position:'absolute',
    bottom:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgb(234,29,93)',
    width:'80%',
    marginLeft:'10%',
    height:50,
    borderRadius:3,
  },
  nextbutton_txt:{
    color:'white',
    fontSize:18,
  },
  readybutton:{
    position:'absolute',
    bottom:30,
    backgroundColor:'rgb(160,160,160)',
    width:'80%',
    marginLeft:'10%',
    height:50,
    borderRadius:3,
    color:'white',
    fontSize:18,
    lineHeight:50,
    textAlign:'center'
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    uid:state.setinfo.uid,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
      setuid: (uid)=>{
        dispatch(actions.setuid(uid));
      }
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(SetUidScreen);