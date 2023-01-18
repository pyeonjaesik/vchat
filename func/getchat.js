import {URL} from '../config';
import { GiftedChat } from 'react-native-gifted-chat'


export async function getchat(props){
  console.log('get chat');
  var now_key='';
  for( let key in props.chatroom){
    if(props.chatroom[key].focus===true){
      now_key=key;
      break;
    }
  };
  let data={
    _id:props._id,
    your_user_id:now_key
  };
  const obj = {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST'
  }
  fetch(`${URL}/getchat`, obj)
  .then((response) => response.json())
  .then((responseJson) => {
    if(responseJson.status==100){
      if(now_key!=''){
        if(responseJson.room.length>0){
          var my_f_i = responseJson.info.findIndex(em=>em.user_id==props.user_id);
          var your_f_i = responseJson.info.findIndex(em=>em.user_id==now_key);
          var room = responseJson.room.map((em,index)=>{
            switch(em.type){
              case 0:
                return{
                  _id:index,
                  text:em.text,
                  createdAt:em.ct,
                  type:em.type,
                  read:index<responseJson.info[your_f_i].bedge?false:true,
                  user_id:em.user_id,
                  user:{
                    _id:em.user_id==responseJson.info[my_f_i].user_id?1:2,
                    name:responseJson.profile.id,
                    avatar:responseJson.profile.img
                  }
                }
              case 1:
                return{
                  ...em,
                  _id:index,
                  text:em.text,
                  createdAt:em.ct,
                  post_id:em.post_id,
                  type:em.type,
                  myname:em.myname,
                  friendname:em.friendname,
                  coin:em.coin,
                  read:index<responseJson.info[your_f_i].bedge?false:true,
                  user_id:em.user_id,
                  user:{
                    _id:em.user_id==responseJson.info[my_f_i].user_id?1:2,
                    name:responseJson.profile.id,
                    avatar:responseJson.profile.img
                  }
                }
                case 10:
                  return{
                    ...em,
                    _id:index,
                    text:em.text,
                    createdAt:em.ct,
                    post_id:em.post_id,
                    ms_id:em.ms_id,
                    type:em.type,
                    coin:em.coin,
                    read:index<responseJson.info[your_f_i].bedge?false:true,
                    user_id:em.user_id,
                    user:{
                      _id:em.user_id==responseJson.info[my_f_i].user_id?1:2,
                      name:responseJson.profile.id,
                      avatar:responseJson.profile.img
                    }
                  } 
                case 2:
                  return{
                    ...em,
                    _id:index,
                    text:em.text,
                    createdAt:em.ct,
                    post_id:em.post_id,
                    ms_id:em.ms_id,
                    type:em.type,
                    coin:em.coin,
                    read:index<responseJson.info[your_f_i].bedge?false:true,
                    user_id:em.user_id,
                    user:{
                      _id:em.user_id==responseJson.info[my_f_i].user_id?1:2,
                      name:responseJson.profile.id,
                      avatar:responseJson.profile.img
                    }
                  } 
            }
          });
          props.setchatroom({
            ...props.chatroom,
            [now_key]:{
              room,
              focus:true
            }
          });
        }else{
          props.setchatroom({
            ...props.chatroom,
            [now_key]:{
              room:[],
              focus:true
            }
          });
          var chatlist_index=false;
          var tpc_l=props.chatlist.length;
          var chatlist_temp=props.chatlist.map(x=>x);
          chatlist_temp.push({
            info:[
              {
                user_id:props.user_id,
                show:true,
                bedge:0
              },
              {
                user_id:now_key,
                show:true,
                bedge:0
              },
            ],
            room:{
              type:9999,
              user_id:now_key,
              text:'',
              ct:parseInt(Date.now())
            },
            updatetime:parseInt(Date.now()),
            profile:{id:responseJson.profile.id,img:responseJson.profile.img}
          })
          for(var i=0;i<tpc_l;i++){
            var your_f_i=props.chatlist[i].info.findIndex(em=>em.user_id==now_key);
            if(your_f_i!==-1){
              chatlist_index=true;
              break;
            }
          }
          if(chatlist_index===false){
            props.setchatlist(chatlist_temp)
          }
        }
      }
      var chatlist=responseJson.post.map(emP=>{
        for(var i=0;i<2;i++){
          if(emP.info[i].user_id!=props.user_id){
            let f_i=responseJson.user_arr.findIndex(emS=>emS.user_id==emP.info[i].user_id);
            if(f_i!==-1){
              return{
                ...emP,
                profile:{
                  id:responseJson.user_arr[f_i].id,
                  img:responseJson.user_arr[f_i].img,
                }
              }
            }
          }
        }
      });
      props.setchatlist(chatlist);
      if(chatlist.length==0){
        console.log('채팅 내역 없음')
      }
    }else{
      console.log('getchatlist: err status:'+responseJson.status);
    }
  })
  .catch((error) => {
    console.error(error);
  });
}
