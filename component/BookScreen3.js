import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,Animated,TouchableOpacity,ActivityIndicator,ScrollView,FlatList} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL} from '../config';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image'
import Toast from 'react-native-simple-toast';
import Video from 'react-native-video';
import { Tab, Tabs ,ScrollableTab} from 'native-base';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
const STATUSBAR_HEIGHT_R = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return 0;
    } else {
      return 1;
    }
  } catch (err) {
    return 2;
  }
}

const {width,height}=Dimensions.get("window");
class BookScreen extends React.Component {
  scroll = new Animated.Value(0);
  constructor(props){
    super(props);
    var item=this.props.navigation.getParam('item');
    this.state={
      scrollY: new Animated.Value(0),
      imgLoading:false,
      activePage:0,
      currentPage:0,
      follow_state:this.props.follow.indexOf(item.user_id)==-1?false:true,
      price:' ',
    }
    this._getTabY=this._getTabY.bind(this);
    this._getOpacity=this._getOpacity.bind(this);
    this.onScrollEndSnapToEdge=this.onScrollEndSnapToEdge.bind(this);
    this._getBookHeight=this._getBookHeight.bind(this);
    this.following=this.following.bind(this);
    this.unfollowing=this.unfollowing.bind(this);
    this._follow=this._follow.bind(this);
  };
  static navigationOptions = {
    header:null
  };
  followindex=0;
  async following(){
    var follow_temp=this.props.follow;
    if(follow_temp.indexOf(this.state.user_id)==-1){
      follow_temp.unshift(this.state.user_id);
      await this.props.setfollow([])
      this.props.setfollow(follow_temp);
    }
    let data={
      user_id:this.state.user_id,
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
    fetch(`${URL}/following`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.followindex===1){
          this.followindex=0;
        }else if(this.followindex===2){
          this.unfollowing();
        }
      }else{
        await this.setState({
          follow_state:false
        });
        this.followindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async unfollowing(){
    var follow_temp=this.props.follow;
    var f_i=follow_temp.indexOf(this.state.user_id);
    if(f_i!==-1){
      follow_temp.splice(f_i,1);
      await this.props.setfollow([])
      this.props.setfollow(follow_temp);
    }
    let data={
      user_id:this.state.user_id,
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
    fetch(`${URL}/unfollowing`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.followindex===2){
          this.followindex=0;
        }else if(this.followindex===1){
          this.following();
        }
      }else{
        await this.setState({
          follow_state:true
        })
        this.followindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _follow(){
    if(this.state.follow_state===false){
      await this.setState({
        follow_state:true
      })
      if(this.followindex===0){
        this.following();
      }
      this.followindex=1;
    }else{
      await this.setState({
        follow_state:false
      })
      if(this.followindex===0){
        this.unfollowing();
      }
      this.followindex=2;
    }
  }
  async componentDidMount(){
    var item=await this.props.navigation.getParam('item');
    console.log(item);
    await this.setState({
      user_id:item.user_id,
      id:item.id,
      img:item.img
    });
    let data={
      user_id:this.state.user_id      
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getprofile`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        console.log(responseJson);
        this.setState({
          video:responseJson.profile.video,
          intro:responseJson.profile.intro,
          sns:responseJson.profile.sns,
          price:responseJson.profile.price
        });
      }else{
        console.log('get profile error');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _getTabY = () => {
    const scrollY = this.scroll;
    return scrollY.interpolate({
        inputRange: [0, 450,450.001],
        outputRange: [-200,-200,20],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  _getOpacity = () => {
    const scrollY = this.scroll;
    return scrollY.interpolate({
        inputRange: [0, 450,460.001],
        outputRange: [0,0,1],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  _getBookHeight = () => {
    const scrollY = this.scroll;
    return scrollY.interpolate({
        inputRange: [0, 150,250],
        outputRange: [-100,-84,16],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  onScrollEndSnapToEdge = event => {
    console.log('onScrollEndSnapToEdge')
    var scroll=parseInt(JSON.stringify(this.scroll))+this.topheight;
    switch(this.state.activePage){
      case 0:
        if(scroll>=this.height0){
          this.refs._scrollView._component.scrollTo({y: this.height0-this.topheight});
        }
        break;
      case 1:
        if(scroll>this.height1){
          this.refs._scrollView._component.scrollTo({y: this.height1-this.topheight});
        }
        break;
      case 2:
        if(scroll>this.height2){
          this.refs._scrollView._component.scrollTo({y: this.height2-this.topheight});
        }
        break;
      default:
        break;     
    }
  };
  scroll0=0;
  scroll1=0;
  scroll2=0;
  height0=0;
  height1=0;
  height2=0;
  topheight=0;
  hihi='byebye';
  render() {
    const onchangePage=(i)=>{
      var scroll=parseInt(JSON.stringify(this.scroll));
      switch(this.state.activePage){
        case 0:
          this.scroll0=scroll;      
          console.log('onChangePage0 this.scroll0:'+this.scroll0);

          break;
        case 1:
          this.scroll1=scroll;       
          console.log('onChangePage1 this.scroll1:'+this.scroll1);

          break;
        case 2:
          this.scroll2=scroll;        
          console.log('onChangePage2 this.scroll2:'+this.scroll2);

          break;
        default:
          break;     
      }
      switch(i){
        case 0:
          this.refs._scrollView._component.scrollTo({y: this.scroll0});
          console.log('change to 0:'+this.scroll0);
          break;
        case 1:
          this.refs._scrollView._component.scrollTo({y: this.scroll1});
          console.log('change to 1:'+this.scroll1);

          break;
        case 2:
          this.refs._scrollView._component.scrollTo({y: this.scroll2});
          console.log('change to 2:'+this.scroll2);
          break;
        default:
          break;     
      }
      this.setState({
        activePage:i
      })
    }
    const tabY = this._getTabY();
    const opacity = this._getOpacity();
    const bookheight = this._getBookHeight();
    var t_index=false;
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} translucent={true}/>
        <TouchableOpacity style={styles.leftbtn} onPress={()=>{
          this.props.navigation.goBack();
        }}>
          <Image source={require('../assets/left_white.png')} style={{width:24,height:24}}/>
        </TouchableOpacity>
        <Animated.ScrollView 
          style={styles.scorll} 
          nestedScrollEnabled={true}
          scrollEventThrottle={1}
          bounces={false}
          ref='_scrollView'
          onScrollEndDrag={this.onScrollEndSnapToEdge}
          onMomentumScrollEnd={()=>{
            if(Platform.OS==='ios'){
              // this.onScrollEndSnapToEdge()
            }else{
              this.onScrollEndSnapToEdge()
            }
            }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.scroll}}}],
            // {useNativeDriver: true},
          )}
        >
          <View style={styles.scroll_background}>

          </View>
          <View style={styles.scroll_info} onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            this.topheight=height+100;
          }}>
            <View style={styles.scroll_info_header}>
              <TouchableOpacity style={styles.scorll_info_header_img_c}
                activeOpacity={1}
              >
              {
                this.state.img===''?(
                  <Image source={require('../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                ):(
                  <FastImage
                    style={{width:'100%',height:'100%'}}
                    source={{
                        uri: this.state.img,
                        priority: FastImage.priority.normal,
                    }}
                  />
                )
              }
              </TouchableOpacity>
              <View style={styles.scroll_info_header_button_container}>
                <View style={styles.scroll_info_header_button_container_in}>
                  <TouchableOpacity style={styles.scorll_info_header_button1} onPress={()=>{
                    this.props.navigation.navigate('Booking',{
                      book_user_id:this.state.user_id,
                      book_price:this.state.price
                    });
                  }}>
                    <Text style={styles.scorll_info_header_button1_txt}>{`${this.state.price}$ 영상요청`}</Text>
                  </TouchableOpacity>
                  {
                    this.state.follow_state===true?(
                      <TouchableOpacity style={{...styles.scorll_info_header_button2,backgroundColor:'#222',borderColor:'#222'}} onPress={this._follow}>
                        <Text style={{...styles.scorll_info_header_button2_txt,color:'#fff'}}>팔로잉</Text>
                      </TouchableOpacity>
                    ):(
                      <TouchableOpacity style={styles.scorll_info_header_button2} onPress={this._follow}>
                        <Text style={styles.scorll_info_header_button2_txt}>팔로우</Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
              </View>
            </View>
            <View style={styles.scroll_info_main}>
              <View style={{flexDirection:'row',height:30,alignItems:'center'}}>
                <Text style={styles.scroll_info_main_id}>{this.state.id}</Text>
                <TouchableOpacity style={styles.chat} onPress={()=>{
                  if(t_index==false){
                    console.log(this.state.user_id+'/'+this.state.id+'/'+this.state.img)
                    t_index=true;
                    this.props.navigation.push('Talking',{item:{
                      user_id:this.state.user_id,
                      id:this.state.id,
                      img:this.state.img,
                      bedge:0
                    }});
                  }
                  setTimeout(()=>{t_index=false
                    console.log('t_index ==> false');
                  },500);
                }}>
                  <Text style={styles.chat_txt}>메시지</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.scroll_info_main_intro}>{this.state.intro==''?'자기소개를 작성하고 팔로워와 좋아요를 더 많이 얻으세요!':this.state.intro}</Text>
            </View>
            <View style={styles.scroll_info_bottom}>
              <View style={styles.scroll_info_bottom_c}>
                <TouchableOpacity style={styles.scorll_info_bottom_c_item}>
                  <Text style={styles.scorll_info_bottom_c_item_txt_l}>310</Text>
                  <Text style={styles.scorll_info_bottom_c_item_txt_r}>좋아요</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.scorll_info_bottom_c_item}>
                  <Text style={styles.scorll_info_bottom_c_item_txt_l}>320</Text>
                  <Text style={styles.scorll_info_bottom_c_item_txt_r}>팔로잉</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.scorll_info_bottom_c_item}>
                  <Text style={styles.scorll_info_bottom_c_item_txt_l}>150</Text>
                  <Text style={styles.scorll_info_bottom_c_item_txt_r}>팔로우</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Animated.View style={{
            ...styles.scroll_main,
            // top:tabY
          }}>
            <Tabs 
              tabBarUnderlineStyle={{position:'absolute',backgroundColor:'#000',height:2.5}}
              page={this.state.activePage}
              onChangeTab={(em)=>{
                onchangePage(em.i)
              }}
            >
              <Tab heading="동영상" activeTextStyle={{color:'#000'}}
                tabStyle={{backgroundColor:'#fff'}}
                activeTabStyle={{backgroundColor:'#fff'}}
                textStyle={{color:'#999'}}
                activeTextStyle={{color:'#000'}}
              >
                <View onLayout={(event) => {
                  var {x, y, width, height} = event.nativeEvent.layout;
                  this.height0=height;
                }}>
                  <View style={{width:300,height:300,backgroundColor:'red'}}></View>
                  <View style={{width:300,height:300,backgroundColor:'blue'}}></View>
                  <View style={{width:300,height:300,backgroundColor:'red'}}></View>   
                </View>         
              </Tab>
              <Tab heading="보낸 영상" activeTextStyle={{color:'#000'}}
                tabStyle={{backgroundColor:'#fff'}}
                activeTabStyle={{backgroundColor:'#fff'}}
                textStyle={{color:'#999'}}
                activeTextStyle={{color:'#000'}}
              >
                <View onLayout={(event) => {
                  var {x, y, width, height} = event.nativeEvent.layout;
                  this.height1=height;
                }}>
                  <View style={{width:300,height:300,backgroundColor:'blue'}}></View>
                  <View style={{width:300,height:300,backgroundColor:'red'}}></View>
                  <View style={{width:300,height:300,backgroundColor:'blue'}}></View>
                  <View style={{width:300,height:300,backgroundColor:'red'}}></View>
                  <View style={{width:300,height:300,backgroundColor:'blue'}}></View>
                  <View style={{width:300,height:300,backgroundColor:'red'}}></View>  
                </View>

              </Tab>
              <Tab heading="받은 영상" activeTextStyle={{color:'#000'}}
                tabStyle={{backgroundColor:'#fff'}}
                activeTabStyle={{backgroundColor:'#fff'}}
                textStyle={{color:'#999'}}
                activeTextStyle={{color:'#000'}}
              >
                <View onLayout={(event) => {
                  var {x, y, width, height} = event.nativeEvent.layout;
                  this.height2=height;
                }}>
                  <View style={{width:300,height:300,backgroundColor:'blue'}}></View>
                  <View style={{width:300,height:300,backgroundColor:'red'}}></View>
                </View>
              </Tab>
            </Tabs>
          </Animated.View>
        </Animated.ScrollView>
        <Animated.View style={{
            position:'absolute',
            width,
            height:STATUSBAR_HEIGHT_R+55,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            top:tabY,
            opacity
          }}>
          <TouchableOpacity onPress={()=>{
            onchangePage(0);
          }}
          style={styles.indicator}
          >
            <Text style={this.state.activePage===0?styles.indicator_txt_active:styles.indicator_txt}>동영상</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            onchangePage(1);
          }}
          style={styles.indicator}
          >
            <Text style={this.state.activePage===1?styles.indicator_txt_active:styles.indicator_txt}>보낸 영상</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            onchangePage(2)
          }}
          style={styles.indicator}
          >
            <Text style={this.state.activePage===2?styles.indicator_txt_active:styles.indicator_txt}>받은 영상</Text>
          </TouchableOpacity>
        </Animated.View>
        <AnimatedTouchableOpacity style={{...styles.bookBtn,bottom:bookheight}}>
          <Text style={styles.bookBtn_txt}>10$ 영상요청</Text>
        </AnimatedTouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },
  leftbtn:{
    position:'absolute',
    width:40,
    height:40,
    backgroundColor:'rgba(0,0,0,0.4)',
    top:STATUSBAR_HEIGHT_R+8,
    left:8,
    zIndex:30,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:40,
  },
  scorll:{
    flex:1,
    backgroundColor:'blue'
  },
  scroll_background:{
    width,
    height:130,
    backgroundColor:'green'
  },
  scroll_info:{
    width:width,
    backgroundColor:'#fff',
    paddingBottom:5
  },
  scroll_info_header:{
    width,
    height:100,
    backgroundColor:'#fff',
    flexDirection:'row'
  },
  scorll_info_header_img_c:{
    width:100,
    height:100,
    backgroundColor:'#fff',
    marginLeft:15,
    marginTop:-10,
    borderRadius:100,
    borderWidth:4,
    borderColor:'#fff',
    overflow:'hidden'
  },
  scroll_info_header_button_container:{
    flex:1,
    backgroundColor:'#fff'
  },
  scroll_info_header_button_container_in:{
    width:'100%',
    height:'50%',
    backgroundColor:'#fff',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:10
  },
  scorll_info_header_button1:{
    flex:0.6,
    paddingHorizontal:20,
    backgroundColor:'#ea1d5d',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:2
  },
  scorll_info_header_button2:{
    paddingHorizontal:20,
    backgroundColor:'#fff',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:20,
    borderWidth:1,
    borderColor:'rgb(200,200,200)',
    borderRadius:2,
  },
  scorll_info_header_button3:{
    paddingHorizontal:20,
    // backgroundColor:'blue',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'row'
  },
  scorll_info_header_button4:{
    paddingHorizontal:20,
    // backgroundColor:'orange',
    height:40,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:20,
    flexDirection:'row'
  },
  scorll_info_header_button1_txt:{
    fontSize:15,
    color:'#fff',
    fontWeight:'bold'
  },
  scorll_info_header_button2_txt:{
    fontSize:15,
    color:'#222',
    fontWeight:'bold'
  },
  scroll_info_main:{
    width:width-20,
    marginLeft:10,
    minHeight:70,
    maxHeight:90,
    paddingBottom:10,
    backgroundColor:'#fff',
    borderBottomWidth:0.5,
    borderColor:"rgba(150,150,150,0.3)"
  },
  scroll_info_main_id:{
    color:'#000',
    fontSize:26,
    marginLeft:10,
    fontWeight:'bold'
  },
  chat:{
    height:'100%',
    justifyContent:'center',
    paddingLeft:5,
    paddingRight:5,
    marginLeft:10
  },
  chat_txt:{
    color:'green',
    fontWeight:'bold',
    fontSize:16
  },
  scroll_info_main_intro:{
    fontSize:14,
    color:'#222',
    marginLeft:10,
    marginTop:6,
  },
  scroll_info_bottom:{
    width,
    height:50,
    backgroundColor:'#fff'
  },
  scroll_info_bottom_c:{
    width,
    height:50,
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center'
  },
  scorll_info_bottom_c_item:{
    height:40,
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:10,
  },
  scorll_info_bottom_c_item_txt_l:{
    color:'#000',
    fontSize:16,
    fontWeight:'bold'
  },
  scorll_info_bottom_c_item_txt_r:{
    color:'#555',
    fontSize:14,
    marginLeft:5
  },
  scroll_main:{
    flex:1,
    backgroundColor:'#fff',
    width,
    paddingBottom:10
  },
  indicator:{
    height:55,
    // backgroundColor:'blue',
    marginTop:STATUSBAR_HEIGHT_R,
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:15
  },
  indicator_txt_active:{
    fontSize:16,
    color:'#fff',
    fontWeight:'bold'
  },
  indicator_txt:{
    fontSize:15,
    color:'rgba(230,230,230,0.8)',
    fontWeight:'bold'
  },
  tab1_write:{
    width:width-60,
    height:40,
    backgroundColor:'#111',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    marginVertical:10,
    borderRadius:3,
  },
  tab1_write_txt:{
    color:'#fff',
    fontSize:15,
    fontWeight:'600'
  },
  write_c:{
    position:'absolute',
    width:53,
    height:53,
    backgroundColor:'#fff',
    bottom:25,
    right:20,
    borderRadius:50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    
    elevation: 2,
    justifyContent:'center',
    alignItems:'center'
  },
  bookBtn:{
    width:width-56,
    height:48,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#ea1d5d',
    position:'absolute',
    bottom:24,
    borderRadius:5
  },
  bookBtn_txt:{
    color:'#fff',
    fontSize:18,
    fontWeight:'bold'
  }
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
    pwindex:state.setinfo.pwindex,
    img:state.setinfo.img,
    video:state.setinfo.video,
    intro:state.setinfo.intro,
    sns:state.setinfo.sns,
    price:state.setinfo.price,
    follow:state.setinfo.follow,
    follower:state.setinfo.follower,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setall: (_id,id,user_id,coin,logintype,pwindex)=>{
      dispatch(actions.setall(_id,id,user_id,coin,logintype,pwindex));
    },
    setitr:(itr)=>{
      dispatch(actions.setitr(itr))
    },
    setkit:(ph,email)=>{
      dispatch(actions.setkit(ph,email))
    },
    signout: ()=>{
      dispatch(actions.signout());
    },
    backhandler_f: (boolean)=>{
      dispatch(actions.backhandler(boolean));
    },
    setimg: (img)=>{
      dispatch(actions.setimg(img));
    },
    setvideo: (video)=>{
      dispatch(actions.setvideo(video));
    },
    setintro: (intro)=>{
      dispatch(actions.setintro(intro));
    },
    setprice: (price)=>{
      dispatch(actions.setprice(price));
    },
    setfollow: (follow)=>{
      dispatch(actions.setfollow(follow));
    },
    setfollower: (follower)=>{
      dispatch(actions.setfollower(follower));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(BookScreen);