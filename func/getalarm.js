import {URL} from '../config';


export async function getalarm({props,refresh}){
  console.log('get alarm');
  let data={
    _id:props._id,
  };
  const obj = {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST'
  }
  fetch(`${URL}/getalarm`, obj)
  .then((response) => response.json())
  .then(async (responseJson) => {
    if(responseJson.status==100){ 
      var user_arr=[];
      var alarm=responseJson.alarm.map(emP=>{
        var u_i=responseJson.user_arr.findIndex(emS=>emS.user_id==emP.user_id);
        user_arr=user_arr.concat(emP.personList);
        return{
          ...emP,
          id:responseJson.user_arr[u_i].id,
          img:responseJson.user_arr[u_i].img,
          show:true,
          type:'old'
        }
      });
      var userarr_temp=props.userarr.map(x=>x);
      user_arr.map(emP=>{
        var u_i=props.userarr.findIndex(emS=>emS.user_id==emP);
        if(u_i==-1){
          var p_i=responseJson.user_arr.findIndex(emZ=>emZ.user_id==emP);
          userarr_temp.push({
            user_id:responseJson.user_arr[p_i].user_id,
            id:responseJson.user_arr[p_i].id,
            img:responseJson.user_arr[p_i].img,
          })
        }
      });
      await props.setuserarr(userarr_temp);
      await props.setalarm([]);
      props.setalarm(alarm);
      console.log(alarm);
      if(refresh){
        let count=0;
        var alarm_leng=alarm.length;
        for(var i=0;i<alarm_leng;i++){
          if(alarm[i].read==false){
            count++;
            break;
          }
        }
        if(count>0){
          props.mainrefresh_f(parseInt(Date.now()))
        }
      }
      console.log(responseJson);
    }else{

    }
  })
  .catch((error) => {
    console.error(error);
  });
}
