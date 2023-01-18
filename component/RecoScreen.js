import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image,TextInput,Platform,FlatList,ActivityIndicator,StatusBar,Keyboard,Animated,Easing} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import SearchPerson from './Tab/list/SearchPerson';
import SearchGroup from './Tab/list/SearchGroup';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL,STATUSBAR_HEIGHT} from '../config';
import { Tab, Tabs} from 'native-base';
import { stat } from 'react-native-fs';


const {width,height}=Dimensions.get("window");
class RecoScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      query:'',
      btn_status:false,
      loading:false,
      personList:[],
      groupList:[],
      activePage:0,
      keyboard:false,
      marginBottom:new Animated.Value(0),
    }
    this._find=this._find.bind(this);
    this._clearQuery=this._clearQuery.bind(this);
    this._search=this._search.bind(this);
    this.onchangePage=this.onchangePage.bind(this);
    this._searchPerson=this._searchPerson.bind(this);
    this._searchGroup=this._searchGroup.bind(this);
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
  _searchPerson(){
    this.lastPersonQuery=this.state.query;
    let data={
      query:this.state.query,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/findperson`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      this.setState({
        loading:false
      })
      if(responseJson.status==100){
        console.log(responseJson.post);
        await this.setState({
          personList:[]
        });
        this.setState({
          personList:responseJson.post
        })
      }else{

      }
      setTimeout((()=>{
        this.Searching=true;
      }).bind(this),500)
    })
    .catch((error) => {
      this.Searching=true
      console.error(error);
    }); 
  }
  _searchGroup(){
    const query_temp=this.state.query;
    console.log('length:'+query_temp.length);
    var result_query='';
    if(query_temp.length>15){
      for(var i=0;i<15;i++){
        result_query+=query_temp[i];
      }
    }else{
      result_query=query_temp;
    }
    console.log(result_query);
    this.lastGroupQuery=result_query;
    let data={
      query:result_query,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/findgroup`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      this.setState({
        loading:false
      })
      if(responseJson.status==100){
        console.log(responseJson.post);
        var r_i=responseJson.post.findIndex(em=>em.id==data.query);
        if(data.query!==''){
          if(r_i===-1){
            responseJson.post.unshift({
              id:data.query,
              member:0
            })
          }else{
            var post_temp=responseJson.post[r_i];
            responseJson.post.splice(r_i,1);
            responseJson.post.unshift(post_temp);
          }
        }
        await this.setState({
          groupList:[]
        });
        this.setState({
          groupList:responseJson.post
        })
      }else{

      }
      setTimeout((()=>{
        this.Searching=true;
      }).bind(this),500)
    })
    .catch((error) => {
      this.Searching=true
      console.error(error);
    }); 
  }
  async _search({current}){
    if(current==this.lastTyping+this.duration||current-this.lastSearching>this.duration*1.5){
      if(!this.Searching){return;}
      this.Searching=false;
      console.log('search: '+this.state.query);
      this.lastSearching=current;
      if(this.state.activePage==0){
        this._searchPerson();
      }else{
        this._searchGroup();
      }
    }
  }
  ///AA***search SET****AAA///

  async _find(query){
    this.setState({
      loading:true,
      query
    })
    const current=parseInt(Date.now());
    this.lastTyping=current
    setTimeout(this._search,this.duration,{current:(current+this.duration)});
  }

  onchangePage=async (i)=>{
    await this.setState({
      activePage:i
    });
    if(i==0){
      if(this.lastPersonQuery!=this.state.query){
        this._find(this.state.query);
      }
    }else{
      if(this.lastGroupQuery!=this.state.query){
        this._find(this.state.query);
      }
    }
  }
  hasActive=true;
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled
      >
        <NavigationEvents
          onWillFocus={payload => {
            this.props.page_f('Search');
          }}
          onDidFocus={async payload => {
            this.props.barStyle_f('dark-content');

          }}
          onWillBlur={payload => {
          }
          }
        />
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn} onPress={()=>{
            this.props.navigation.goBack()
          }}>
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40,opacity:0.7}}/>
          </TouchableOpacity>
          <TextInput
            style={styles.txtinput}
            placeholder='검색'
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
                })
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
          tabContainerStyle={{
            elevation:1,
          }}
          page={this.state.activePage}
          onChangeTab={(em)=>{
            this.onchangePage(em.i)
          }}
        >
          <Tab heading="사람" activeTextStyle={{color:'#000'}}
            tabStyle={{backgroundColor:'#fff'}}
            activeTabStyle={{backgroundColor:'#fff',borderWidth:0}}
            textStyle={{color:'#999'}}
            activeTextStyle={{color:'#000'}}
          >
              <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
                keyboardShouldPersistTaps="always"
                data={this.state.personList}
                keyExtractor={(item,index)=>`a${index}`}
                onLayout={()=>{
                  if(this.hasActive==false){
                    return;
                  }
                  this.hasActive=false
                  var activePage=this.props.navigation.getParam('activePage',0)
                  this.setState({
                    activePage
                  })
                }}
                renderItem={({item,index}) => {
                  return (
                    <SearchPerson
                      user_id={this.props.user_id} 
                      item={item} 
                      _clearQuery={this._clearQuery}
                      navigation={this.props.navigation}
                    />
                  )
                }}
              />
          </Tab>
          <Tab heading="그룹" activeTextStyle={{color:'#000'}}
            tabStyle={{backgroundColor:'#fff'}}
            activeTabStyle={{backgroundColor:'#fff'}}
            textStyle={{color:'#999'}}
            activeTextStyle={{color:'#000'}}
          >
            <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
              keyboardShouldPersistTaps="always"
              data={this.state.groupList}
              keyExtractor={(item,index)=>`a${index}`}
              renderItem={({item,index}) => {
                return (
                  <SearchGroup item={item}
                    _clearQuery={this._clearQuery}
                    navigation={this.props.navigation}
                    group={this.props.group}
                    setgroup={this.props.setgroup}
                    _id={this.props._id}
                    mgrefresh={this.props.mgrefresh}
                    mgrefresh_f={this.props.mgrefresh_f}
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
    // borderBottomWidth:0.5,
    // borderColor:'rgba(100,100,100,0.2)',
    marginTop:STATUSBAR_HEIGHT
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
    width:width-106,
    paddingHorizontal:16,
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
  bottom_container:{
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
  }
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
    bottom:state.sidefunc.bottom,
    mgrefresh:state.sidefunc.mgrefresh,
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
    page_f: (page)=>{
      dispatch(actions.page(page));
    },
    mgrefresh_f: (mgrefresh)=>{
      dispatch(actions.mgrefresh(mgrefresh));
    },  
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(RecoScreen);
