import React,{Component} from 'react';
import {StyleSheet,Dimensions,Platform} from 'react-native';
import Video from 'react-native-video';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

var RNFS = require('react-native-fs');

const {width,height}=Dimensions.get("window");

class VideoPannel extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      uri:'',
      pauseIndex:true
    }

  }
  refreshIndex=0;
  async componentWillReceiveProps(nextProps){
    if(this.state.uri===''){return;}
    console.log('componentWillReciveProps');
    if(this.refreshIndex!=nextProps.home1refresh){
      console.log('component Will Receive Props#######');
      console.log(nextProps.home1refresh);
      this.refreshIndex=nextProps.home1refresh
      await this.setState({pauseIndex:false});
      this.setState({pauseIndex:true});
    }
    var uri = nextProps.uri;
    if(uri.indexOf('http')==-1){
      this.setState({
        uri
      })
    }
  }
  componentWillMount(){
    console.log('componentWill Mount')
    if(this.props.uri.indexOf('http')==-1){
      this.setState({
        uri:this.props.uri
      })
    }else{
      var videoURL=this.props.uri;
      let filename =videoURL.split('/')[3];
      var path_name = RNFS.DocumentDirectoryPath +'/'+ filename;
      RNFS.exists(path_name).then(async exists => {
        if (exists) {
          this.setState({
            uri:path_name
          })
        } else {
          RNFS.downloadFile({
            fromUrl: videoURL,
            toFile: path_name.replace(/%20/g, "_"),
            background: true
          })
            .promise.then(async res => {
              this.setState({
                uri:path_name
              })
            })
            .catch(err => {
              console.log("err downloadFile", err);
            });
        }
      });
    }
  }
  render(){
    console.log(this.props);
    return(
      <Video 
        source={{uri: this.state.uri}}   
        // muted={(()=>{
        //   return this.props.paused===0&&this.props.index===Math.round(this.props.scrollY)?false:true;
        // })()}
        rate={
          (()=>{
            if(Platform.OS=='ios'||Platform.Version<25){
              return 1;
            }else{
              if(this.state.pauseIndex===false){
                return 1;
              }else{
                return this.props.paused===true?0:1;
              }
            }
          })()
        }
        paused={(()=>{
          if(Platform.OS=='ios'||Platform.Version<25){
            if(this.state.pauseIndex===false){
              return false;
            }else{
              return this.props.paused;
            }
          }else{
            return false
          }
        })()}

        repeat={true}
        resizeMode={'cover'}
        style={{position:'absolute',top:0,left:0,bottom:0,right:0,backgroundColor:'#000'}} 
      />
    )
  }
}
const styles = StyleSheet.create({

})
const mapStateToProps = (state) =>{
  return{
    home1refresh:state.sidefunc.home1refresh,
  }
}
export default connect(mapStateToProps,null)(VideoPannel);