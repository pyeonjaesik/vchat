import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image,TextInput,Platform,FlatList,ActivityIndicator,StatusBar,SectionList} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import GroupList from './Tab/list/GroupList';
import SelectedGroup from './Tab/list/SelectedGroup';
import { NavigationEvents } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL} from '../config';

const STATUSBAR_HEIGHT_R = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

const {width,height}=Dimensions.get("window");
class FindGroupScreen extends Component{
  constructor(props){
    super(props);
    var group=this.props.group.map(x=>x);
    this.state={
      query:'',
      btn_status:false,
      post:group.length!==0?[{title:'내 그룹',data:group}]:[],
      selected:[],
      loading:false,
      groupList:[],
    }
    this._findGroup=this._findGroup.bind(this);
    this._clearQuery=this._clearQuery.bind(this);
    this._search=this._search.bind(this);
    this._select=this._select.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  _clearQuery(){
    this.refs.searchBox.setNativeProps({text: ''})
  }
  ///VVV***search SET****VVV///
  new_groupSource=[];
  mgrefresh=0;
  groupSource=[];
  // componentDidMount(){
  //   var user_id=this.props.user_id
  //   let data={
  //     user_id,
  //   };
  //   const obj = {
  //     body: JSON.stringify(data),
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     method: 'POST'
  //   }
  //   fetch(`${URL}/getgroup`, obj)
  //   .then((response) => response.json())
  //   .then(async (responseJson) => {
  //     if(responseJson.status==100){
  //       responseJson.groupList.sort((a,b)=>{
  //         return a.id < b.id? -1: a.id>b.id?1:0
  //       });
  //       this.groupSource=responseJson.groupList;
  //       this.setState({
  //         groupList:responseJson.groupList,
  //         loading:false,
  //         post:responseJson.groupList.length!=0?[{title:'내 그룹',data:responseJson.groupList}]:[]
  //       });
  //     }else{

  //     }
  //   })
  //   .catch((error) => {
  //     this.Searching=true
  //     console.error(error);
  //   }); 
  // }
  lastTyping=0;
  lastSearching=0;
  Searching=true;
  duration=800;
  async _search({current}){
    console.log('search')
    if(current==this.lastTyping+this.duration||current-this.lastSearching>this.duration*1.5){
      console.log('aaaa')
      if(!this.Searching){return;}
      console.log('search1');
      this.Searching=false;
      this.lastSearching=current;
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
      fetch(`${URL}/findgroup`, obj)
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({
          loading:false
        })
        if(responseJson.status==100){
          console.log('search 100')
          let query=data.query.toLowerCase();
          var searchList=[];
          await this.props.group.map(em=>{
            let noun=em.id.toLowerCase();
            for(var i=0;i<query.length;i++){
              if(noun.indexOf(query[i])!=-1){
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
          var r_i=responseJson.post.findIndex(em=>em.id==data.query);
          if(data.query!==''){
            if(r_i!==-1){
              var post_temp=responseJson.post[r_i];
              responseJson.post.splice(r_i,1);
              responseJson.post.unshift(post_temp);
            }
          }
          var keyword_post=[];
          responseJson.post.map(emP=>{
            if(searchObj.findIndex(emS=>emS.id==emP.id)==-1){
              keyword_post.push(emP)
            }
          });
          await this.setState({
            post:[]
          });
          var temp_post=[];
          if(searchObj.length>0){
            temp_post.push({title:'내 그룹',data:searchObj});
          }
          if(keyword_post.length>0){
            temp_post.push({title:'추천',data:keyword_post});
          }
          await this.setState({
            post:temp_post
          });
          setTimeout((()=>{
            this.Searching=true;
          }).bind(this),500)
        }else{
          if(data.query.length==0){
            await this.setState({
              post:this.props.group.length!=0?[{title:'내 그룹',data:this.props.group}]:[]
            });
            setTimeout((()=>{
              this.Searching=true;
            }).bind(this),500)
            return;
          }
        }
      })
      .catch((error) => {
        this.Searching=true
        console.error(error);
      }); 
    }
  }
  ///AA***search SET****AAA///

  async _findGroup(query){
    this.setState({
      loading:true,
      query
    })
    const current=parseInt(Date.now());
    this.lastTyping=current
    setTimeout(this._search,this.duration,{current:(current+this.duration)});
  }
  async _select(profile,boolean){
    var selected=this.state.selected;
    if(boolean===true){
      selected.unshift(profile);
    }else{
      var s_i=selected.findIndex(em=>em.id==profile.id);
      selected.splice(s_i,1);
    }    
    await this.setState({
      selected
    });
    console.log(this.state.selected)
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled
      >
        <NavigationEvents
          onWillFocus={async payload => {
            var groupList=await this.props.navigation.getParam('groupList',[]);
            this.setState({
              selected:groupList
            })
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
            placeholder="그룹 이름을 입력해주세요"
            autoFocus={true}
            clearButtonMode='never'
            ref='searchBox'
            value={this.state.query}
            onChangeText={query => {
              this._findGroup(query);
            }}
          />
          {
            this.state.query.length>0?(
              <TouchableOpacity style={{width:50,height:50,position:'absolute',top:0,right:0,justifyContent:'center',alignItems:'center'}} onPress={()=>{
                var group=this.props.group.map(x=>x);
                this.setState({
                  query:'',
                  post:group.length!=0?[{title:'내 그룹',data:group}]:[]
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
        <View style={styles.selected}>
          <Text style={styles.selected_title}>{`그룹`}</Text>
          <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1,height:50}}
            keyboardShouldPersistTaps="always"
            data={this.state.selected}
            keyExtractor={(item,index)=>`a${index}`}
            horizontal={true}
            renderItem={({item,index}) => {
              return (
                <SelectedGroup item={item} _select={this._select}/>
              )
            }}
          />
          <TouchableOpacity style={styles.finish_c} onPress={()=>{
            let from =this.props.navigation.getParam('from','');
            if(from=='Send'){
              this.props.navigation.navigate('Send',{
                groupList:this.state.selected
              })
            }else{
              this.props.navigation.navigate('Post',{
                groupList:this.state.selected
              })
            }
          }}>
            <Text style={styles.finish_txt}>완료</Text>
          </TouchableOpacity>
        </View>
        {
          this.props.detailLoading===false?(
            <View
              style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'#fff'
              }}
            >
              <ActivityIndicator size={Platform.OS === 'ios'? 0 : 50} color="#000" />
            </View>
          ):(
            <View style={{flex:1}}>
              <SectionList
                keyboardShouldPersistTaps="always"
                style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
                sections={this.state.post}
                keyExtractor={(item, index) => `a${index}`}
                renderItem={({ item ,section: { title }}) => 
                  <GroupList 
                    item={item} 
                    selected={this.state.selected} 
                    _select={this._select}
                    _clearQuery={this._clearQuery} 
                    post={this.state.post}
                    navigation={this.props.navigation}
                    title={title}
                    group={this.props.group}
                    _id={this.props._id}
                    mgrefresh={this.props.mgrefresh}
                    mgrefresh_f={this.props.mgrefresh_f}
                    setgroup={this.props.setgroup}
                  />
                }
                renderSectionHeader={({ section: { title } },aa) => (
                  <View style={styles.section_c}>
                    <Text style={styles.section}>{title}</Text>
                  </View>            
                )}
              />

              {/* <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1}}
                keyboardShouldPersistTaps="always"
                data={this.state.post}
                keyExtractor={(item,index)=>`a${index}`}
                renderItem={({item,index}) => {
                  return (
                    <GroupList item={item} selected={this.state.selected} _select={this._select}
                      _clearQuery={this._clearQuery} post={this.state.post}
                      navigation={this.props.navigation}
                    />
                  )
                }}
              /> */}



              {/* {
                this.props.selected.length===0 ? (
                  <TouchableOpacity style={styles.nextbutton} 
                    onPress={async ()=>{
                      // await this.props._setSpecial();
                      // this.props._setStatus(4);
                      Toast.show('영화를 선택해주세요!');
                    }}
                  >
                    <Text style={styles.nextbutton_txt}>{'다음'}</Text>
                  </TouchableOpacity>
                ):(
                  <TouchableOpacity style={{...styles.nextbutton,backgroundColor:'#d20962'}} 
                    onPress={async ()=>{
                      var findIndex=await this._findSpecial();
                      if(findIndex===0){
                        await this.props._setSpecial();
                        this.props._setStatus(5);
                      }else{
                        await this.props._setSpecial();
                        this.props._setStatus(4);
                      }

                    }}
                  >
                    <Text style={styles.nextbutton_txt}>{`다음 (${this.props.selected.length})`}</Text>
                  </TouchableOpacity>
                )
              } */}
            </View>
          )
        }
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
    width:width-110,
    paddingHorizontal:15,
    color:'#000',
    borderRadius:3,
    height:50,
  },
  selected:{
    width:'100%',
    height:50,
    flexDirection:'row',
    borderBottomWidth:0.5,
    borderColor:'rgba(100,100,100,0.3)',
    alignItems:'center'
  },
  selected_title:{
    color:'#222',
    fontSize:17,
    marginLeft:20,
    marginRight:10
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
  section_c:{
    width:'100%',
    justifyContent:'center',
    height:32,
    marginBottom:0,
    backgroundColor:'#fff',
  },
  section:{
    fontSize:14,
    color:'rgba(0,0,0,0.8)',
    fontWeight:'600',
    marginLeft:20,
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    user_id:state.setinfo.user_id,
    group:state.setinfo.group,
    mgrefresh:state.sidefunc.mgrefresh,
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{  
    mgrefresh_f: (mgrefresh)=>{
      dispatch(actions.mgrefresh(mgrefresh));
    },  
    setgroup: (group)=>{
      dispatch(actions.setgroup(group));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(FindGroupScreen);