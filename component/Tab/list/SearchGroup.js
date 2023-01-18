import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,TouchableOpacity,View} from 'react-native';
import FastImage from 'react-native-fast-image'
import {URL} from '../../../config';

const {width}=Dimensions.get("window");
export default class PersonList extends Component{
  constructor(props){
    super(props);
    var g_i=this.props.group.findIndex(em=>em.id==this.props.item.id);
    this.g_i_source=g_i;
    this.member=this.props.item.member;
    this.state={
      group_state:g_i==-1?false:true,
      member:this.props.item.member,
    }

    this._group=this._group.bind(this);
    this.grouping=this.grouping.bind(this);
    this.ungrouping=this.ungrouping.bind(this);
  }
  g_i_source=-1;
  t_index=false;
  groupindex=0;
  member=0;
  async componentWillReceiveProps(nextProps) {
    var g_i=nextProps.group.findIndex(em=>em.id==this.props.item.id);
    if(g_i==-1){
      this.setState(prev=>({
        group_state:g_i==-1?false:true,
        member:this.g_i_source==-1?this.member:this.member-1
      }))
    }else{
      this.setState(prev=>({
        group_state:g_i==-1?false:true,
        member:this.g_i_source!=-1?this.member:this.member+1
      }))
    }
  }
  async grouping(){
    var group_temp=this.props.group;
    if(group_temp.findIndex(em=>em.id==this.props.item.id)==-1){
      group_temp.unshift({
        id:this.props.item.id,
        member:this.state.member+1
      });
      await this.props.mgrefresh_f(parseInt(Date.now()))
      this.props.setgroup(group_temp);
    };
    let data={
      group_id:this.props.item.id,
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
        alert('error')
        // await this.setState(prev=>({
        //   group_state:false,
        //   member:prev.member-1
        // }));
        this.groupindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async ungrouping(){
    var group_temp=this.props.group;
    var g_i=group_temp.findIndex(em=>em.id==this.props.item.id);
    if(g_i!==-1){
      group_temp.splice(g_i,1);
      await this.props.mgrefresh_f(parseInt(Date.now()))
      this.props.setgroup(group_temp);
    }
    let data={
      group_id:this.props.item.id,
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
        alert('error')
        // await this.setState(prev=>({
        //   group_state:true,
        //   member:prev.member+1
        // }))
        this.groupindex=0;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _group(){
    if(this.state.group_state===false){
      // await this.setState(prev=>({
      //   group_state:true,
      //   member:prev.member+1
      // }));
      if(this.groupindex===0){
        this.grouping();
      }
      this.groupindex=1;
    }else{
      // await this.setState(prev=>({
      //   group_state:false,
      //   member:prev.member-1
      // }));
      if(this.groupindex===0){
        this.ungrouping();
      }
      this.groupindex=2;
    }
  }
  render(){
    return(
      <View style={{backgroundColor:'#555'}}>
        <TouchableOpacity style={{...styles.container}} activeOpacity={0.9} onPress={() => {
            this.props.navigation.navigate("Group",{
              id:this.props.item.id,
              member:this.state.member
            })
          }}>
          <View style={{...styles.profile_img,backgroundColor:this.state.group_state==true?'#d52685':'#444'}}>
            <Image style={{width:20,height:20}} source={require('../../../assets/at.png')}/>
          </View>
          <View>
            <Text style={styles.profile_id}>{this.props.item.id}</Text>
            <Text style={styles.member}>멤버수 {this.state.member}명</Text>
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
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    height:64,
    alignItems:'center',
    backgroundColor:'#fff'
  },
  profile_img:{
    width:40,
    height:40,
    backgroundColor:'#d52685',
    marginLeft:16,
    borderRadius:40,
    overflow:'hidden',
    justifyContent:'center',
    alignItems:'center'
  },
  profile_id:{
    fontSize:16,
    marginLeft:2,
    color:'rgba(0,0,0,0.9)',
    marginLeft:16
  },
  member:{
    fontSize:12,
    color:'rgba(100,100,100,0.8)',
    marginLeft:16,
    marginTop:4
  },
  grouping_c:{
    position:'absolute',
    right:16,
    minWidth:56,
    paddingHorizontal:8,
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
})