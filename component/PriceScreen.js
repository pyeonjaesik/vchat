import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,TextInput,ScrollView,Dimensions,FlatList,Platform,ActivityIndicator,Animated,Easing} from 'react-native';
// import ShowItem from './ShowItem';
// import Dialog from './Dialog';
import Toast from 'react-native-simple-toast';
import {KeyboardAvoidingView,StatusBar} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL} from '../config';
import axios from 'axios';
import DomParser from 'dom-parser';
import LottieView from 'lottie-react-native';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const {width,height}=Dimensions.get("window");
class PriceScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      dialog:false,
      price:this.props.price.toString()
    }
    this.didFocus=this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.setState({
          // instagram:this.props.sns.instagram.url
        })
        // this.props.setRollResult(this.props.navigation.getParam('result', []));
      }
    );
    this._setPrice=this._setPrice.bind(this);
  }
  static navigationOptions = {
    header:null,
  };
  didFocus;
  _setPrice(){
    this.props.setprice(parseInt(this.state.price))
    let data={
      _id:this.props._id,
      price:parseInt(this.state.price)
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/setprice`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        Toast.show('가격 설정 저장에 성공하였습니다.');
      }else{
        Toast.show('가격 저장 중 오류가 발생하였습니다.');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  componentWillUnmount(){
    this.didFocus.remove();
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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <StatusBar barStyle={this.props.barStyle} backgroundColor={'transparent'} translucent={true}/>
        <View style={{marginTop:STATUSBAR_HEIGHT}}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{this.props.navigation.goBack()}}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finish} onPress={()=>{
                // this.refs.mainInput.blur();
                this._setPrice();
                this.props.navigation.goBack();
              }}
            >
            <Text style={styles.finish_txt}>저장</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.main}>
          <Text style={styles.price_title}>영상의 가격을 설정해 주세요.</Text>
          <AnimatedTextInput
            style={{...styles.main_input}}
            placeholder='10 해피볼'
            autoFocus={true}
            ref='mainInput'
            onChangeText={(price)=>{
              this.setState({
                price,
              })
            }}
            value={this.state.price}
            keyboardType={'numeric'}
          />
          {/* <Text style={styles.price_info}>
            {'해피볼 하나 당 가격은 100원 입니다.\n환전시 하나 당 70원으로 환전할 수 있습니다.\n\n즉, 영상의 가격이 10 해피볼이라면 \n팬은 10,000(부과세 미포함)원에 영상을 구매하고\n인플루언서는 7,000원으로 환전할 수 있습니다.'}
          </Text> */}
        </ScrollView>
        
        <View style={styles.bottom_container}>

        </View>
        {/* {
          this.state.dialog===true?(
          <Dialog 
            _ok={this._ok} 
            _cancel={this._cancel} 
            subject='새 미션' 
            main={this.props.coin+'다트를 포상으로 하여 정말로 미션을 게시하시겠습니까?'}/>
          ):(null)
        } */}
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
     bottom:50,
  },
  main_input:{
    marginTop:0,
    paddingHorizontal:30,
    fontSize:17,
    marginVertical:6,
    // backgroundColor:'rgb(240,240,240)',
    // borderColor:'rgba(100,100,100,0.5)',
    height:50,
    borderBottomWidth:1,
    borderColor:'rgba(100,100,100,0.3)',
    alignSelf:'center',
    width:width-30,
    borderRadius:10,
    marginBottom:height*0.06
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
  },
  price_title:{
    fontSize:20,
    color:'#000',
    marginLeft:20,
    marginVertical:10,
    fontWeight:'bold'
  },
  price_info:{
    fontSize:16,
    color:'#777',
    marginLeft:20,
    marginTop:20
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    price:state.setinfo.price
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setprice: (price)=>{
      dispatch(actions.setprice(price));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(PriceScreen);
