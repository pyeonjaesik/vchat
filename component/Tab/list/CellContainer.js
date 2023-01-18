import React,{Component} from 'react';
import {View, StyleSheet,Dimensions,Image,Text,TouchableOpacity,Platform,AppState} from 'react-native';
import FastImage from 'react-native-fast-image'
import Video from 'react-native-video';
import { Animated, Easing } from 'react-native';
import LottieView from 'lottie-react-native';
import {URL,_isConnected, STATUSBAR_HEIGHT} from '../../../config';


const {width,height}=Dimensions.get("window");
let containerCount = 0;
export default class CellContainerPause extends React.Component {
  constructor(props) {
    super(props);
    this._containerId = containerCount++;
    this.state={
      pauseIndex:false,
      progress:this.props.item.like===true?new Animated.Value(1):new Animated.Value(0),
      like:this.props.item.like,
      ln:this.props.item.ln,
      path:'',
      info:{
        width:100,
        height:190
      },
      numberOfLines:4,
      view:true,
      playing:-1
    }
    console.log('constructor'+this.props.index)

    this.love=this.love.bind(this);
    this.loving=this.loving.bind(this);
    this.unloving=this.unloving.bind(this);  
    this._postVIDEO=this._postVIDEO.bind(this);
    this._read=this._read.bind(this);
  }
  path_name='';
  likeindex=0;
  refreshIndex=0;
  _timefunc(updatetime){
    var d1 = new Date(parseInt(Date.now()));
    var d1y=d1.getFullYear();
    var d1m=d1.getMonth()+1;
    var d1d=d1.getDate();
    var d1time=`${d1y}${d1m}${d1d}`;
    var d2 = new Date(updatetime);
    var d2y=d2.getFullYear();
    var d2m=d2.getMonth()+1;
    var d2d=d2.getDate();
    var d2time=`${d2y}${d2m}${d2d}`;
    if(d1time==d2time){
      var time=parseInt(Date.now())-updatetime;
      var h=d2.getHours();
      var m=d2.getMinutes();
      if(m<10){
        m='0'+m;  
      }    
      if(h>=13){
        h=' 오후 '+(h-12)+':'+m;  
      }else if(h>0){
        h=' 오전 '+h+':'+m;  
      }else{
        h=' 오후 '+'12'+':'+m;  
      }
      time=h;
    }else{
      var time=`${d2m}월 ${d2d}일`;
    }
    return time;
  }
  currentIndex=-1;
  async componentWillReceiveProps(nextProps) {
    if(this.refreshIndex!=nextProps.refreshIndex){
      this.refreshIndex=nextProps.refreshIndex
      await this.setState({pauseIndex:false});
      this.setState({pauseIndex:true});
    }
    if(this.currentIndex!=this.props.index){
      console.log('rerender:'+this.props.index);
      this.setState({
        progress:this.props.item.like===true?new Animated.Value(1):new Animated.Value(0),
        like:this.props.item.like,
        ln:this.props.item.ln,
      })
      this.currentIndex=this.props.index;
    }
  }
  _postVIDEO = () =>{
    console.log('_post video');
    this.props.navigation.navigate('Post',{
      personList:[{
        user_id:this.props.item.user_id,
        img:this.props.item.profile.img,
        id:this.props.item.profile.id
      }]
    });
  }
  async _read(){
    if(this.props.item.read.indexOf(this.props.user_id)!=-1){
      return;
    }
    var isConnected=await _isConnected();
    if(!isConnected){
      return;
    }
    let data={
      video_id:this.props.item.post_id,
      _id:this.props._id
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/videoread`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100){

      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  loving(){
    this.props._love(this.props.item.post_id)
    let data={
      post_id:this.props.item.post_id,
      _id:this.props._id
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/loving`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.likeindex===1){
          this.likeindex=0;
        }else if(this.likeindex===2){
          this.unloving();
        }
      }else{
        await this.setState(prev=>({
          like:false,
          ln:prev.ln-1
        }));
        await Animated.timing(this.state.progress, {
          toValue: 0,
          duration: 0,
          easing: Easing.linear,
        }).start();
        this.likeindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  unloving(){
    this.props._unlove(this.props.item.post_id)
    let data={
      post_id:this.props.item.post_id,
      _id:this.props._id
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/unloving`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.likeindex===2){
          this.likeindex=0;
        }else if(this.likeindex===1){
          this.loving();
        }
      }else{
        await this.setState(prev=>({
          like:true,
          ln:prev.ln+1
        }))
        await Animated.timing(this.state.progress, {
          toValue: 1,
          duration: 0,
          easing: Easing.linear,
        }).start();
        this.likeindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async love(){
    if(this.state.like===false){
      await this.setState(prev=>({
        like:true,
        ln:prev.ln+1
      }))
      Animated.timing(this.state.progress, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
      }).start();
      if(this.likeindex===0){
        this.loving();
      }
      this.likeindex=1;
    }else{
      await this.setState(prev=>({
        like:false,
        ln:prev.ln-1
      }))
      Animated.timing(this.state.progress, {
        toValue: 0,
        duration: 0,
        easing: Easing.linear,
      }).start();
      if(this.likeindex===0){
        this.unloving();
      }
      this.likeindex=2;
    }
  }
  readIndex=[]
  render(){
    if(this.props.index===Math.round(this.props.scrollY)){
      if(this.readIndex.indexOf(this.props.item.post_id)===-1){
        this.readIndex.unshift(this.props.item.post_id);
        this._read();
        this.props._highIndex(this.props.index)
      }
    }
    if(this.state.view==false){
      return <View style={{width,height:this.props.height,backgroundColor:'#000'}}></View>
    }
    return(
      <TouchableOpacity style={{...styles.container,height:this.props.height}} activeOpacity={1}
        onLongPress={()=>{
          this.props._dialogV(true,this.props.item.user_id,this.props.item.post_id);
        }}
        onPress={()=>{
          this.setState(prev=>({
            playing:prev.playing==this.props.index?-1:this.props.index
          }))
        }}
      >
        {/* /data/user/0/com.yomencity.puppy/files/awsczpRJC.mp4.mp4 */}
        <Video source={{uri: this.props.item.roll}}   
          // muted={(()=>{
          //   return this.props.paused===0&&this.props.index===Math.round(this.props.scrollY)?false:true;
          // })()}
          onEnd={()=>{
            alert('a')
            if(this.readIndex===false){
              this.readIndex=true;
              this._read();
            }
          }}
          repeat={true}
          rate={(()=>{
            if(this.state.pauseIndex===false){
              return 1;
            }else{
              if(this.state.playing!=this.props.index){
                return this.props.paused===0&&this.props.index===Math.round(this.props.scrollY)?1:0;
              }else{
                return 0;
              }
            }
          })()}  
          resizeMode={(()=>{
            var ratio=this.props.height/width;
            var ratio2=this.state.info.height/this.state.info.width;
            var r_index=ratio2/ratio;
            if(r_index>=0.85){
              return 'cover';
            }else{
              return 'contain'
            }
          })()}
          onLoad={async (info)=>{
            console.log(info);
            console.log(this.props.index)
            await this.setState({
              pauseIndex:true,
              info:{
                width:info.naturalSize.width,
                height:info.naturalSize.height
              }
            });

          }}
          ignoreSilentSwitch={"ignore"}
          style={styles.backgroundVideo} 
        />
        <View style={{...styles.sidebar,bottom:196+this.props.bottom}}>
          <TouchableOpacity style={styles.profileImg_c} onPress={()=>{
            if(this.props.item.user_id==this.props.user_id){
              this.props.navigation.navigate('MyBook');
            }else{
              this.props.navigation.navigate('Book',{
                item:{
                  user_id:this.props.item.user_id,
                  img:this.props.item.profile.img,
                  id:this.props.item.profile.id
                }
              });
            }
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
          {
            this.state.like===false?(
              <TouchableOpacity style={styles.sidebar_love_c} activeOpacity={1} onPress={()=>{
                this.love();
              }}>
                <Image style={{width:36,height:36,opacity:0.9}} source={require('../../../assets/love.png')}/>
              </TouchableOpacity>
            ):(
              <TouchableOpacity style={styles.sidebar_love_c} activeOpacity={1} onPress={()=>{
                this.love();
              }}>
                <LottieView style={styles.like_lottie} source={require('../../../assets/animation/love.json')} progress={this.state.progress} resizeMode="cover"/>
              </TouchableOpacity>
            )
          }
            <Text style={{color:'#fff',fontSize:12,fontWeight:'bold'}}>{this.state.ln}</Text>
            <TouchableOpacity style={styles.sidebar_ripple_c} onPress={async ()=>{
              this.props._comment(true,this.props.item.post_id,this.props.item.user_id);
            }}>
              <Image style={{width:44,height:44,opacity:0.9}} source={require('../../../assets/ripple.png')}/>
            </TouchableOpacity>
          <Text style={{color:'#fff',fontSize:12,fontWeight:'bold'}}>{this.props.item.cn}</Text>
          {
            this.props.user_id==this.props.item.user_id?(
              null
            ):(
              <TouchableOpacity style={styles.sidebar_ripple_c} onPress={async ()=>{
              this._postVIDEO();
            }}>
              <Image style={{width:30,height:30,opacity:0.9}} source={require('../../../assets/send_paper.png')}/>
              {/* <Text style={{color:'#fff',fontSize:12,fontWeight:'bold',marginTop:10}}>회신</Text> */}
            </TouchableOpacity>
            )
          }
        </View>
        <TouchableOpacity style={{position:'absolute',bottom:56+this.props.bottom,right:8,width:56,height:56,justifyContent:'center',alignItems:'center',flexDirection:'row'}} onPress={()=>{
          this.props._ripple(true,this.props.item.post_id);
        }}>
          <Image style={{width:24,height:24,opacity:0.8}} source={require('../../../assets/play_small.png')}/>
          <Text style={{color:"rgba(255,255,255,0.8)",fontSize:12,marginLeft:4,fontWeight:'600'}}>{this.props.item.read.length}</Text>
        </TouchableOpacity>
        <View style={{...styles.bottom,bottom:this.props.bottom+56}}>
          <View style={{flexDirection:'row'}}> 
          <TouchableOpacity style={styles.bottom_id_c} onPress={()=>{
            this.props.navigation.navigate('Book',{
              item:{
                user_id:this.props.item.user_id,
                img:this.props.item.profile.img,
                id:this.props.item.profile.id
              }
            });
          }}>
            <Text style={styles.bottom_id_txt}>{this.props.item.profile.id}</Text>
          </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.bottom_text_c} activeOpacity={1} onPress={()=>{
            if(this.state.numberOfLines===4){
              this.setState({
                numberOfLines:30
              })
            }else{
              this.setState({
                numberOfLines:4
              })
            }
          }}>
            {
              this.props.item.text.length>0?(
                <Text numberOfLines={this.state.numberOfLines} style={styles.bottom_text_txt}>{this.props.item.text}</Text>
              ):(null)
            }
            <Text style={styles.bottom_ct}>{this._timefunc(this.props.item.ct)}</Text>
            <View style={{width:width-90,minHeight:0,maxHeight:200,flexWrap:'wrap',flexDirection:'row',paddingLeft:8,paddingBottom:16,paddingTop:8}}>
              {
                (()=>{
                  let personList=this.props.item.personList;
                  var personListJSX=[];
                  personList.map((x)=>{
                    var u_i=this.props.user_arr.findIndex(em=>em.user_id==x);
                    if(u_i!=-1){
                      personListJSX.push(
                        <TouchableOpacity style={{...styles.personList_c,flexDirection:'row',backgroundColor:x==this.props.user_id?'rgba(0,200,0,0.7)':'rgba(0,0,0,0.6)'}}
                          key={x}  
                          onPress={()=>{
                            if(this.props.user_id==this.props.user_arr[u_i].user_id){
                              var to='MyBook';
                            }else{
                              var to='Book';
                            }
                            this.props.navigation.navigate(to,{
                              item:{
                                id:this.props.user_arr[u_i].id,
                                user_id:this.props.user_arr[u_i].user_id,
                                img:this.props.user_arr[u_i].img
                              }
                            })
                          }}
                        >
                          <Text style={{...styles.groupList_txt,marginLeft:1}}>{`${this.props.user_arr[u_i].id}`}</Text>
                        </TouchableOpacity>
                      )
                    }
                  });
                  return personListJSX;
                })()
              }
              {
                (()=>{
                  let groupList=this.props.item.groupList;
                  let groupListJSX=groupList.map((x)=>{
                    return(
                      <TouchableOpacity style={{...styles.groupList_c,flexDirection:'row',backgroundColor:this.props.group.findIndex(em=>em.id==x)!=-1?'rgba(234,29,93,0.7)':'rgba(0,0,0,0.6)'}}
                        key={x}  
                        onPress={()=>{
                          this.props.navigation.navigate('Group',{
                            id:x
                          })
                        }}
                      >
                        <Image style={{width:12,height:12}} source={require('../../../assets/at.png')}/>
                        <Text style={{...styles.groupList_txt,marginLeft:3}}>{`${x}`}</Text>
                      </TouchableOpacity>
                    )
                  })
                  return groupListJSX;
                })()
              }
            </View>
          </TouchableOpacity>
        </View>
        {
          this.state.playing==this.props.index?(
            <TouchableOpacity style={{width:88,height:88}} onPress={()=>{
              this.setState(prev=>({
                playing:prev.playing==this.props.index?-1:this.props.index
              }))
            }}>
              <Image style={{width:'100%',height:'100%',opacity:0.5}} source={require('../../../assets/play.png')}/>
            </TouchableOpacity>
          ):(null)
        }
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:width,
    backgroundColor:'#000',
    justifyContent:'center',
    alignItems:'center'
  },
  backgroundVideo:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:'#000'
  },
  sidebar:{
    position:'absolute',
    right:0,
    bottom:140,
    width:70,
    height:230,
    alignItems:'center',
  },
  profileImg_c:{
    width:52,
    height:52,
    // backgroundColor:'blue',
    overflow:'hidden',
    borderRadius:56,
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.8)',
    marginBottom:20
  },
  sidebar_love_c:{
    width:48,
    height:48,
    justifyContent:'center',
    alignItems:'center',
  //  backgroundColor:'green',
    marginBottom:2
  },
  sidebar_ripple_c:{
    width:48,
    height:48,
    justifyContent:'center',
    alignItems:'center',
    marginTop:8,
    // backgroundColor:'yellow',
    marginBottom:2
  },
  like_lottie:{
    width:60,
    height:60,
    marginLeft:0,
    marginRight:0
  },
  bottom:{
    position:'absolute',
    left:0,
    bottom:0,
    width:width-90,
    minHeight:50,
  },
  bottom_id_c:{
    justifyContent:'center',
    // backgroundColor:'red',
    height:24,
    paddingHorizontal:15,
  },
  bottom_id_txt:{
    fontWeight:"bold",
    color:'#fff',
    fontSize:14,
  },
  bottom_text_c:{
  },
  bottom_text_txt:{
    color:'#fff',
    paddingHorizontal:15,
  },
  bottom_ct:{
    color:'rgba(255,255,255,0.8)',
    fontSize:12,
    paddingHorizontal:13,
    marginTop:4
  },
  groupList_c:{
    paddingHorizontal:12,
    backgroundColor:'rgba(0,0,0,0.6)',
    marginLeft:8,
    marginBottom:4,
    borderRadius:20,
    height:25,
    alignItems:'center'
  },
  personList_c:{
    paddingHorizontal:12,
    backgroundColor:'rgba(0,0,0,0.6)',
    marginLeft:8,
    marginBottom:4,
    borderRadius:20,
    height:25,
    alignItems:'center'
  },
  groupList_txt:{
    fontSize:12,
    color:'#fff',
  }
})