import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image,TextInput,Platform,FlatList,ActivityIndicator,StatusBar} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import ProfileGroup from './Tab/list/ProfileGroup';
import ProfilePerson from './Tab/list/ProfilePerson';

import { NavigationEvents } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Toast from 'react-native-simple-toast';
import {URL} from '../config';
import { Tab, Tabs} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

const STATUSBAR_HEIGHT_R = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

const {width,height}=Dimensions.get("window");
class SearchProfileScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      query:'',
      btn_status:false,
      loading:true,
      personList:[],
      activePage:0,
      groupList:[],
      followerList:[],
      followingList:[],
    }
    this._find=this._find.bind(this);
    this._clearQuery=this._clearQuery.bind(this);
    this.onchangePage=this.onchangePage.bind(this);
    this._searchGroup=this._searchGroup.bind(this);
    this._searchFollower=this._searchFollower.bind(this);
    this._searchFollow=this._searchFollow.bind(this);

  }
  static navigationOptions = {
    header:null
  };
  _clearQuery(){
    this.refs.searchBox.setNativeProps({text: ''})
  }
  ///VVV***search SET****VVV///
  lastTyping=0;
  lastSearching=0;
  Searching=true;
  duration=800;
  query='';
  lastPersonQuery='';
  lastGroupQuery='';
  lastFollowerQuery='';
  lastFollowQuery='';f
  groupSource=[];
  followerSource=[];
  followSource=[];

  async componentDidMount(){
    var user_id=await this.props.navigation.getParam('user_id')||this.props.user_id
    let data={
      user_id,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getinfouni`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        this.setState({
          groupList:responseJson.groupList,
          followerList:responseJson.follower,
          followList:responseJson.follow,
          loading:false
        });
        this.groupSource=responseJson.groupList;
        this.followerSource=responseJson.follower;
        this.followSource=responseJson.follow
      }else{

      }
    })
    .catch((error) => {
      this.Searching=true
      console.error(error);
    }); 
  }
  async _searchFollow(query){
    this.lastFollowQuery=query;
    if(query.length==0){
      this.setState({
        followList:this.followSource
      });
      return;
    }
    var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+]*$/;
    var str_result=''
    for(var i=0;i<query.length;i++){
      if( regex.test(query[i]) ) {
          str_result+=query[i];
      }
    }
    var searchList=[];
    await this.followerSource.map(em=>{
      for(var i=0;i<query.length;i++){
        if(em.id.indexOf(query[i])!=-1){
          searchList.push(em);
        }
      }
    });
    var searchObj=[];
    console.log(searchList);
    searchList.map(em=>{
      var searchIndex=searchObj.findIndex(x=>x.id==em.id);
      if(searchIndex==-1){
        searchObj.push({
          user_id:em.user_id,
          id:em.id,
          img:em.img,
          leng:1
        });
      }else{
        var search_temp=searchObj[searchIndex];
        searchObj.splice(searchIndex,1,{
          user_id:em.user_id,
          id:em.id,
          img:em.img,
          leng:search_temp.leng+1
        });
      }
    });
    searchObj.sort(function(a, b) { // 내림차순
      return b.leng - a.leng;
    });
    await this.setState({
      followList:[]
    }); //post가 많은상태에서 적은상태로 가면 movieList의 constructor가 작동하지 않는 문제 때문에 post를 매번 비우고 시작한다
        // 그러면 항상 더 많은 상태로 가는 경우이기에 constructor가 항상 작동한다.
    this.setState({
      followList:searchObj
    });
  }
  async _searchFollower(query){
    this.lastFollowerQuery=query;
    if(query.length==0){
      this.setState({
        followerList:this.followerSource
      });
      return;
    }
    var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+]*$/;
    var str_result=''
    for(var i=0;i<query.length;i++){
      if( regex.test(query[i]) ) {
          str_result+=query[i];
      }
    }
    var searchList=[];
    await this.followerSource.map(em=>{
      for(var i=0;i<query.length;i++){
        if(em.id.indexOf(query[i])!=-1){
          searchList.push(em);
        }
      }
    });
    var searchObj=[];
    console.log(searchList);
    searchList.map(em=>{
      var searchIndex=searchObj.findIndex(x=>x.id==em.id);
      if(searchIndex==-1){
        searchObj.push({
          user_id:em.user_id,
          id:em.id,
          img:em.img,
          leng:1
        });
      }else{
        var search_temp=searchObj[searchIndex];
        searchObj.splice(searchIndex,1,{
          user_id:em.user_id,
          id:em.id,
          img:em.img,
          leng:search_temp.leng+1
        });
      }
    });
    searchObj.sort(function(a, b) { // 내림차순
      return b.leng - a.leng;
    });
    await this.setState({
      followerList:[]
    }); //post가 많은상태에서 적은상태로 가면 movieList의 constructor가 작동하지 않는 문제 때문에 post를 매번 비우고 시작한다
        // 그러면 항상 더 많은 상태로 가는 경우이기에 constructor가 항상 작동한다.
    this.setState({
      followerList:searchObj
    });
  }
  async _searchGroup(query){
    this.lastGroupQuery=query;
    if(query.length==0){
      this.setState({
        groupList:this.groupSource
      });
      return;
    }
    var searchList=[];
    await this.groupSource.map(em=>{
      for(var i=0;i<query.length;i++){
        if(em.id.indexOf(query[i])!=-1){
          searchList.push(em);
        }
      }
    });
    var searchObj=[];
    searchList.map(em=>{
      var searchIndex=searchObj.findIndex(x=>x.id==em.id);
      if(searchIndex==-1){
        searchObj.push({
          id:em.id,
          member:em.member,
          leng:1
        });
      }else{
        var search_temp=searchObj[searchIndex];
        searchObj.splice(searchIndex,1,{
          id:em.id,
          member:em.member,
          leng:search_temp.leng+1
        });
      }
    });
    searchObj.sort(function(a, b) { // 내림차순
      return b.leng - a.leng;
    });
    await this.setState({
      groupList:[]
    }); //post가 많은상태에서 적은상태로 가면 movieList의 constructor가 작동하지 않는 문제 때문에 post를 매번 비우고 시작한다
        // 그러면 항상 더 많은 상태로 가는 경우이기에 constructor가 항상 작동한다.
    this.setState({
      groupList:searchObj
    });
  }

  ///AA***search SET****AAA///

  async _find(query){
    this.setState({
      query
    });
    if(this.state.activePage==0){
      this._searchGroup(query);
    }else if(this.state.activePage==1){
      this._searchFollower(query);
    }else{
      this._searchFollow(query);
    }
    // const current=parseInt(Date.now());
    // this.lastTyping=current
    // setTimeout(this._search,this.duration,{current:(current+this.duration)});
  }

  onchangePage=async (i)=>{
    await this.setState({
      activePage:i
    });
    if(i==0){
      if(this.lastGroupQuery!=this.state.query){
        this._find(this.state.query);
      }
    }else if(i==1){
      if(this.lastFollowerQuery!=this.state.query){
        this._find(this.state.query);
      }
    }else{
      if(this.lastFollowQuery!=this.state.query){
        this._find(this.state.query);
      } 
    }
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled
      >
        <NavigationEvents
          onWillFocus={async payload => {
            this.props.barStyle_f('dark-content');

          }}
          onWillBlur={payload => {
          }
          }
        />
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
            onPress={()=>{
              this.props.navigation.goBack()
            }}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <TextInput
            style={styles.txtinput}
            placeholder="검색"
            autoFocus={true}
            clearButtonMode='never'
            ref='searchBox'
            value={this.state.query}
            onChangeText={query => {
              this._find(query);
            }}
          />
          {
            this.state.query.length>0?(
              <TouchableOpacity style={{width:50,height:50,position:'absolute',top:0,right:0,justifyContent:'center',alignItems:'center'}} onPress={()=>{
                this.setState({
                  query:''
                });
                this._find('');
              }}>
                <Image source={require('../assets/x_round.png')} style={{width:24,height:24,opacity:0.5}}/>
              </TouchableOpacity>
            ):(null)
          }
          {
            this.state.loading===true?(
              <View style={{width:50,height:50,position:'absolute',top:0,right:0,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                <ActivityIndicator size={'small'} color="#000" />
              </View>
            ):(null)
          }
        </View>
        <Tabs 
          tabBarUnderlineStyle={{position:'absolute',backgroundColor:'#000',height:2.5}}
          page={this.state.activePage}
          onChangeTab={async (em)=>{
            this.onchangePage(em.i)
          }}
        >
          <Tab heading="그룹" activeTextStyle={{color:'#000'}}
            tabStyle={{backgroundColor:'#fff'}}
            activeTabStyle={{backgroundColor:'#fff'}}
            textStyle={{color:'#999'}}
            activeTextStyle={{color:'#000'}}
          >
            <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
              keyboardShouldPersistTaps="always"
              data={this.state.groupList}
              onLayout={()=>{
                var activePage=this.props.navigation.getParam('activePage',0)
                this.setState({
                  activePage
                })
              }}
              keyExtractor={(item,index)=>`a${index}`}
              renderItem={({item,index}) => {
                return (
                  <ProfileGroup
                    item={item}
                    navigation={this.props.navigation}
                  />               
                )
              }}
            />

          </Tab>
          <Tab heading="팔로워" activeTextStyle={{color:'#000'}}
            tabStyle={{backgroundColor:'#fff'}}
            activeTabStyle={{backgroundColor:'#fff'}}
            textStyle={{color:'#999'}}
            activeTextStyle={{color:'#000'}}
          >
            <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
              keyboardShouldPersistTaps="always"
              data={this.state.followerList}
              keyExtractor={(item,index)=>`a${index}`}
              renderItem={({item,index}) => {
                return (
                  <ProfilePerson
                    item={item}
                    navigation={this.props.navigation}
                  />                
                )
              }}
            />

          </Tab>
          <Tab heading="팔로잉" activeTextStyle={{color:'#000'}}
            tabStyle={{backgroundColor:'#fff'}}
            activeTabStyle={{backgroundColor:'#fff'}}
            textStyle={{color:'#999'}}
            activeTextStyle={{color:'#000'}}
          >
            <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
              keyboardShouldPersistTaps="always"
              data={this.state.followList}
              keyExtractor={(item,index)=>`a${index}`}
              renderItem={({item,index}) => {
                return (
                  <ProfilePerson
                    item={item}
                    navigation={this.props.navigation}
                  />                
                )
              }}
            />

          </Tab>
        </Tabs>
      </KeyboardAvoidingView>
    )
  }

}
const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top:0,
    left:0,
    bottom:0,
    right:0,
    width:'100%',
    height:'100%',
    backgroundColor:'#fff',
  },
  main:{
    width:'100%',
    backgroundColor:'rgba(255,255,255,0)',
    alignItems:'center',
  },
  header:{
    width:'100%',
    height:55,
    flexDirection:'row',
    alignItems:'center',
    borderBottomWidth:0.5,
    borderColor:'rgba(100,100,100,0.2)',
    marginTop:STATUSBAR_HEIGHT_R
  },
  leftbtn:{
    marginTop:0,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  subject:{
    fontSize:23,
    color:'#000000',
    marginLeft:25,
    lineHeight:33
  },
  txtinput:{
    width:width-100,
    paddingHorizontal:10,
    color:'#000',
    height:50,
  },
  finish_c:{
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center'
  },
  finish_txt:{
    fontSize:14,
    color:'rgba(0,0,0,0.9)'
  },
  nextbutton:{
    position:'absolute',
    bottom:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#888',
    width:'80%',
    marginLeft:'10%',
    height:50,
    borderRadius:3,
  },
  nextbutton_txt:{
    color:'#fff',
    fontSize:18,
  },
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    user_id:state.setinfo.user_id,
    sns:state.setinfo.sns,
    socket:state.sidefunc.socket,
    chatroom:state.sidefunc.chatroom,
    chatlist:state.sidefunc.chatlist,
    barStyle:state.sidefunc.barStyle,
    follow:state.setinfo.follow,
    follower:state.setinfo.follower,
    group:state.setinfo.group,
    lv:state.sidefunc.lv,
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
    setimg:(img)=>{
      dispatch(actions.setimg(img))
    },
    setvideo:(video)=>{
      dispatch(actions.setvideo(video))
    },
    setintro:(intro)=>{
      dispatch(actions.setintro(intro))
    },
    setsns: (sns)=>{
      dispatch(actions.setsns(sns));
    },
    setprice: (price)=>{
      dispatch(actions.setprice(price));
    },
    signout: ()=>{
      dispatch(actions.signout());
    },
    setsocket: (socket)=>{
      dispatch(actions.setsocket(socket));
    },
    setchatroom: (coin)=>{
      dispatch(actions.setchatroom(coin));
    },
    setchatlist: (chatlist)=>{
      dispatch(actions.setchatlist(chatlist));
    },
    setfollow: (follow)=>{
      dispatch(actions.setfollow(follow));
    },
    setfollower: (follower)=>{
      dispatch(actions.setfollower(follower));
    },
    setgroup: (group)=>{
      dispatch(actions.setgroup(group));
    },
    setlv: (lv)=>{
      dispatch(actions.setlv(lv));
    },
    backhandler_f: (boolean)=>{
      dispatch(actions.backhandler(boolean));
    },
    barStyle_f: (barStyle)=>{
      dispatch(actions.barStyle(barStyle));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(SearchProfileScreen);
