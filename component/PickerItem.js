import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions} from 'react-native';
import Video from 'react-native-video';
const {width}=Dimensions.get("window");
export default class RollCard extends Component{
  constructor(props){
    super(props);
    this.state={
      btn_status:false,
      result:this.props.result,
    }
  }
  render(){
    let {item,index}=this.props
    if(item.dur>0){
      return(
        <TouchableOpacity 
          style={{...styles.list_item,marginHorizontal:index%3===1?6:0}}
          activeOpacity={1} 
          onPress={async ()=>{
            if(this.state.btn_status===false){
              let temp = await this.props.plusRoll(item.uri,item.type,item.dur);
              if(temp ===100){
                return;
              }
              await this.props.setPlayed(item.uri);
              this.setState({
                btn_status:true,
                num:temp
              })
            }else{
              await this.props.minusRoll(item.uri);
              this.setState({
                btn_status:false
              })
            }
          }}
          >
        {
          this.state.btn_status===true ? (
            <View style={styles.btn}>
              {
                this.props.played === item.uri ? (
                  <Video 
                    source={{uri: item.uri}}   // Can be a URL or a local file.
                    style={styles.backgroundVideo} 
                    resizeMode='cover'
                    repeat={true}
                  />
                ):(
                  <Image 
                    source={{uri: item.uri}}
                    style={styles.backgroundVideo}
                  />
                )
              }

              <Text style={styles.btn_txt}>{this.props.result.findIndex(x=>x.uri===item.uri)+1}</Text>
            </View>
          ):(
            <View style={styles.backgroundVideo}>
              <Image 
                source={{uri: item.uri}}
                style={styles.backgroundVideo}
              />
              <Text style={styles.playDuration}>{`${parseInt(item.dur/60)}:${item.dur%60}`}</Text>
            </View>
          )
        }
      </TouchableOpacity>
      )
    }else{
      return(
        <TouchableOpacity 
          style={{...styles.list_item,marginHorizontal:index%3===1?6:0}}
          activeOpacity={1} 
          onPress={async ()=>{
            if(this.state.btn_status===false){
              let temp = await this.props.plusRoll(item.uri,item.type,0);
              if(temp===100){
                return;
              }
              this.setState({
                btn_status:true,
                num:temp
              })
            }else{
              await this.props.minusRoll(item.uri);
              this.setState({
                btn_status:false
              })
            }
          }}
          >
        <Image 
          source={{uri: item.uri}}
          style={styles.backgroundVideo}
        />
        {
          this.state.btn_status===true ? (
            <View style={styles.btn}>
              {/* <Text style={styles.btn_txt}>{this.props.result.findIndex(x=>x.uri===item.uri)+1}</Text> */}
            </View>
          ):(null)
        }
      </TouchableOpacity>
      )
    }
  }

}
const styles = StyleSheet.create({
  list_item:{
    flex: 1,
    flexDirection: 'column', 
    height:(width/3)-4,
    maxWidth: (width/3)-4,
    marginBottom:6,
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
    borderColor:'#da1884'
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
  }
});