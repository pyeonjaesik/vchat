import * as types from '../actions/type';

const initialState ={
    _id:'',
    uid:'',
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
    follow:[],
    follower:0,
    group:[],
    ///////
    post_id:[],
    ms_id:[],
    mgrefresh:0,
    home1refresh:0,
    home_hloader:false,
    mg_hloader:false,
    alarm_leng:0,
    dcarr:[]
};

export default function setinfo(state=initialState,action){
    switch(action.type){
        case types.SET_ID:
          return{
            ...state,
            _id:action._id,
          }
        case types.SETUID:
          return{
            ...state,
            uid:action.uid
          }
        case types.SETID:
          return{
            ...state,
            id:action.id
          }
        case types.SETCOIN:
          return{
            ...state,
            coin:action.coin
          }
        case types.SETALL:
          return{
            ...state,
            _id:action._id,
            uid:action.uid,
            id:action.id,
            user_id:action.user_id,
            coin:action.coin,
            logintype:action.logintype,
            pwindex:action.pwindex,
          }
        case types.SETKIT:
          return{
            ...state,
            ph:action.ph,
            email:action.email
          } 
        case types.SETPWINDEX:
          return{
            ...state,
            pwindex:action.pwindex
          }
        case types.SETITR:
          return{
            ...state,
            itr:action.itr
          }      
        case types.SETLV:
          return{
            ...state,
            post_id:action.post_id,
            ms_id:action.ms_id
          }
        case types.SETIMG:
          return{
            ...state,
            img:action.img
          }          
        case types.SETVIDEO:
          return{
            ...state,
            video:action.video
          }
        case types.SETINTRO:
          return{
            ...state,
            intro:action.intro
          }
        case types.SETPRICE:
          return{
            ...state,
            price:action.price
          }     
        case types.SETSNS:
          return{
            ...state,
            sns:action.sns
          }
        case types.SETFOLLOW:
          return{
            ...state,
            follow:action.follow
          }  
        case types.SETFOLLOWER:
          return{
            ...state,
            follower:action.follower
          }  
        case types.SETGROUP:
          return{
            ...state,
            group:action.group
          }  
        case types.SIGNOUT:
          return{
            _id:'',
            uid:'',
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
            follow:[],
            folloer:0,
            group:[],
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
            lv:[],
            post_id:[],
            ms_id:[],
            mgrefresh:0,
            home1refresh:0,
            home_hloader:false,
            mg_hloader:false,
            alarm_leng:0
          }          
        default:
          return state;        
    }
}