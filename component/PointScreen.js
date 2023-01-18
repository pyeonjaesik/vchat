import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,Dimensions,Linking,Platform,StatusBar} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL} from '../config';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

const {width,height}=Dimensions.get("window");
class PointScreen extends Component{
  constructor(props){
    super(props);
  }

  static navigationOptions = {
    header:null
  };
  render(){
    console.log(this.props);
    return(
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <TouchableOpacity style={styles.leftbtn}
            onPress={() => this.props.navigation.goBack()}
        >
          <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
        </TouchableOpacity>
        <View style={styles.main}>
          <Text style={styles.subject_info2}>해피볼</Text>
          <Text style={styles.coin}>{this.props.coin}<Text style={styles.coin_sub}> 개</Text></Text>
          <TouchableOpacity style={styles.charge}
            onPress={()=>{
              this.props.navigation.navigate('Pay');
            }}
          >
            <Text style={styles.charge_txt}>구매하기</Text>
            <Image source={require('../assets/right-arrow.png')}
                style={styles.right}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exchange}
            onPress={()=>{
              Linking.openURL(`${URL}/userex?userid=${this.props.user_id}`)
            }}
          >
            <Text style={styles.exchange_txt}>환전하기</Text>
            <Image source={require('../assets/right-arrow.png')}
                style={styles.right}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.history}
            onPress={()=>{
              this.props.navigation.navigate('History');
            }}
          >
            <Text style={styles.history_txt}>거래내역</Text>
            <Image source={require('../assets/right-arrow.png')}
                style={styles.right}
            />
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
  right:{
    position:'absolute',
    width:20,
    height:20,
    top:8,
    right:10
  },
  main:{
    flex:1,
  },
  subject_info:{
    marginTop:10,
    marginLeft:25,
    fontSize:27,
    color:'#000000',
    fontWeight:'500'
  },
  subject_info2:{
    marginTop:0,
    marginLeft:30,
    fontSize:40,
    color:'#000000',
    fontWeight:'200',
  },
  coin:{
    alignSelf:'center',
    fontSize:100,
    lineHeight:120,
    color:'#000',
    fontWeight:'200',
    marginTop:(height-120)*0.15
  },
  coin_sub:{
    alignSelf:'center',
    fontSize:30,
    lineHeight:120,
    color:'#222',
    fontWeight:'200',
  },
  dart:{
    marginTop:10,
    height:130,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around'
  },
  charge:{
    position:'absolute',
    bottom:190,
    left:20,
    width:width-40,
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  charge_txt:{
    fontSize:16,
    marginLeft:10
  },
  exchange:{
    position:'absolute',
    bottom:140,
    left:20,
    width:width-40,
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  exchange_txt:{
    fontSize:16,
    marginLeft:10
  },
  history:{
    position:'absolute',
    bottom:90,
    left:20,
    width:width-40,
    height:40,
    flexDirection:'row',
    alignItems:'center'
  },
  history_txt:{
    fontSize:16,
    marginLeft:10
  },
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    user_id:state.setinfo.user_id,
    id:state.setinfo.id,
    coin:state.setinfo.coin,
    logintype:state.setinfo.logintype,
    ph:state.setinfo.ph,
    email:state.setinfo.email,
    pwindex:state.setinfo.pwindex
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
      mgrefresh: (index)=>{
        dispatch(actions.mgrefresh(index));
      }
  }   
}

export default connect(mapStateToProps,mapDispatchToProps)(PointScreen);