import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,TextInput,ScrollView,Dimensions,FlatList,Platform,ActivityIndicator,Animated,Easing} from 'react-native';
// import ShowItem from './ShowItem';
// import Dialog from './Dialog';
import Toast from 'react-native-simple-toast';
import {KeyboardAvoidingView,StatusBar} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL,STATUSBAR_HEIGHT} from '../config';
import axios from 'axios';
import DomParser from 'dom-parser';
import LottieView from 'lottie-react-native';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const {width,height}=Dimensions.get("window");
class CategoryScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      dialog:false,
      instagram:this.props.sns.instagram.url,
      youtube:this.props.sns.youtube.url,
      africa:this.props.sns.africa.url,
      tiktok:this.props.sns.tiktok.url,
      vanhana:this.props.sns.vanhana.url,
      instagramColor:'rgb(220,220,220)',
      youtubeColor:'rgb(220,220,220)',
      africaColor:'rgb(220,220,220)',
      tiktokColor:'rgb(220,220,220)',
      vanhanaColor:'rgb(220,220,220)',
      instagramLoading:0,
      youtubeLoading:0,
      africaLoading:0,
      tiktokLoading:0,
      vanhanaLoading:0,
      instagramMargin:new Animated.Value(0),
      youtubeMargin:new Animated.Value(0),
      africaMargin:new Animated.Value(0),
      tiktokMargin:new Animated.Value(0),
      vanhanaMargin:new Animated.Value(0),


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
    this._instagram=this._instagram.bind(this);
    this._youtube=this._youtube.bind(this);
    this._tiktok=this._tiktok.bind(this);
    this._vanhana=this._vanhana.bind(this);
    this.sns=this.sns.bind(this);
    this.flush=this.flush.bind(this);
    this._spring=this._spring.bind(this);
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
  flush(type){
    let data={
      _id:this.props._id,
      sns:{
        url:'',
        follow:0
      }
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/set${type}`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
        if(responseJson.status=100){
          if(type=='instagram'){
            this.setState({
              instagramColor:'rgb(220,220,220)',
              instagramLoading:0,
              instagram:''
            });
            this.props.setsns({
              ...this.props.sns,
              instagram:{
                url:'',
                follow:0
              },
            })
          }else if(type=='tiktok'){
            this.setState({
              tiktokColor:'rgb(220,220,220)',
              tiktokLoading:0,
              tiktok:''
            });
            this.props.setsns({
              ...this.props.sns,
              tiktok:{
                url:'',
                follow:0
              },
            })
          }else if(type=='africa'){

          }else if(type=='youtube'){
            this.setState({
              youtubeColor:'rgb(220,220,220)',
              youtubeLoading:0,
              youtube:''
            });
            this.props.setsns({
              ...this.props.sns,
              youtube:{
                url:'',
                follow:0
              },
            })
          }else if(type=='vanhana'){
            this.setState({
              vanhanaColor:'rgb(220,220,220)',
              vanhanaLoading:0,
              vanhana:''
            });
            this.props.setsns({
              ...this.props.sns,
              vanhana:{
                url:'',
                follow:0
              },
            })
          }
        }else{
          console.log(`set ${type} error`);
        }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  sns(type,sns){
    let data={
      _id:this.props._id,
      sns
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/set${type}`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
        if(responseJson.status=100){
          if(type=='instagram'){
            this.setState({
              instagramColor:'rgba(80,255,80,1)',
              instagramLoading:2
            });
            this.props.setsns({
              ...this.props.sns,
              instagram:{
                url:sns.url,
                follow:sns.follow
              },
            })
          }else if(type=='tiktok'){
            this.setState({
              tiktokColor:'rgba(80,255,80,1)',
              tiktokLoading:2
            });
            this.props.setsns({
              ...this.props.sns,
              tiktok:{
                url:sns.url,
                follow:sns.follow
              },
            })
          }else if(type=='africa'){

          }else if(type=='youtube'){
            this.setState({
              youtubeColor:'rgba(80,255,80,1)',
              youtubeLoading:2
            });
            this.props.setsns({
              ...this.props.sns,
              youtube:{
                url:sns.url,
                follow:sns.follow
              },
            })
          }else if(type=='vanhana'){
            this.setState({
              vanhanaColor:'rgba(80,255,80,1)',
              vanhanaLoading:2
            });
            this.props.setsns({
              ...this.props.sns,
              vanhana:{
                url:sns.url,
                follow:sns.follow
              },
            })
          }
        }else{
          console.log(`set ${type} error`);
        }
    })
    .catch((error) => {
      console.error(error);
    });
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
  async _instagram(){
    if(this.props.sns.instagram.url==this.state.instagram){
      console.log('instagram not changed')
      return;
    }
    if(this.state.instagram==''){
      this.flush('instagram');
      return;
    }
    await this.setState({instagramLoading:1})
    axios.get(this.state.instagram)
    .then((async function (response) {
      var follow=response.data.split('"edge_followed_by":{"count":')[1].split('}')[0];
      var follow_num=parseFloat(follow);
      if(follow.indexOf('M')!=-1||follow.indexOf('m')!=-1){
        follow_num*=1000000;
      }else if(follow.indexOf('만')!=-1){
        follow_num*=10000;
      }else if(follow.indexOf('천')!=-1||follow.indexOf('k')!=-1||follow.indexOf('K')!=-1){
        follow_num*=1000;
      }
      follow=follow_num;
      if(follow>=0){
        this.sns('instagram',{url:this.state.instagram,follow});
      }else{
        await this.setState({
          instagramColor:'rgba(255,80,80,0.2)',
          instagramLoading:0
        })
        this._spring(this.state.instagramMargin);
        console.log('_instagram: error2');
      }
    }).bind(this))
    .catch((async function (error) {
      this.setState({
        instagramColor:'rgba(255,80,80,0.2)',
        instagramLoading:0
      });
      this._spring(this.state.instagramMargin)
      console.log('_instagram: error3');
    }).bind(this)) 
  }
  async _youtube(){
    if(this.props.sns.youtube.url==this.state.youtube){
      console.log('youtube not changed')
      return;
    }
    if(this.state.youtube==''){
      this.flush('youtube');
      return;
    }
    await this.setState({youtubeLoading:1})
    axios.get(this.state.youtube)
    .then((async function (response) {
      var parser = new DomParser();
      var dom = parser.parseFromString(response.data);
      var follow = dom.getElementsByClassName("yt-subscription-button-subscriber-count-branded-horizontal subscribed yt-uix-tooltip");
      var follow_num=parseFloat(follow[0].innerHTML);
      if(follow[0].innerHTML.indexOf('M')!=-1||follow[0].innerHTML.indexOf('m')!=-1){
        follow_num*=1000000;
      }else if(follow[0].innerHTML.indexOf('만')!=-1){
        follow_num*=10000;
      }else if(follow[0].innerHTML.indexOf('천')!=-1||follow[0].innerHTML.indexOf('k')!=-1||follow[0].innerHTML.indexOf('K')!=-1){
        follow_num*=1000;
      }
      follow=follow_num;
      console.log('follower:'+follow)
      if(follow>=0){
        this.sns('youtube',{url:this.state.youtube,follow});
      }else{
        await this.setState({
          youtubeColor:'rgba(255,80,80,0.2)',
          youtubeLoading:0
        })
        this._spring(this.state.youtubeMargin);
        console.log('youtube: error2');
      }
    }).bind(this))
    .catch((async function (error) {
      this.setState({
        youtubeColor:'rgba(255,80,80,0.2)',
        youtubeLoading:0
      });
      this._spring(this.state.youtubeMargin)
    }).bind(this));
  }
  async _tiktok(){
    if(this.props.sns.tiktok.url==this.state.tiktok){
      console.log('tiktok not changed')
      return;
    }
    if(this.state.tiktok==''){
      this.flush('tiktok');
      return;
    }
    await this.setState({tiktokLoading:1})
    axios.get(this.state.tiktok)
    .then((async function (response) {
      var parser = new DomParser();
      var dom = parser.parseFromString(response.data);
      var followerBlock = dom.getElementsByClassName("follower block");
      if(followerBlock.length==0){
        var followerBlock = dom.getElementsByClassName("count-infos");
        var followerBlock2 = followerBlock[0].getElementsByClassName("number");
        var follower= followerBlock2[1].innerHTML;
      }else{
        var followerBlock2 = followerBlock[0].getElementsByClassName("num");
        var follower= followerBlock2[0].innerHTML;
      }
      var follow_num=parseFloat(follower);
      if(follower.indexOf('M')!=-1||follower.indexOf('m')!=-1){
        follow_num*=1000000;
      }else if(follower.indexOf('만')!=-1){
        follow_num*=10000;
      }else if(follower.indexOf('천')!=-1||follower.indexOf('k')!=-1||follower.indexOf('K')!=-1){
        follow_num*=1000;
      }
      var follow=follow_num;
      if(follow>=0){
        this.sns('tiktok',{url:this.state.tiktok,follow});
      }else{
        await this.setState({
          tiktokColor:'rgba(255,80,80,0.2)',
          tiktokLoading:0
        })
        this._spring(this.state.tiktokMargin);
        console.log('tiktok: error2');
      }
    }).bind(this))
    .catch((function (error) {
      this.setState({
        tiktokColor:'rgba(255,80,80,0.2)',
        tiktokLoading:0
      });
      this._spring(this.state.tiktokMargin)
      console.log('2')
    }).bind(this)); 
  }
  async _vanhana(){
    if(this.props.sns.vanhana.url==this.state.vanhana){
      console.log('vanhana not changed')
      return;
    }
    if(this.state.vanhana==''){
      this.flush('vanhana');
      return;
    }
    await this.setState({vanhanaLoading:1})
    axios.get(this.state.vanhana)
    .then((async function (response) {
      this.sns('vanhana',{url:this.state.vanhana,follow:0});
      return;
      var parser = new DomParser();
      var dom = parser.parseFromString(response.data);
      var followerBlock = dom.getElementsByClassName("follower block");
      if(followerBlock.length==0){
        var followerBlock = dom.getElementsByClassName("count-infos");
        var followerBlock2 = followerBlock[0].getElementsByClassName("number");
        var follower= followerBlock2[1].innerHTML;
      }else{
        var followerBlock2 = followerBlock[0].getElementsByClassName("num");
        var follower= followerBlock2[0].innerHTML;
      }
      var follow_num=parseFloat(follower);
      if(follower.indexOf('M')!=-1||follower.indexOf('m')!=-1){
        follow_num*=1000000;
      }else if(follower.indexOf('만')!=-1){
        follow_num*=10000;
      }else if(follower.indexOf('천')!=-1||follower.indexOf('k')!=-1||follower.indexOf('K')!=-1){
        follow_num*=1000;
      }
      var follow=follow_num;
      if(follow>=0){
        this.sns('tiktok',{url:this.state.tiktok,follow});
      }else{
        await this.setState({
          tiktokColor:'rgba(255,80,80,0.2)',
          tiktokLoading:0
        })
        this._spring(this.state.tiktokMargin);
        console.log('tiktok: error2');
      }
    }).bind(this))
    .catch((function (error) {
      this.setState({
        vanhanaColor:'rgba(255,80,80,0.2)',
        vanhanaLoading:0
      });
      this._spring(this.state.vanhanaMargin)
      console.log('2')
    }).bind(this)); 
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={""} enabled>
        <StatusBar barStyle={this.props.barStyle} backgroundColor={'transparent'} translucent={true}/>
        <View style={{marginTop:STATUSBAR_HEIGHT}}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{this.props.navigation.goBack()}}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finish} onPress={()=>{
              this._instagram();
              this._youtube();
              this._tiktok();
              this._vanhana();
              if(this.props.sns.vanhana.url==this.state.vanhana&&this.props.sns.tiktok.url==this.state.tiktok&&this.props.sns.instagram.url==this.state.instagram&&this.props.sns.youtube.url==this.state.youtube){
                Toast.show('변경된 사항이 없습니다.')
                return;
              }
              // this.refs.mainInput.blur();
              // this.props.navigation.goBack();
              //finish
            }}
          >
             <Text style={styles.finish_txt}>저장</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.main}>
          <View style={{...styles.sns_c,marginTop:32}}>
            <Image source={require('../assets/instagram.png')} style={styles.sns_logo}/>
            <Text style={styles.sns_txt}>인스타그램</Text>
            {
              (()=>{
                switch(this.state.instagramLoading){
                  case 0:
                    return null;
                  case 1:
                    return(
                      <ActivityIndicator style={{marginLeft:20}} size={'small'} color="#000" />
                    )
                  case 2:
                    return(
                      <LottieView style={styles.lottie_check}source={require('../assets/animation/check360.json')} autoPlay={true} loop={false}/>
                    )
                }
              })()
            }
            <TouchableOpacity style={styles.flush} onPress={()=>{
              this.flush('instagram');
            }}>
              <Text style={styles.flush_txt}>삭제</Text>
            </TouchableOpacity>
          </View>
          <AnimatedTextInput
            style={{...styles.main_input,borderColor:this.state.instagramColor,marginLeft:this.state.instagramMargin}}
            placeholder='https://instagram.com/@url'
            // autoFocus={true}
            ref='mainInput'
            onChangeText={(instagram)=>{
              this.setState({
                instagram,
                instagramColor:'rgba(200,200,200,0.3)',
                instagramLoading:0
              })
            }}
            value={this.state.instagram}
          />
          <View style={styles.sns_c}>
            <Image source={require('../assets/youtube.png')} style={styles.sns_logo}/>
            <Text style={styles.sns_txt}>유튜브</Text>
            {
              (()=>{
                switch(this.state.youtubeLoading){
                  case 0:
                    return null;
                  case 1:
                    return(
                      <ActivityIndicator style={{marginLeft:20}} size={'small'} color="#000" />
                    )
                  case 2:
                    return(
                      <LottieView style={styles.lottie_check}source={require('../assets/animation/check360.json')} autoPlay={true} loop={false}/>
                    )
                }
              })()
            }
            <TouchableOpacity style={styles.flush} onPress={()=>{
              this.flush('youtube');
            }}>
              <Text style={styles.flush_txt}>삭제</Text>
            </TouchableOpacity>
          </View>
          <AnimatedTextInput
            style={{
              ...styles.main_input,borderColor:this.state.youtubeColor,
              marginLeft:this.state.youtubeMargin
            }}
            placeholder='https://www.youtube.com/@url'
            // autoFocus={true}
            ref='mainInput'
            onChangeText={(youtube)=>{
              this.setState({youtube})
            }}
            value={this.state.youtube}
          />
          {/* <View style={styles.sns_c}>
            <Image source={require('../assets/africa.png')} style={styles.sns_logo}/>
            <Text style={styles.sns_txt}>아프리카</Text>
          </View>
          <TextInput 
            style={{...styles.main_input}}
            placeholder='https://www.instagram.com/@url'
            // autoFocus={true}
            ref='mainInput'
            onChangeText={(africa)=>{
              this.setState({africa})
            }}
            value={this.state.africa}
          /> */}
          <View style={styles.sns_c}>
            <Image source={require('../assets/tiktok.png')} style={styles.sns_logo}/>
            <Text style={styles.sns_txt}>틱톡</Text>
            {
              (()=>{
                switch(this.state.tiktokLoading){
                  case 0:
                    return null;
                  case 1:
                    return(
                      <ActivityIndicator style={{marginLeft:20}} size={'small'} color="#000" />
                    )
                  case 2:
                    return(
                      <LottieView style={styles.lottie_check}source={require('../assets/animation/check360.json')} autoPlay={true} loop={false}/>
                    )
                }
              })()
            }
            <TouchableOpacity style={styles.flush} onPress={()=>{
              this.flush('tiktok');
            }}>
              <Text style={styles.flush_txt}>삭제</Text>
            </TouchableOpacity>
          </View>
          <AnimatedTextInput 
            style={{...styles.main_input,borderColor:this.state.tiktokColor,
              marginLeft:this.state.tiktokMargin}}
            placeholder='https://vt.tiktok.com/@url'
            // autoFocus={true}
            ref='mainInput'
            onChangeText={(tiktok)=>{
              this.setState({tiktok})
            }}
            value={this.state.tiktok}
          />
          <View style={styles.sns_c}>
            <Image source={require('../assets/vanhana.jpeg')} style={styles.sns_logo}/>
            <Text style={styles.sns_txt}>반하나</Text>
            {
              (()=>{
                switch(this.state.vanhanaLoading){
                  case 0:
                    return null;
                  case 1:
                    return(
                      <ActivityIndicator style={{marginLeft:20}} size={'small'} color="#000" />
                    )
                  case 2:
                    return(
                      <LottieView style={styles.lottie_check}source={require('../assets/animation/check360.json')} autoPlay={true} loop={false}/>
                    )
                }
              })()
            }
            <TouchableOpacity style={styles.flush} onPress={()=>{
              this.flush('vanhana');
            }}>
              <Text style={styles.flush_txt}>삭제</Text>
            </TouchableOpacity>
          </View>
          <AnimatedTextInput 
            style={{...styles.main_input,borderColor:this.state.vanhanaColor,
              marginLeft:this.state.vanhanaMargin}}
            placeholder='https://vanhana.com/@url'
            // autoFocus={true}
            ref='mainInput'
            onChangeText={(vanhana)=>{
              this.setState({vanhana})
            }}
            value={this.state.vanhana}
          />
        </ScrollView>
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
  flush:{
    position:'absolute',
    top:5,
    right:20,
    width:50,
    height:40,
    justifyContent:'center',
    alignItems:'center'
  },
  flush_txt:{
    fontSize:14,
    color:'#666',
    fontWeight:'bold'
  },
  sns_c:{
    width,
    height:50,
    flexDirection:'row',
    alignItems:'center',
  },
  sns_txt:{
    color:'#000',
    fontSize:22,
    fontWeight:'bold',
    marginLeft:10
  },
  sns_logo:{
    width:30,
    height:30,
    marginLeft:23
  },
  main_coin:{
    fontSize:15,
    alignSelf:'center',
    marginTop:10,
    color:'rgb(140,140,140)'
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
  },
  lottie_check:{
    width:30,
    height:30,
    marginLeft:5
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    sns:state.setinfo.sns
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setsns: (sns)=>{
      dispatch(actions.setsns(sns));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(CategoryScreen);
