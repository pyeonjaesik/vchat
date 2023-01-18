import React,{Component} from 'react';
import {StyleSheet, View,Image,TouchableOpacity,Dimensions,StatusBar,Platform,ActivityIndicator} from 'react-native';
// import {MyStatusBar} from './MyStatusBar';
import { WebView } from 'react-native-webview';
import { getStatusBarHeight } from 'react-native-status-bar-height';
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;

const {width,height}=Dimensions.get("window");
export default class WebScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      uri:'',
      loading:true
    }

  }
  static navigationOptions = {
    header:null
  };
  async componentDidMount(){
    let uri= await this.props.navigation.getParam('uri','');
    this.setState({
      uri
    })
  }
  render(){
    return(
      <View style={styles.container}>
        <StatusBar backgroundColor='#ea1d5d' barStyle="light-content" />
        <View style={{width,height:STATUSBAR_HEIGHT+55,backgroundColor:'#ea1d5d'}}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={() => {this.props.navigation.goBack()}}
          >
            <Image source={require('../assets/closebutton_white.png')} style={{width:20,height:20}}/>
          </TouchableOpacity>
        </View>
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'blue'}}>
          <WebView
              source={{uri: this.state.uri}}
              style={{marginTop:0,width:width,height:height-STATUSBAR_HEIGHT-55}}
              onLoad={() => {
                this.setState({loading:false});
              }}
          />
          {
            this.state.loading===true?(
              <View style={{position:'absolute',top:(height-STATUSBAR_HEIGHT-155)/2,left:(width-100)/2,width:100,height:100,
              justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size={Platform.OS === 'ios'? 0 : 40} color="#000000" />
              </View>
              
            ):(null)
          }
        </View>
      </View>
    )
    
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  leftbtn:{
    marginTop:STATUSBAR_HEIGHT,
    marginRight:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center',
    alignSelf:'flex-end'
  },
});
