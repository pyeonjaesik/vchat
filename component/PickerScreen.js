import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,FlatList,Text,Dimensions,ActivityIndicator,Platform,Keyboard} from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";
import PickerItem from './PickerItem'
import Toast from 'react-native-simple-toast';
const {width}=Dimensions.get("window");

export default class PickerScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      roll:[],
      result:[],
      refresh:false,
      played:'',
      loading:true
    }
    this.plusRoll=this.plusRoll.bind(this);
    this.minusRoll=this.minusRoll.bind(this);
    this.setPlayed=this.setPlayed.bind(this);
  }
  static navigationOptions = {
    header:null,
    imagedata:[]
  };
  
  async plusRoll(uri,type,dur){
    if(this.state.result.length>=30){
      Toast.show('30개 까지만 선택할 수 있습니다.');
      return 100;
    }
    if(dur==0){
      await this.setState(prev=>{
        result:prev.result.push({uri,type,dur,mode:0})
      });
    }else{
      await this.setState(prev=>{
        result:prev.result.push({uri,type,dur,mode:0})
      });
    }
    console.log(this.state.result);
    return this.state.result.length;
  }
  async minusRoll(uri){
    await this.setState(prev=>{
       prev.result.splice(prev.result.findIndex(x=> x.uri===uri),1)
      return{
        result:prev.result
      }
      
    });  
    console.log(this.state.result); 
  }
  setPlayed(uri){
    this.setState({
      played:uri
    })
  }
  componentDidMount(){
    Keyboard.dismiss();
    CameraRoll.getPhotos({
      first: 20000,
      assetType: 'Photos',
    })
    .then(r => {
      console.log(r.edges);
      let item = [];
      r.edges.forEach((elm)=>{
        if(elm.node.image.playableDuration===undefined||elm.node.image.playableDuration===null){
          item.push({uri:elm.node.image.uri,type:elm.node.type,dur:0}) //image
        }else{
          item.push({uri:elm.node.image.uri,type:elm.node.type,dur:elm.node.image.playableDuration}) // video
        }
      });
      console.log('PickerScreen');
      console.log(item);
      this.setState({
        roll:item,
        loading:false
      })
      console.log(r);
    })
    .catch((err) => {
      console.log(err);
        //Error Loading Images
    });
  }
  render(){
    return(
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{this.props.navigation.goBack()}}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finish}
            onPress={()=>{
              let from=this.props.navigation.getParam('from', '');
              if(from==='mission'){
                this.props.navigation.navigate('Mission',{result:this.state.result})
              }else{
                this.props.navigation.navigate('Profile',{result:this.state.result})
              }
            }}
          >
            <Text style={styles.finish_txt}>완료</Text>
          </TouchableOpacity>
        </View>
        {
          this.state.loading===true?(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator size={Platform.OS === 'ios'? 'large' : 40} style={{marginBottom:50}} color="#000000" />
            </View>
          ):(
            <FlatList
            style={{backgroundColor:'white'}}
            data={this.state.roll}
            keyExtractor={(item) => item.uri}
            // onViewableItemsChanged={(props)=>{console.log(props)}}
            // viewabilityConfig={{
            //   itemVisiblePercentThreshold: 100
            // }}
            renderItem={({ item , index }) => (
              <PickerItem item={item} index={index} plusRoll={this.plusRoll} minusRoll={this.minusRoll} result={this.state.result} played={this.state.played} setPlayed={this.setPlayed}/>
            )}
            // extraData={this.state.refresh}
            numColumns={3}
            style={{marginTop:0}}
          />
          )
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  header:{
    width:'100%',
    height:55,
    flexDirection:'row',
  },
  leftbtn:{
    marginTop:0,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  finish:{
    position:'absolute',
    top:0,
    right:15,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  finish_txt:{
    fontSize:16,
    fontWeight:'500',
    color:'#000000'
  }
});