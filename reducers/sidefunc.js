import * as types from '../actions/type';

const initialState ={
    _id:'',
    id:'',
    user_id:'',
    coin:0,
    logintype:'',
    email:'',
    ph:'',
    pwindex:'false',
    itr:0,
    img:'',
    video:'',
    intro:'',
    price:0,
    sns:{
      instagram:{
        url:'',
        follow:0
      },
      youtube:{
        url:'',
        follow:0
      },
      tiktok:{
        url:'',
        follow:0
      },
      africa:{
        url:'',
        follow:0
      },
    },
    backhandler:true,
    socket:{},
    chatlist:[],
    chatroom:{},
    lv:[],
    userarr:[],
    alarm:[],
    page:'home',
    bottom:0,
    progress:0,
    mgrefresh:0,
    home1refresh:0,
    mainrefresh:0,
    comment:[],
    ///////
    post_id:[],
    ms_id:[],
    home_hloader:false,
    mg_hloader:false,
    alarm_leng:0,
    dcarr:[],
    barStyle:'light-content'
};

export default function sidefunc(state=initialState,action){
    switch(action.type){
      case types.BACKHANDLER:
        return{
          ...state,
          backhandler:action.backhandler,
        }
      case types.SETSOCKET:
        return{
          ...state,
          socket:action.socket,
        }
      case types.SETCHATLIST:
        return{
          ...state,
          chatlist:action.chatlist,
        }
      case types.SETCHATROOM:
        return{
          ...state,
          chatroom:action.chatroom,
        }
      case types.SETUSERARR:
        return{
          ...state,
          userarr:action.userarr,
        }
      case types.SETLV:
        return{
          ...state,
          lv:action.lv,
        }
      case types.SETALARM:
        return{
          ...state,
          alarm:action.alarm,
        }
      case types.BARSTYLE:
        return{
          ...state,
          barStyle:action.barStyle,
        }  
      case types.PAGE:
        return{
          ...state,
          page:action.page,
        }
      case types.BOTTOM:
        return{
          ...state,
          bottom:action.bottom,
        } 
      case types.PROGRESS:
        return{
          ...state,
          progress:action.progress,
        } 
      case types.MGREFRESH:
        return{
          ...state,
          mgrefresh:action.mgrefresh,
        }
      case types.HOME1REFRESH:
        return{
          ...state,
          home1refresh:action.home1refresh,
        } 
      case types.MAINREFRESH:
        return{
          ...state,
          mainrefresh:action.mainrefresh,
        } 
      case types.SETCOMMENT:
        return{
          ...state,
          comment:action.comment,
        }          
      ////////////////////
      case types.HOME_HLOADER:
        return{
          ...state,
          home_hloader:action.home_hloader,
        } 
      case types.MG_HLOADER:
        return{
          ...state,
          mg_hloader:action.mg_hloader,
        }
      case types.ALARM_LENG:
        return{
          ...state,
          alarm_leng:action.alarm_leng,
        }
      case types.DCARR:
        return{
          ...state,
          dcarr:action.dcarr,
        }  
      case types.DCARR1:
        if(state.dcarr.indexOf(action.key)===-1){
          return{
            ...state,
            dcarr:[...state.dcarr,action.key]
          }
        }else{
          return{
            ...state
          }
        }
      case types.DCARR2:
        var dci=state.dcarr.indexOf(action.key);
        if(dci===-1){
          return{
            ...state
          }
        }else{
          var dcarr=state.dcarr;
          dcarr.splice(dci,1);
          return{
            ...state,
            dcarr
          }
        }               
      default:
        return state;        
    }
}