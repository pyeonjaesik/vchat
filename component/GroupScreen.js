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
class GroupScreen extends Component{
  constructor(props){
    super(props);
    var group_id=this.props.navigation.getParam('id','');
    var member=this.props.navigation.getParam('member',0);
    var g_i=this.props.group.findIndex(em=>em.id==group_id);
    this.state={
      query:'',
      btn_status:false,
      loading:true,
      personList:[],
      group_id,
      member,
      group_state:g_i==-1?false:true,
    }
    this._find=this._find.bind(this);
    this._clearQuery=this._clearQuery.bind(this);
    this._searchPerson=this._searchPerson.bind(this);
    this._group=this._group.bind(this);
    this.grouping=this.grouping.bind(this);
    this.ungrouping=this.ungrouping.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  groupindex=0;
  async grouping(){
    var group_temp=this.props.group;
    if(group_temp.findIndex(em=>em.id==this.state.group_id)==-1){
      group_temp.unshift({
        id:this.state.group_id,
        member:this.state.member+1
      });
      await this.props.mgrefresh_f(parseInt(Date.now()))
      this.props.setgroup(group_temp);
    };
    let data={
      group_id:this.state.group_id,
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
    fetch(`${URL}/grouping`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.groupindex===1){
          this.groupindex=0;
        }else if(this.groupindex===2){
          this.ungrouping();
        }
      }else{
        await this.setState(prev=>({
          group_state:false,
          member:prev.member-1
        }));
        this.groupindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async ungrouping(){
    console.log(this.state.group_id);
    var group_temp=this.props.group;
    var g_i=group_temp.findIndex(em=>em.id==this.state.group_id);
    if(g_i!==-1){
      group_temp.splice(g_i,1);
      await this.props.mgrefresh_f(parseInt(Date.now()))
      this.props.setgroup(group_temp);
    }
    let data={
      group_id:this.state.group_id,
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
    fetch(`${URL}/ungrouping`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status===100||responseJson.status===102){
        if(this.groupindex===2){
          this.groupindex=0;
        }else if(this.groupindex===1){
          this.grouping();
        }
      }else{
        await this.setState(prev=>({
          group_state:true,
          member:prev.member+1
        }))
        this.groupindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _group(){
    var personList_temp=this.state.personList;
    if(this.state.group_state===false){
      var f_si=this.personSource.findIndex(em=>em.user_id==this.props.user_id);
      if(f_si==-1){
        this.personSource.unshift({
          id:this.props.id,
          user_id:this.props.user_id,
          img:this.props.img
        });
      }
      var f_li=personList_temp.findIndex(em=>em.user_id==this.props.user_id);
      if(f_li==-1){
        personList_temp.unshift({
          id:this.props.id,
          user_id:this.props.user_id,
          img:this.props.img
        });
      }
      await this.setState(prev=>({
        group_state:true,
        member:prev.member+1,
        personList:personList_temp
      }));
      if(this.groupindex===0){
        this.grouping();
      }
      this.groupindex=1;
    }else{
      var f_si=this.personSource.findIndex(em=>em.user_id==this.props.user_id);
      if(f_si!==-1){
        this.personSource.splice(f_si,1);
      }
      var f_li=personList_temp.findIndex(em=>em.user_id==this.props.user_id);
      if(f_li!==-1){
        personList_temp.splice(f_si,1);
      }
      await this.setState(prev=>({
        group_state:false,
        member:prev.member-1,
        personList:personList_temp
      }));
      if(this.groupindex===0){
        this.ungrouping();
      }
      this.groupindex=2;
    }
  }
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
  personSource=[];

  componentDidMount(){
    let data={
      group_id:this.state.group_id,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getgroupmember`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        this.setState({
          personList:responseJson.personList,
          member:responseJson.member,
          loading:false
        });
        this.personSource=responseJson.personList;
      }else{
        this.setState({
          loading:false
        })
      }
    })
    .catch((error) => {
      this.Searching=true
      console.error(error);
    }); 
  }
  async _searchPerson(query){
    if(query.length==0){
      this.setState({
        personList:this.personSource
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
    await this.personSource.map(em=>{
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
      personList:[]
    }); //post가 많은상태에서 적은상태로 가면 movieList의 constructor가 작동하지 않는 문제 때문에 post를 매번 비우고 시작한다
        // 그러면 항상 더 많은 상태로 가는 경우이기에 constructor가 항상 작동한다.
    this.setState({
      personList:searchObj
    });
  }
  ///AA***search SET****AAA///

  async _find(query){
    await this.setState({
      query
    });
    this._searchPerson(query);
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled
      >
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <View style={{width,height:56,marginTop:STATUSBAR_HEIGHT_R,alignItems:'center',flexDirection:'row'}}>
          <TouchableOpacity style={styles.leftbtn}
              onPress={()=>{
                this.props.navigation.goBack()
              }}
            >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <View style={{width:32,height:32,borderRadius:32,backgroundColor:this.state.group_state===true?'#d52685':'#444',justifyContent:'center',alignItems:'center'}}>
            <Image style={{width:16,height:16}} source={require('../assets/at.png')}/>
          </View>
          <View style={{marginLeft:16}}>
            <Text style={{fontSize:15,fontWeight:'bold',color:"rgba(0,0,0,0.9)"}}>{this.state.group_id}</Text>
            <Text style={{fontSize:12,color:'rgba(0,0,0,0.6)',marginTop:4}}>{`멤버수${this.state.member}`}</Text>
          </View>
          {
            this.state.group_state===false?(
              <TouchableOpacity style={styles.grouping_c} onPress={()=>{
                this._group();
              }}>
                <Text style={styles.grouping_txt}>가입</Text>
              </TouchableOpacity>
            ):(
              <TouchableOpacity style={{...styles.grouping_c,backgroundColor:'#222'}} onPress={()=>{
                this._group();
              }}>
                <Text style={{...styles.grouping_txt,color:'#fff'}}>가입됨</Text>
              </TouchableOpacity>
            )
          }
        </View>
        <View style={styles.header}>
          <TextInput
            style={styles.txtinput}
            placeholder="그룹 멤버 검색"
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
        <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
          keyboardShouldPersistTaps="always"
          data={this.state.personList}
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
    marginTop:0
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
    width:width-50,
    paddingLeft:32,
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
  grouping_c:{
    position:'absolute',
    right:16,
    width:48,
    height:28,
    borderRadius:3,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:"rgba(0,0,0,0.7)"
  },
  grouping_txt:{
    color:'rgba(0,0,0,0.7)',
    fontWeight:'bold'
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    id:state.setinfo.id,
    user_id:state.setinfo.user_id,
    img:state.setinfo.img,
    group:state.setinfo.group,
    mgrefresh:state.sidefunc.mgrefresh

  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setgroup: (group)=>{
      dispatch(actions.setgroup(group));
    },
    barStyle_f: (barStyle)=>{
      dispatch(actions.barStyle(barStyle));
    },
    mgrefresh_f: (mgrefresh)=>{
      dispatch(actions.mgrefresh(mgrefresh));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(GroupScreen);
