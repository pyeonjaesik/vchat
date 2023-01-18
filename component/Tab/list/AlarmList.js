import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,TouchableOpacity,View} from 'react-native';
import FastImage from 'react-native-fast-image'

const {width}=Dimensions.get("window");
export default class PersonList extends Component{
  constructor(props){
    super(props);
      this.state={
        backgroundColor:'#fff',
        id:'',
        img:'',
        user_id:'',
      }
  }
  t_index=false;
  _timefunc(updatetime){
    var d1 = new Date(parseInt(Date.now()));
    var d1y=d1.getFullYear();
    var d1m=d1.getMonth()+1;
    var d1d=d1.getDate();
    var d1time=`${d1y}${d1m}${d1d}`;
    var d2 = new Date(updatetime);
    var d2y=d2.getFullYear();
    var d2m=d2.getMonth()+1;
    var d2d=d2.getDate();
    var d2time=`${d2y}${d2m}${d2d}`;
    var time=parseInt(Date.now())-updatetime;
    var h=d2.getHours();
    var m=d2.getMinutes();
    if(m<10){
      m='0'+m;  
    }    
    if(h>=13){
      h=' 오후 '+(h-12)+':'+m;  
    }else if(h>0){
      h=' 오전 '+h+':'+m;  
    }else{
      h=' 오후 '+'12'+':'+m;  
    }
    if(d1time==d2time){
      var time='오늘 '+h;
    }else{
      var time=`${d2m}월 ${d2d}일 `+h;
    }
    return time;
  }
  render(){
    switch(this.props.item.type){
      case 'new':
        return(
          <TouchableOpacity style={{...styles.container,alignItems:'flex-start',backgroundColor:this.props.item.show==true?'#fff':'rgba(180,180,180,0.15)'}} activeOpacity={1} onPress={() => {
              this.props.navigation.navigate('Video',{
                post_id:this.props.item.post_id
              })
            }}>
            <TouchableOpacity style={{...styles.profile_img,marginTop:4}} onPress={()=>{
              if(this.props.user_id==this.props.item.user_id){
                var to='MyBook';
              }else{
                var to='Book'
              }
              this.props.navigation.navigate(to,{
                item:{
                  user_id:this.props.item.user_id,
                  img:this.props.item.img,
                  id:this.props.item.id
                }
              });
            }}>
              {
                this.props.item.img===''?(
                  <Image source={require('../../../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                ):(
                  <FastImage
                    style={{width:'100%',height:'100%'}}
                    source={{
                      uri: this.props.item.img,
                      priority: FastImage.priority.normal,
                    }}
                  />
                )
              }
            </TouchableOpacity>
            <View style={{flexDirection:'column'}}>
              <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'flex-start'}}>
                <Text style={styles.info_txt}>{`${this.props.item.id}`}<Text style={{fontWeight:'normal'}}>님의 영상메시지</Text></Text>
                {
                  this.props.item.comment>0?(
                    <View style={{width:32,height:32,marginLeft:4,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <Image style={{width:20,height:20,opacity:0.9}} source={require('../../../assets/chat_blue.png')}/>
                  <Text style={{color:"#007fdb",fontSize:12,fontWeight:'bold',marginLeft:2}}>{this.props.item.comment}</Text>
                  </View>
                  ):(null)
                }
                {
                  this.props.item.love_user.length>0?(
                    <View style={{width:32,height:32,marginLeft:8,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                      <Image style={{width:22,height:22,opacity:0.9}} source={require('../../../assets/heart_pink.png')}/>
                  <Text style={{color:"rgb(234,29,93)",fontSize:12,fontWeight:'bold',marginLeft:2}}>{this.props.item.love_user.length}</Text>
                    </View>
                  ):(null)
                }
              </View>
              <View style={{width:width-90,minHeight:0,maxHeight:200,flexWrap:'wrap',flexDirection:'row',paddingLeft:8,paddingTop:8}}>
                {
                  (()=>{
                    let personList=this.props.item.personList;
                    let personListJSX=[];
                    personList.map((x)=>{
                      personListJSX.push(
                        <View style={{...styles.personList_c,flexDirection:'row',backgroundColor:x==this.props.id?'rgba(0,200,0,1)':'rgba(0,0,0,0.8)'}}
                          key={x}
                        >
                          <Text style={{...styles.groupList_txt,marginLeft:1}}>{`${x}`}</Text>
                        </View>
                      )
                    })
                    return personListJSX;
                  })()
                }
                {
                  (()=>{
                    let groupList=this.props.item.groupList;
                    let groupListJSX=groupList.map((x)=>{
                      return(
                        <View style={{...styles.groupList_c,flexDirection:'row',backgroundColor:this.props.group.findIndex(em=>em.id==x)!=-1?'rgba(234,29,93,1)':'rgba(0,0,0,0.7)'}}
                          key={x}
                        >
                          <Image style={{width:12,height:12}} source={require('../../../assets/at.png')}/>
                          <Text style={{...styles.groupList_txt,marginLeft:3}}>{`${x}`}</Text>
                        </View>
                      )
                    })
                    return groupListJSX;
                  })()
                }
              </View>
              <Text style={{color:'rgba(0,0,0,0.8)',fontSize:11,marginLeft:16,marginTop:2,marginBottom:8}}>{this._timefunc(this.props.item.ct)}</Text>
            </View>
          </TouchableOpacity>
        ) 
      case 'old':
        return(
          <TouchableOpacity style={{...styles.container,alignItems:'flex-start',backgroundColor:this.props.item.show==true?'#fff':'rgba(180,180,180,0.15)'}} activeOpacity={1} onPress={() => {
              this.props.navigation.navigate('Video',{
                post_id:this.props.item.post_id
              })
            }}>
            <TouchableOpacity style={{...styles.profile_img,marginTop:4}} onPress={()=>{
              if(this.props.user_id==this.props.item.user_id){
                var to='MyBook';
              }else{
                var to='Book'
              }
              this.props.navigation.navigate(to,{
                item:{
                  user_id:this.props.item.user_id,
                  img:this.props.item.img,
                  id:this.props.item.id
                }
              });
            }}>
              {
                this.props.item.img===''?(
                  <Image source={require('../../../assets/dog.png')} style={{width:'100%',height:'100%'}}/>
                ):(
                  <FastImage
                    style={{width:'100%',height:'100%'}}
                    source={{
                      uri: this.props.item.img,
                      priority: FastImage.priority.normal,
                    }}
                  />
                )
              }
            </TouchableOpacity>
            <View style={{flexDirection:'column'}}>
              <View style={{flexDirection:'row',flex:1,alignItems:'center',justifyContent:'flex-start'}}>
                <Text style={styles.info_txt}>{`${this.props.item.id}`}<Text style={{fontWeight:'normal'}}>님의 영상메시지</Text></Text>
                {
                  this.props.item.comment>0?(
                    <View style={{width:32,height:32,marginLeft:4,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <Image style={{width:20,height:20,opacity:0.9}} source={require('../../../assets/chat_blue.png')}/>
                  <Text style={{color:"#007fdb",fontSize:12,fontWeight:'bold',marginLeft:2}}>{this.props.item.comment}</Text>
                  </View>
                  ):(null)
                }
                {
                  this.props.item.love_user.length>0?(
                    <View style={{width:32,height:32,marginLeft:8,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                      <Image style={{width:22,height:22,opacity:0.9}} source={require('../../../assets/heart_pink.png')}/>
                  <Text style={{color:"rgb(234,29,93)",fontSize:12,fontWeight:'bold',marginLeft:2}}>{this.props.item.love_user.length}</Text>
                    </View>
                  ):(null)
                }
              </View>
              <View style={{width:width-90,minHeight:0,maxHeight:200,flexWrap:'wrap',flexDirection:'row',paddingLeft:8,paddingTop:8}}>
                {
                  (()=>{
                    let personList=this.props.item.personList;
                    let personListJSX=[];
                    personList.map((x)=>{
                      var u_i=this.props.user_arr.findIndex(em=>em.user_id==x);
                      if(u_i!=-1){
                        personListJSX.push(
                          <View style={{...styles.personList_c,flexDirection:'row',backgroundColor:x==this.props.user_id?'rgba(0,200,0,1)':'rgba(0,0,0,0.8)'}}
                            key={x}
                          >
                            <Text style={{...styles.groupList_txt,marginLeft:1}}>{`${this.props.user_arr[u_i].id}`}</Text>
                          </View>
                        )
                      }
                    })
                    return personListJSX;
                  })()
                }
                {
                  (()=>{
                    let groupList=this.props.item.groupList;
                    let groupListJSX=groupList.map((x)=>{
                      return(
                        <View style={{...styles.groupList_c,flexDirection:'row',backgroundColor:this.props.group.findIndex(em=>em.id==x)!=-1?'rgba(234,29,93,1)':'rgba(0,0,0,0.7)'}}
                          key={x}
                        >
                          <Image style={{width:12,height:12}} source={require('../../../assets/at.png')}/>
                          <Text style={{...styles.groupList_txt,marginLeft:3}}>{`${x}`}</Text>
                        </View>
                      )
                    })
                    return groupListJSX;
                  })()
                }
              </View>
              <Text style={{color:'rgba(0,0,0,0.8)',fontSize:11,marginLeft:16,marginTop:2,marginBottom:8}}>{this._timefunc(this.props.item.ct)}</Text>
            </View>
          </TouchableOpacity>
        ) 
      default:
        return null;
    }
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    minHeight:64,
    alignItems:'center',
    paddingTop:8,
  },
  profile_img:{
    width:40,
    height:40,
    backgroundColor:'#999',
    marginLeft:16,
    borderRadius:40,
    overflow:'hidden'
  },
  info_txt:{
    fontSize:14,
    marginLeft:2,
    color:'rgba(0,0,0,0.9)',
    marginLeft:16,
    fontWeight:'bold'
  },
  info_txt2:{
    marginTop:4,
    fontSize:12,
    marginLeft:2,
    marginRight:50,
    color:'rgba(0,0,0,0.7)',
    marginLeft:16,
    width:width-130
  },
  groupList_c:{
    paddingHorizontal:12,
    backgroundColor:'rgba(0,0,0,0.6)',
    marginLeft:8,
    borderRadius:20,
    height:25,
    alignItems:'center',
    marginBottom:8
  },
  personList_c:{
    paddingHorizontal:12,
    backgroundColor:'rgba(0,0,0,0.6)',
    marginLeft:8,
    borderRadius:20,
    height:25,
    alignItems:'center',
    marginBottom:8
  },
  groupList_txt:{
    fontSize:12,
    color:'#fff',
  }
})