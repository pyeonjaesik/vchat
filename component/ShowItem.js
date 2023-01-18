import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions} from 'react-native';
const {width}=Dimensions.get("window");
export default class ShowItem extends Component{
  constructor(props){
    super(props);
    this.state={
      mode:0
    }
  }
  render(){
    let {item,index}=this.props
    if(item.dur>0){
      return(
        <View style={{...styles.list_item,marginLeft:index%2===1?5:0}}>
          <View style={styles.backgroundVideo}>
            <Image 
              source={{uri: item.uri}}
              style={styles.backgroundVideo}
            />
            <Text style={styles.playDuration}>{`${parseInt(item.dur/60)}:${item.dur%60}`}</Text>
          </View>
          <TouchableOpacity
          style={styles.remove}
          onPress={()=>{
            this.props.removeRollResult(this.props.item.uri);
          }}>
            <View style={styles.remove_m}/>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(
        <View style={{...styles.list_item,marginLeft:index%2===1?5:0}}>
          <Image 
            source={{uri: item.uri}}
            style={styles.backgroundVideo}
            resizeMode={this.state.mode===0?'cover':'contain'}
          />
          <TouchableOpacity
            style={styles.remove}
            onPress={()=>{
              this.props.removeRollResult(this.props.item.uri);
            }}>
            <View style={styles.remove_m}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imagemode}
            onPress={async ()=>{
              if(this.state.mode===0){
                await this.setState({
                  mode:1
                })
                this.props.imagemodeRollResult(this.props.item.uri,1)
              }else{
                await this.setState({
                  mode:0
                })
                this.props.imagemodeRollResult(this.props.item.uri,0)
              }
            }}
          >
            <Image source={require('../assets/resize.png')}
              style={{width:19,height:19}}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }

}
const styles = StyleSheet.create({
  list_item:{
    flex: 1,
    flexDirection: 'column', 
    height:(width/2)-2.5,
    maxWidth: (width/2)-2.5,
    marginBottom:5,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width:'100%',
    height:'100%',
    backgroundColor:'rgba(255,255,255,0))'
  },
  btn:{
    width:'100%',
    height:'100%',
    borderWidth:5,
    borderColor:'#231f20'
  },
  btn_txt:{
    position:'absolute',
    width:27,
    height:27,
    top:0,
    right:0,
    fontSize:15,
    backgroundColor:'#231f20',
    textAlign:'center',
    lineHeight:26,
    color:'white',
    fontWeight:'500'
  },
  playDuration:{
    position:'absolute',
    bottom:0,
    right:0,
    fontSize:15,
    color:'white',
    paddingRight:8,
    textAlign:'right', // paddingRight 가 제작동을 하기 위해선 textAlign이 있어야함.
    backgroundColor:'rgba(2,23,27,0.5)',
    width:'100%',
    height:23,
    lineHeight:23,
  },
  remove:{
    position:'absolute',
    top:3,
    right:3,
    width:30,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.7)',
    borderRadius:10
  },
  remove_m:{
    width:15,
    height:3,
    backgroundColor:'#ffffff',
  },
  imagemode:{
    position:'absolute',
    bottom:7,
    left:5,
    width:34,
    height:34,
    borderRadius:15,
    backgroundColor:'rgba(100,100,100,0.3)',
    justifyContent:'center',
    alignItems:'center'
  }
});