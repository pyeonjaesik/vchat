import React from 'react';
import { StyleSheet, View, Dimensions,Platform,Text,Image,StatusBar,Animated,TouchableOpacity,FlatList,Easing} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import {URL,STATUSBAR_HEIGHT,requestCameraPermission} from '../../config';
import { NavigationEvents } from 'react-navigation';
import ProfileMyPerson from './list/ProfileMyPerson';
import ProfileMe from './list/ProfileMe';
import ProfileMyGroup from './list/ProfileMyGroup';
import { Tab, Tabs ,ScrollableTab} from 'native-base';

import Swiper from 'react-native-swiper'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

//ripple 로 바꾸기
const {width,height}=Dimensions.get("window");
class ProfileScreen extends React.Component {
  constructor(props){
    super(props);
    this.state={
      scrollY: new Animated.Value(0),
      barStyle:'dark-content',
      index:0,
      activePage:0,
      currentPage:0,
      height:0
    }
    this._getBlack=this._getBlack.bind(this);
    this._getElevation=this._getElevation.bind(this);
  };
  _getBlack = () => {
    const {scrollY} = this.state;
    return scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: ['rgba(0,0,0,0)','rgba(0,0,0,1)'],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  _getElevation = () => {
    const {scrollY} = this.state;
    return scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0,3],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  };
  btn_index=true;
  render() {
    const black = this._getBlack();
    const elevation = this._getElevation();
    return (
      <View style={styles.container} onLayout={(event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        this.page_height=height;
        this.setState({height});
      }}>
        <NavigationEvents
          onWillFocus={payload => {
            this.props.page_f('Profile');
          }}
          onDidFocus={payload => {
            this.props.barStyle_f('dark-content');
            this.setState({
              paused:false
            })
          }}
          onWillBlur={payload => {
            this.setState({
              paused:true
            })
          }}
        />
        <StatusBar barStyle={this.props.barStyle} backgroundColor={'transparent'} translucent={true}/>
        {/* <View style={{width,height:STATUSBAR_HEIGHT,backgroundColor:'rgba(0,0,0,0)',zIndex:20}}/> */}
        <Animated.View style={Platform.OS === 'ios' ?{
            ...styles.header,
            shadowColor: black,
            // backgroundColor:'blue'
          }:{
            ...styles.header,
            elevation
          }}>
          <View style={styles.header_main}>
            <TouchableOpacity style={styles.header_button_c} activeOpacity={1} onPress={()=>{
              this.setState({
                activePage:0,
              })

            }}>
              <Text style={this.state.activePage==0?styles.header_button_txt_active:styles.header_button_txt}>친구</Text>
            </TouchableOpacity>
            <View style={{width:2,height:12,backgroundColor:'rgba(0,0,0,0.2)'}}/>
            <TouchableOpacity style={styles.header_button_c} activeOpacity={1} onPress={()=>{
              this.setState({
                activePage:1,
              })
            }}>
              <Text style={this.state.activePage==1?styles.header_button_txt_active:styles.header_button_txt}>그룹</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{width:56,height:56,position:'absolute',right:4,bottom:4,justifyContent:'center',alignItems:'center'}} onPress={()=>{
            this.props.navigation.navigate('Reco',{activePage:this.state.activePage})
          }}>
            <Image  style={{width:40,height:40,opacity:0.8}} source={require('../../assets/searchBtn.png')}/>
          </TouchableOpacity>
        </Animated.View>
        <Tabs 
        style={{
          position:'absolute',
          top:-50,
          width,
          height:this.state.height-this.props.bottom-6
        }}
              tabBarUnderlineStyle={{position:'absolute',backgroundColor:'#000',height:2.5}}
              page={this.state.activePage}
              onChangeTab={(em)=>{
                this.setState({
                  activePage:em.i
                })
              }}
            >
              <Tab heading="동영상" activeTextStyle={{color:'#000'}}
                tabStyle={{backgroundColor:'#fff',height:10}}
                activeTabStyle={{backgroundColor:'#fff',height:10}}
                textStyle={{color:'#999'}}
                activeTextStyle={{color:'#000'}}
              >
                <View style={{flex:1,backgroundColor:'#fff'}}>
              <AnimatedFlatList
                  scrollEventThrottle={16}
                  bounces={false}
                  showsVerticalScrollIndicator={true}
                  overScrollMode={'never'}
                  style={{
                    height:height,
                    zIndex: 10,
                  }}
                  contentContainerStyle={{paddingTop: STATUSBAR_HEIGHT+56,paddingBottom:24}}
                  data={(()=>{
                    let follow=this.props.follow.map(x=>x);
                    // follow.sort((a,b)=>{
                    //   return a.id < b.id? -1: a.id>b.id?1:0
                    // });
                    follow.unshift({
                      user_id:this.props.user_id,
                      id:this.props.id,
                      img:this.props.img,
                      uid:this.props.uid
                    });
                    return follow;
                  })()}
                renderItem={(item)=>{
                  if(this.props.user_id==item.item.user_id){
                    return <ProfileMe item={item.item} navigation={this.props.navigation} />
                  }else{
                    return <ProfileMyPerson item={item.item} navigation={this.props.navigation} />

                  }
                }}
                  keyExtractor={(item, i) => i.toString()}
                  onScroll={Animated.event(
                    [
                      {
                        nativeEvent: {contentOffset: {y: this.state.scrollY}}
                      }
                    ]
                  )}
              />  
              {
                this.props.follow.length==0?(
                  <View style={{position:'absolute',height:320,width,top:((this.state.height-STATUSBAR_HEIGHT-112-this.props.bottom)*0.5-80),left:0,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:16,color:'rgba(0,0,0,0.7)'}}>친구를 추가해 보세요.</Text>
                  </View>
                ):(null)
              } 
              </View>   
              </Tab>
              <Tab heading="보낸 영상" activeTextStyle={{color:'#000'}}
                tabStyle={{backgroundColor:'#fff'}}
                activeTabStyle={{backgroundColor:'#fff'}}
                textStyle={{color:'#999'}}
                activeTextStyle={{color:'#000'}}
              >
                <View style={{flex:1,backgroundColor:'#fff'}}>
                  <AnimatedFlatList
                    scrollEventThrottle={16}
                    bounces={false}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{paddingTop: STATUSBAR_HEIGHT+56,paddingBottom:24}}

                    overScrollMode={'never'}
                    style={{
                      flex:1,
                      zIndex: 10,
                    }}
                    data={(()=>{
                      let group=this.props.group.map(x=>x);
                      // group.sort((a,b)=>{
                      //   return a.id < b.id? -1: a.id>b.id?1:0
                      // });
                      return group;
                    })()}
                  renderItem={(item)=>{
                    return <ProfileMyGroup item={item.item} navigation={this.props.navigation}/>
                  }}
                    keyExtractor={(item, i) => i.toString()}
                    onScroll={Animated.event(
                      [
                        {
                          nativeEvent: {contentOffset: {y: this.state.scrollY}}
                        }
                      ]
                    )}
                />
                  {
                    this.props.group.length==0?(
                      <View style={{position:'absolute',height:320,width,top:((this.state.height-STATUSBAR_HEIGHT-112-this.props.bottom)*0.5-80),left:0,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:16,color:'rgba(0,0,0,0.7)'}}>가입한 그룹이 없습니다.</Text>
                      </View>
                    ):(null)
                  }
                </View>
              </Tab>
            </Tabs>
         {/* <Swiper 
          onScrollBeginDrag={()=>{
            this.btn_index=false;
          }}
          onMomentumScrollEnd={()=>{
            this.btn_index=true;
          }}
          style={styles.wrapper} 
          showsButtons={false}
          showsPagination={false}
          index={this.state.index}
          loop={false}
          onIndexChanged={(index)=>{
            this.setState({
              index
            })
            // this.setState({
            //   index
            // })
          }}
        >
            <AnimatedFlatList
              scrollEventThrottle={16}
              bounces={false}
              showsVerticalScrollIndicator={true}
              overScrollMode={'never'}
              style={{
                flex:1,
                zIndex: 10,
              }}
              // contentContainerStyle={{paddingTop: 61.5}}
              data={(()=>{
                let follow=this.props.follow.map(x=>x);
                // follow.sort((a,b)=>{
                //   return a.id < b.id? -1: a.id>b.id?1:0
                // });
                follow.unshift({
                  user_id:this.props.user_id,
                  id:this.props.id,
                  img:this.props.img,
                  uid:this.props.uid
                });
                return follow;
              })()}
            renderItem={(item)=>{
              if(this.props.user_id==item.item.user_id){
                return <ProfileMe item={item.item} navigation={this.props.navigation} />
              }else{
                return <ProfileMyPerson item={item.item} navigation={this.props.navigation} />

              }
            }}
              keyExtractor={(item, i) => i.toString()}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {contentOffset: {y: this.state.scrollY}}
                  }
                ]
              )}
          />
          <AnimatedFlatList
              scrollEventThrottle={16}
              bounces={false}
              showsVerticalScrollIndicator={true}
              overScrollMode={'never'}
              style={{
                flex:1,
                zIndex: 10,
              }}
              data={(()=>{
                let group=this.props.group.map(x=>x);
                // group.sort((a,b)=>{
                //   return a.id < b.id? -1: a.id>b.id?1:0
                // });
                return group;
              })()}
            renderItem={(item)=>{
              return <ProfileMyGroup item={item.item} navigation={this.props.navigation}/>
            }}
              keyExtractor={(item, i) => i.toString()}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {contentOffset: {y: this.state.scrollY}}
                  }
                ]
              )}
          />
      </Swiper> */}
        <View style={{...styles.bottom_container,height:(56+this.props.bottom)}}>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Home')
          }}>
            <Image source={require(`../../assets/homeBtn_outlined.png`)} style={{width:42*width/450,height:42*width/450,opacity:0.7}}/> 
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
           this.props.navigation.navigate('Search')
          }}>
            <View>
              <Image source={require(`../../assets/alarmBtn_outlined_black.png`)} style={{width:46*width/450,height:46*width/450,opacity:0.7}}/>
              {
                (()=>{
                  var number=0;
                  this.props.alarm.map(em=>{
                    if(em.show==true){
                      number++;
                    }
                  });
                  if(number>0){
                    return(
                      <View style={number<10?styles.bedgeStyle1:styles.bedgeStyle2}> 
                        <Text style={{color:'#fff',fontSize:9,fontWeight:'bold'}}>{number}</Text>
                      </View>
                    )
                  }else{
                    return null;
                  }
                })()
              }
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Post')
          }}>
            <Image source={require(`../../assets/sendBtn_outlined_black.png`)} style={{width:48*width/450,height:48*width/450,opacity:0.8}}/> 
          </TouchableOpacity> 
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Chat')
          }}>
            <View>
              <Image source={require(`../../assets/chatBtn_outlined_black.png`)} style={{width:43*width/450,height:43*width/450,opacity:0.8}}/>
              {
                (()=>{
                  var number=0;
                  console.log(this.props.chatlist);
                  this.props.chatlist.map(emP=>{
                    var info_i=emP.info.findIndex(em=>em.user_id==this.props.user_id);
                    console.log('info_i::'+info_i)
                    number+=emP.info[info_i].bedge
                  });
                  if(number>0){
                    return(
                      <View style={number<10?styles.bedgeStyle1_chat:styles.bedgeStyle2_chat}>
                        <Text style={{color:'#fff',fontSize:9,fontWeight:'bold'}}>{number}</Text>
                      </View>
                    )
                  }else{
                    return null;
                  }
                })()
              }
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.bottom_button}} activeOpacity={1} onPress={()=>{
            this.props.navigation.navigate('Profile')
          }}>
            <Image source={require(`../../assets/profileBtn_outlined_pink.png`)} style={{width:38*width/450,height:38*width/450}}/> 
          </TouchableOpacity> 
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },
  header:{
    height:STATUSBAR_HEIGHT+55,
    width:width,
    backgroundColor:'#fff',
    zIndex:11,
    flexDirection:'row',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    shadowColor:'#000'
  },
  header_main:{
    width,height:56,
    position:'absolute',
    bottom:0,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  header_button_c:{
    height:56,
    justifyContent:'center',
    alignItems:'center',
    width:56
  },
  header_button_txt_active:{
    fontSize:18,
    color:'rgba(0,0,0,0.9)',
    fontWeight:'bold'
  },
  header_button_txt:{
    fontSize:14,
    color:'rgba(0,0,0,0.8)',
    fontWeight:'bold'
  },
  bottom_container:{
    position:'absolute',
    flexDirection:'row',
    bottom:0,
    left:0,
    width,
    backgroundColor:'rgba(0,0,0,0)',
    borderTopWidth:0.5,
    borderColor:'rgba(100,100,100,0.3)'
  },
  bottom_button:{
    width:width/5,
    height:56,
    backgroundColor:'rgba(0,0,0,0)',
    justifyContent:'center',
    alignItems:'center'
  },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  bedgeStyle1:{
    position:'absolute',
    left:46*width/450*0.55,
    top:46*width/450*0.05,
    width:16,
    height:16,
    backgroundColor:'rgb(234,29,93)',
    borderRadius:24,
    justifyContent:'center',
    alignItems:'center'
  },
  bedgeStyle2:{
    position:'absolute',
    left:46*width/450*0.55,
    top:46*width/450*0.05,
    paddingHorizontal:4,
    height:16,
    backgroundColor:'rgb(234,29,93)',
    borderRadius:24,
    justifyContent:'center',
    alignItems:'center'
  },
  bedgeStyle1_chat:{
    position:'absolute',
    left:40*width/450*0.55,
    top:40*width/450*0.05,
    width:16,
    height:16,
    backgroundColor:'rgb(234,29,93)',
    borderRadius:24,
    justifyContent:'center',
    alignItems:'center'
  },
  bedgeStyle2_chat:{
    position:'absolute',
    left:40*width/450*0.55,
    top:40*width/450*0.05,
    paddingHorizontal:4,
    height:16,
    backgroundColor:'rgb(234,29,93)',
    borderRadius:24,
    justifyContent:'center',
    alignItems:'center'
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    uid:state.setinfo.uid,
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
    barStyle:state.sidefunc.barStyle,
    follow:state.setinfo.follow,
    follower:state.setinfo.follower,
    group:state.setinfo.group,
    bottom:state.sidefunc.bottom,
    progress:state.sidefunc.progress,
    alarm:state.sidefunc.alarm,
    chatlist:state.sidefunc.chatlist,

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
    barStyle_f: (barStyle)=>{
      dispatch(actions.barStyle(barStyle));
    },
    setgroup: (group)=>{
      dispatch(actions.setgroup(group));
    },
    page_f: (page)=>{
      dispatch(actions.page(page));
    },
    progress_f: (progress)=>{
      dispatch(actions.progress(progress));
    },    
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(ProfileScreen);