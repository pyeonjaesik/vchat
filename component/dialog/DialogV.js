import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions} from 'react-native';
import {URL} from '../../config';

const {width}=Dimensions.get("window");
export default class DialogV extends Component{
  constructor(props){
    super(props);
    this._delete=this._delete.bind(this);
    this._report=this._report.bind(this);
    this.unfollowing=this.unfollowing.bind(this);
    this._deleteChat=this._deleteChat.bind(this);
    this._blockuser=this._blockuser.bind(this);

  }
  async _delete(){
    let data={
      _id:this.props._id,
      post_id:this.props.post_id
    };
    await this.props._deletePost(this.props.post_id);
    await this.props._dialogV(false,'','')
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/deletepost`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      console.log(responseJson)
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _report(){
    let data={
      _id:this.props._id,
      post_id:this.props.post_id
    };
    await this.props._deletePost(this.props.post_id);
    await this.props._dialogV(false,'','')
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/reportpost`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      console.log(responseJson)
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _blockuser(){
    let data={
      _id:this.props._id,
      user_id:this.props.post_user_id
    };
    await this.props._deletePostArray(this.props.post_user_id);
    await this.props._dialogV(false,'','')
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/blockuser`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      console.log(responseJson)
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async unfollowing(){
    var follow_temp=this.props.follow;
    var f_i=follow_temp.findIndex(em=>em.user_id==this.props.post_user_id);
    if(f_i!==-1){
      follow_temp.splice(f_i,1);
      await this.props.setfollow([])
      this.props.setfollow(follow_temp);
    }
    let data={
      user_id:this.props.post_user_id,
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
      }else{

      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _deleteChat(){
    var chatlist=this.props.chatlist;
    console.log(chatlist);
    var result_index=-1;
    chatlist.map((emP,index)=>{
      for(var i=0;i<2;i++){
        if(emP.info[i].user_id!=this.props.user_id){
          result_index=index;
        }
      }
    });
    chatlist.splice(result_index,1);
    this.props.setchatlist(chatlist);
  }
  render(){
    return(
      <TouchableOpacity 
       style={styles.container}
       activeOpacity={1}
       onPress={()=>{this.props._dialogV(false,'','')}}
      >
        <View style={styles.main}>
          {
            this.props.post_user_id==this.props.user_id?(
              <TouchableOpacity style={{...styles.main_btn_c,marginTop:16}} onPress={()=>{
                this._delete()
              }}>
                  <Image style={{width:32,height:32,marginLeft:-6}} source={require('../../assets/trash.png')}/>

                <Text style={{...styles.main_btn_txt,marginLeft:2}}>삭제하기</Text>
              </TouchableOpacity>
            ):(
              <>
              <TouchableOpacity style={styles.main_btn_c} onPress={()=>{
                this._report()
              }}>
                <View style={styles.exp_c}>
                  <Image style={{width:20,height:20}} source={require('../../assets/exp.png')}/>
                </View>
                <Text style={styles.main_btn_txt}>게시물 신고</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.main_btn_c,marginTop:16}} onPress={()=>{
                this._blockuser();
                this.unfollowing();
                this._deleteChat();
              }}>
                <View style={{...styles.exp_c,backgroundColor:'#000'}}>
                  <Image style={{width:20,height:20}} source={require('../../assets/exp.png')}/>
                </View>
                <Text style={styles.main_btn_txt}>사용자 차단</Text>
              </TouchableOpacity>
              </>
            )
          }
        </View>
      </TouchableOpacity>
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
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center'
  },
  main:{
  },
  main_btn_c:{
    backgroundColor:'rgba(255,255,255,0.9)',
    paddingHorizontal:24,
    height:48,
    flexDirection:'row',
    alignItems:'center',
    borderRadius:8,
  },
  exp_c:{
    backgroundColor:'rgba(228,0,43,0.8)',
    justifyContent:'center',
    alignItems:'center',
    width:20,
    height:20,
    borderRadius:24,
    marginRight:8,
  },
  main_btn_txt:{
    fontSize:16,
    color:'rgba(0,0,0,0.9)'
  }
});