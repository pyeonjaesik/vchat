import React,{Component} from 'react';
import {View, StyleSheet,Dimensions,Image,Text,TouchableOpacity,Button} from 'react-native';
import FastImage from 'react-native-fast-image'
import Video from 'react-native-video';

var RNFS = require('react-native-fs');


const {width}=Dimensions.get("window");
export default class VideoCard extends Component{
  constructor(props){
    super(props);
    this.state={
      pauseIndex:false,
      path:''
    }
    console.log('aa')
    var videoURL='https://puppytest.s3.ap-northeast-2.amazonaws.com/1582446775517.mp4';
    let filename =videoURL.split('/')[3];

    let path_name = RNFS.DocumentDirectoryPath +'/'+ filename;
    RNFS.exists(path_name).then(exists => {
      if (exists) {
        console.log("Already downloaded");
        this.setState({
          path:path_name
        })
      } else {
        console.log('aaads');
        RNFS.downloadFile({
          fromUrl: videoURL,
          toFile: path_name.replace(/%20/g, "_"),
          background: true
        })
          .promise.then(res => {
            console.log("File Downloaded", res);
            this.setState({
              path:path_name
            })
          })
          .catch(err => {
            console.log("err downloadFile", err);
          });
      }
    });
  };
  render(){
    if(this.props.index+2<this.props.scrollY||this.props.index>this.props.scrollY+2){
      return(
        <View style={{...styles.container,height:this.props.height}}></View>
      )
    }else{
      return(
        <TouchableOpacity style={{...styles.container,height:this.props.height}} activeOpacity={1}>
          <Video source={{uri: this.state.path}}   
            muted={false}
            repeat={true}
            onBuffer={()=>{
              console.log('onBuffer')
            }}
            paused={(()=>{
              return this.props.paused;
              if(this.state.pauseIndex===false){
                return false;
              }else{
                return this.props.paused===false&&this.props.index===Math.round(this.props.scrollY)?false:true;
              }
            })()}
            resizeMode={'cover'}
            onLoad={()=>{
              this.setState({
                pauseIndex:true
              })
            }}
            style={styles.backgroundVideo} 
          />
          <TouchableOpacity onPress={()=>{
          }}>
          <Text style={{fontSize:20,color:'#fff'}}>{this.props.item.currentIndex+'/'+this.props.index+'/'+this.props.scrollY+'/'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileImg_c} onPress={()=>{
            this.props.navigation.navigate('Book',{
              item:{
                user_id:this.props.item.user_id,
                img:this.props.item.profile.img,
                id:this.props.item.profile.id
              }
            })
          }}>
          {
            this.props.item.profile.img===''?(
              <Image source={require('../../../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
            ):(
              <FastImage
                style={{width:'100%',height:'100%'}}
                source={{
                    uri: this.props.item.profile.img,
                    priority: FastImage.priority.normal,
                }}
              />
            )
          }
          </TouchableOpacity>
          <Button title='delete' onPress={()=>{
            RNFS.readDir(RNFS.DocumentDirectoryPath)
            .then(result => {
              console.log(result);
              result.forEach(element => {
                console.log(element.mtime)
                // if (element.name == filename.replace(/%20/g, "_")) {
                //   resolve(element.path);
                // }
              });
            })
            .catch(err => {
              console.log(err);
              // reject(url);
            });
            // var path = RNFS.DocumentDirectoryPath;
 
            // return RNFS.unlink(path)
            //   .then(() => {
            //     console.log('FILE DELETED');
            //   })
            //   // `unlink` will throw an error, if the item to unlink does not exist
            //   .catch((err) => {
            //     console.log(err.message);
            //   });
          }}>

          </Button>
        </TouchableOpacity>
      )
    }
  }
}
const styles = StyleSheet.create({
  container:{
    width:width,
    backgroundColor:'red',
    justifyContent:'center',
    alignItems:'center'
  },
  backgroundVideo:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:'blue'
  },
  profileImg_c:{
    width:56,
    height:56,
    backgroundColor:'blue',
    position:'absolute',
    bottom:240,
    right:8,
    overflow:'hidden',
    borderRadius:56,
    borderWidth:1.6,
    borderColor:'#fff'
  }
})