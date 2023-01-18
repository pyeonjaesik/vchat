import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,TextInput,ScrollView,Dimensions,FlatList,Platform} from 'react-native';
// import ShowItem from './ShowItem';
// import Dialog from './Dialog';
import Toast from 'react-native-simple-toast';
import {KeyboardAvoidingView,StatusBar} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL,STATUSBAR_HEIGHT} from '../config';


const {width,height}=Dimensions.get("window");
class IntroduceScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      dialog:false,
      text:''
    }
    this.didFocus=this.props.navigation.addListener(
      'didFocus',
      payload => {
        // this.props.setRollResult(this.props.navigation.getParam('result', []));
      }
    );
    this._fetch=this._fetch.bind(this);
  }
  static navigationOptions = {
    header:null,
  };
  didFocus;
  update_index=false;
  resultcoin=0;

  componentWillUnmount(){
    this.didFocus.remove();
  }
  _fetch(){
    this.props.setintro(this.state.text)
    let data={
      _id:this.props._id,
      text:this.state.text
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/setintroduce`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        Toast.show('프로필 등록을 정상적으로 하였습니다.')
      }else{
        Toast.show('프로필 등록 중 오류가 발생하였습니다.')
      }
    })
    .catch((error) => {
      console.error(error);
    });  
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <StatusBar barStyle='dark-content' backgroundColor={'transparent'} translucent={true}/>
        <View style={{marginTop:STATUSBAR_HEIGHT}}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{this.props.navigation.goBack()}}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finish} onPress={()=>{
                this._fetch()
                this.refs.mainInput.blur();
                this.props.navigation.goBack();
                //finish
              }}
            >
             <Text style={styles.finish_txt}>저장 </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.main}>
          <TextInput 
            style={{...styles.main_input}}
            placeholder='내용을 입력해 주세요.'
            multiline={true}
            autoFocus={true}
            ref='mainInput'
            onChangeText={(text)=>{
              this.setState({text})
            }}
            value={this.state.text}
          />

        </ScrollView>
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
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  subject:{
    fontSize:25,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    textAlign:'center',
    alignSelf:'center',
    marginTop:-30,
  },
  main:{
    marginTop:50,
    flex:1,
    //  backgroundColor:'blue',
     bottom:50
  },
  main_coin:{
    fontSize:15,
    alignSelf:'center',
    marginTop:10,
    color:'rgb(140,140,140)'
  },
  main_input:{
    marginTop:20,
    paddingHorizontal:30,
    fontSize:16,
    marginVertical:6,
    // backgroundColor:'rgb(240,240,240)',
    // borderColor:'rgba(100,100,100,0.5)',
    borderBottomWidth:1,
    borderColor:'rgba(100,100,100,0.3)',
    alignSelf:'center',
    width:width-30,
    borderRadius:10,
    marginBottom:height*0.06,
    paddingBottom:10
  },
  image_container:{
    width:width,
    height:width,
    // backgroundColor:'blue'
  },  
  bottom_container:{
    position:'absolute',
    left:0,
    bottom:0,
    width:'100%',
    height:50,
    backgroundColor:'white',
    borderTopWidth:1,
    borderColor:'rgba(150,150,150,0.2)',
    flexDirection:'row',
    alignItems:'center',
  },
  bottom_txt:{
    color:'rgb(70,70,70)',
    fontSize:20,
    paddingLeft:15
  },
  attach:{
    position:'absolute',
    height:50,
    top:0,
    left:20,
    justifyContent:'center',
    alignItems:'center',
  },
  attach_txt:{
    fontSize:16,
    color:'rgb(22,23,27)',
    fontWeight:'400'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 30,
    left: 0,
    width:300,
    height:300,
  },
  finish:{
    position:'absolute',
    right:0,
    width:80,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'center'
  },
  finish_txt:{
    fontSize:16,
    color:'rgba(0,0,0,0.8)',
    fontWeight:'bold'
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    intro:state.setinfo.intro,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setintro: (intro)=>{
      dispatch(actions.setintro(intro));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(IntroduceScreen);