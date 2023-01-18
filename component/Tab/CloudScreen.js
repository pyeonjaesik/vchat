import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,Animated,TouchableOpacity,ActivityIndicator,ScrollView,FlatList} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import Header from '../header/Header'
import {URL} from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image'
import Toast from 'react-native-simple-toast';
import Video from 'react-native-video';
import StarRating from '../func/StarRating';
import { Tab, Tabs ,ScrollableTab} from 'native-base';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
const STATUSBAR_HEIGHT_R = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;
const AnimatedTab = Animated.createAnimatedComponent(Tab);

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
class ProfileScreen extends React.Component {
  scroll = new Animated.Value(0);
  headerY;
  constructor(props){
    super(props);
    this.state={
      scrollY: new Animated.Value(0),
      imgLoading:false,
      activePage:0,
      currentPage:0
    }
    this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, 10), -1);

    this._postIMG=this._postIMG.bind(this);
    this._postVIDEO=this._postVIDEO.bind(this);

    this._getTabY=this._getTabY.bind(this);
    this._getOpacity=this._getOpacity.bind(this);
  };
  _postVIDEO = (roll) =>{
    console.log('_post video');
    this.props.setvideo(roll.path);
    let formData = new FormData();
    formData.append("file", {
      uri: roll.path,
      type: roll.mime,
      name: 'profileVideo',
    });
    formData.append('_id',this.props._id);
    const options = {
      method: 'POST',
      body: formData
    };
    fetch(`${URL}/uploadprofileVideo`, options)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status===100){
        // this.setState({
        //   imgLoading:false
        // })
        Toast.show('동영상을 정상적으로 업로드 하였습니다.')
      }else{
        Toast.show('동영상 업로드중 문제가 발생하였습니다.');
      }

    })
    .catch((error) => {
      console.error(error);
    });
  }
  _postIMG = (roll) =>{
    this.props.setimg(roll.path);
    let formData = new FormData();
    formData.append("file", {
      uri: roll.path,
      type: roll.mime,
      name: 'profileImg',
    });
    formData.append('_id',this.props._id);
    const options = {
      method: 'POST',
      body: formData
    };
    fetch(`${URL}/uploadprofileimg`, options)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status===100){
        this.setState({
          imgLoading:false
        })
        Toast.show('이미지를 정상적으로 업로드 하였습니다.')
      }else{
        Toast.show('이미지 업로드중 문제가 발생하였습니다.');
      }

    })
    .catch((error) => {
      console.error(error);
    });
  }
  _getTabY = () => {
    const {scrollY} = this.state;
    return scrollY.interpolate({
        inputRange: [0, 450,450.001],
        outputRange: [-200,-200,0],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  _getOpacity = () => {
    const {scrollY} = this.state;
    return scrollY.interpolate({
        inputRange: [0, 450,460.001],
        outputRange: [0,0,1],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  }; 
  render() {
    const tabY = this._getTabY();
    const opacity = this._getOpacity();
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} translucent={true}/>
        <Animated.View style={{position:'absolute',width,height:STATUSBAR_HEIGHT_R,backgroundColor:'rgba(0,0,0,0.1)',zIndex:20}}/>
        <Animated.ScrollView 
          style={styles.scorll} 
          nestedScrollEnabled={true}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
          )}
        >
          <View style={styles.scroll_background}>
          </View>
          <View style={styles.scroll_info}>
            <View style={styles.scroll_info_header}>
              <TouchableOpacity style={styles.scorll_info_header_img_c}>
              {
                this.props.img===''?(
                  <Image source={require('../../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                ):(
                  <FastImage
                    style={{width:'100%',height:'100%'}}
                    source={{
                        uri: this.props.img,
                        priority: FastImage.priority.normal,
                    }}
                  />
                )
              }
              </TouchableOpacity>
              <View style={styles.scroll_info_header_button_container}>
                <View style={styles.scroll_info_header_button_container_in}>
                  <TouchableOpacity style={styles.scorll_info_header_button1}>
                    <Text style={styles.scorll_info_header_button1_txt}>프로필 편집</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.scorll_info_header_button2}>
                    <Text style={styles.scorll_info_header_button2_txt}>팔로우</Text>
                  </TouchableOpacity>
                </View>
                {/* <View style={styles.scroll_info_header_button_container_in}>
                  <TouchableOpacity style={styles.scorll_info_header_button3}>
                    <Text style={styles.scorll_info_bottom_c_item_txt_l}>4.8</Text>
                    <Text style={styles.scorll_info_bottom_c_item_txt_r}>평점</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.scorll_info_header_button4}>
                    <Text style={styles.scorll_info_bottom_c_item_txt_l}>3시간</Text>
                    <Text style={styles.scorll_info_bottom_c_item_txt_r}>응답시간</Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            </View>
            <View style={styles.scroll_info_main}>
              <Text style={styles.scroll_info_main_id}>{this.props.id}</Text>
              <Text style={styles.scroll_info_main_intro}>{this.props.intro==''?'자기소개를 작성하고 팔로워와 좋아요를 더 많이 얻으세요!':this.props.intro}</Text>
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
                this.setState({
                  activePage:em.i
                })
              }}
            >
              <Tab heading="동영상" activeTextStyle={{color:'#000'}} 
                tabStyle={{backgroundColor:'#fff'}}
                activeTabStyle={{backgroundColor:'#fff'}}
                style={{
                margniTop:100,
                // top:tabY_m
                transform: [{translateY: 0}],

                }}>
                <View style={{width,height:300,backgroundColor:'blue'}}></View>
                <View style={{width,height:300,backgroundColor:'red'}}></View>
                <View style={{width,height:300,backgroundColor:'blue'}}></View>
                <View style={{width,height:300,backgroundColor:'red'}}></View>
                <View style={{width,height:300,backgroundColor:'blue'}}></View>
                <View style={{width,height:300,backgroundColor:'red'}}></View>
              </Tab>
              <Tab heading=" 영상" activeTextStyle={{color:'#000'}}
                tabStyle={{backgroundColor:'#fff'}}
                activeTabStyle={{backgroundColor:'#fff'}}
              >
                <View style={{width:300,height:300,backgroundColor:'blue'}}></View>
                <View style={{width:300,height:300,backgroundColor:'red'}}></View>
              </Tab>
              <Tab heading="요청 영상" activeTextStyle={{color:'#000'}}
                tabStyle={{backgroundColor:'#fff'}}
                activeTabStyle={{backgroundColor:'#fff'}}
              >
                <View style={{width:300,height:300,backgroundColor:'blue'}}></View>
                <View style={{width:300,height:300,backgroundColor:'red'}}></View>
              </Tab>
            </Tabs>
          </Animated.View>
        </Animated.ScrollView>
        <Animated.View style={{
            position:'absolute',
            width,
            height:STATUSBAR_HEIGHT_R+55,
            flexDirection:'row',
            top:tabY,
            opacity
          }}>
          <TouchableOpacity onPress={()=>{
            this.setState({
              activePage:0
            })
          }}
          style={styles.indicator}
          >
            <Text style={this.state.activePage===0?styles.indicator_txt_active:styles.indicator_txt}>동영상</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this.setState({
              activePage:1
            })
          }}
          style={styles.indicator}
          >
            <Text style={this.state.activePage===1?styles.indicator_txt_active:styles.indicator_txt}>제작 영상</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            this.setState({
              activePage:2
            })
          }}
          style={styles.indicator}
          >
            <Text style={this.state.activePage===2?styles.indicator_txt_active:styles.indicator_txt}>요청 영상</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
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
    borderColor:"rgba(100,100,100,0.3)"
  },
  scroll_info_main_id:{
    color:'#000',
    fontSize:26,
    marginLeft:10,
    fontWeight:'bold'
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
    width:width/3,
    height:55,
    // backgroundColor:'blue',
    marginTop:STATUSBAR_HEIGHT_R,
    justifyContent:'center',
    alignItems:'center'
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
    price:state.setinfo.price
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
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(ProfileScreen);