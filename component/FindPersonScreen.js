import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity,Dimensions,Text,Image,TextInput,Platform,FlatList,ActivityIndicator,StatusBar,SectionList} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import PersonList from './Tab/list/PersonList';
import SelectedPerson from './Tab/list/SelectedPerson';
import { NavigationEvents } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {URL} from '../config';

const STATUSBAR_HEIGHT_R = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

const {width,height}=Dimensions.get("window");
class FindPersonScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      query:'',
      btn_status:false,
      post:this.props.follow.length!==0?[{title:'친구',data:this.props.follow}]:[],
      selected:[],
      loading:false
    }
    this._findPerson=this._findPerson.bind(this);
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
  followSource=[];
  // componentDidMount(){
  //   responseJson.follow.sort((a,b)=>{
  //     return a.id < b.id? -1: a.id>b.id?1:0
  //   });
  //   this.setState({
  //     followList:responseJson.follow,
  //     loading:false,
  //     post:responseJson.follow.length!==0?[{title:'친구',data:responseJson.follow}]:[]
  //   });
  //   this.followSource=responseJson.follow
  // }
  lastTyping=0;
  lastSearching=0;
  Searching=true;
  duration=800;
  async _search({current}){
    if(current==this.lastTyping+this.duration||current-this.lastSearching>this.duration*1.5){
      if(!this.Searching){return;}
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
      fetch(`${URL}/findperson`, obj)
      .then((response) => response.json())
      .then(async (responseJson) => {
        this.setState({
          loading:false
        })
        if(responseJson.status==100){
          let query=data.query.toLowerCase();
          var regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣+]*$/;
          var str_result=''
          for(var i=0;i<query.length;i++){
            if( regex.test(query[i]) ) {
                str_result+=query[i];
            }
          }
          var searchList=[];
          await this.props.follow.map(em=>{
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
          var keyword_post=[];
          responseJson.post.map(emP=>{
            if(searchObj.findIndex(emS=>emS.user_id==emP.user_id)==-1){
              keyword_post.push(emP)
            }
          });
          await this.setState({
            post:[]
          });
          var temp_post=[];
          if(searchObj.length>0){
            temp_post.push({title:'친구',data:searchObj});
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
          await this.setState({
            post:this.props.follow.length!==0?[{title:'친구',data:this.props.follow}]:[]
          });
          setTimeout((()=>{
            this.Searching=true;
          }).bind(this),500)
          // if(data.query.length==0){
          //   await this.setState({
          //     post:[{title:'친구',data:this.followSource}]
          //   });
          //   setTimeout((()=>{
          //     this.Searching=true;
          //   }).bind(this),500)
          //   return;
          // }
        }
      })
      .catch((error) => {
        this.Searching=true
        console.error(error);
      }); 
    }
  }
  ///AA***search SET****AAA///

  async _findPerson(query){
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
      var s_i=selected.findIndex(em=>em.user_id==profile.user_id);
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
            var personList=await this.props.navigation.getParam('personList',[]);
            this.setState({
              selected:personList
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
            placeholder="사람 이름을 입력해주세요"
            autoFocus={true}
            clearButtonMode='never'
            ref='searchBox'
            value={this.state.query}
            onChangeText={query => {
              this._findPerson(query);
            }}
          />
          {
            this.state.query.length>0?(
              <TouchableOpacity style={{width:50,height:50,position:'absolute',top:0,right:0,justifyContent:'center',alignItems:'center'}} onPress={()=>{
                this.setState({
                  query:'',
                  post:this.props.follow.length!=0?[{title:'친구',data:this.props.follow}]:[]
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
          <Text style={styles.selected_title}>{`사람`}</Text>
          <FlatList maxToRenderPerBatch={100} style={{backgroundColor:'rgba(255,255,255,0)',flex:1,height:50}}
            keyboardShouldPersistTaps="always"
            data={this.state.selected}
            keyExtractor={(item,index)=>`a${index}`}
            horizontal={true}
            renderItem={({item,index}) => {
              return (
                <SelectedPerson item={item} _select={this._select}/>
              )
            }}
          />
          <TouchableOpacity style={styles.finish_c} onPress={async ()=>{
            let from =this.props.navigation.getParam('from','');
            if(from=='Send'){
              this.props.navigation.navigate('Send',{
                personList:this.state.selected
              })
            }else{
              this.props.navigation.navigate('Post',{
                personList:this.state.selected
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
                  <PersonList 
                    item={item} 
                    selected={this.state.selected} 
                    _select={this._select}
                    _clearQuery={this._clearQuery} 
                    post={this.state.post}
                    navigation={this.props.navigation}
                    user_id={this.props.user_id}
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
                    <PersonList item={item} selected={this.state.selected} _select={this._select}
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
    follow:state.setinfo.follow,

  }
}
const mapDispatchToProps = (dispatch) =>{
  return{  
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(FindPersonScreen);