import * as types from './type';

export function set_id(_id){
    return{
        type: types.SET_ID,
        _id: _id
    };
}
export function setuid(uid){
    return{
        type: types.SETUID,
        uid
    };
}
export function setid(id){
    return{
        type: types.SETID,
        id: id
    };
}
export function setcoin(coin){
    return{
        type: types.SETCOIN,
        coin: coin
    };
}
export function setall(_id,id,user_id,coin,logintype,pwindex,uid){
    return{
        type: types.SETALL,
        _id:_id,
        id:id,
        uid,
        user_id:user_id,
        coin: coin,
        logintype:logintype,
        pwindex:pwindex,
    };
}
export function setkit(ph,email){
    return{
        type: types.SETKIT,
        ph: ph,
        email:email
    };
}
export function setitr(itr){
    return{
        type: types.SETITR,
        itr: itr,
    };
}
export function setpwindex(pwindex){
    return{
        type: types.SETPWINDEX,
        pwindex:pwindex
    };
}
export function setimg(img){
    return{
        type: types.SETIMG,
        img
    };
}
export function setvideo(video){
    return{
        type: types.SETVIDEO,
        video,
    };
}
export function setintro(intro){
    return{
        type: types.SETINTRO,
        intro,
    };
}
export function setsns(sns){
    return{
        type: types.SETSNS,
        sns,
    };
}
export function setprice(price){
    return{
        type: types.SETPRICE,
        price,
    };
}
export function setsocket(socket){
    return{
        type: types.SETSOCKET,
        socket,
    };
}
export function setchatlist(chatlist){
    return{
        type: types.SETCHATLIST,
        chatlist,
    };
}
export function setchatroom(chatroom){
    return{
        type: types.SETCHATROOM,
        chatroom,
    };
}
export function setfollow(follow){
    return{
        type: types.SETFOLLOW,
        follow,
    };
}
export function setfollower(follower){
    return{
        type: types.SETFOLLOWER,
        follower,
    };
}
export function setgroup(group){
    return{
        type: types.SETGROUP,
        group,
    };
}
export function setlv(lv){
    return{
        type: types.SETLV,
        lv
    };
}
export function setuserarr(userarr){
    return{
        type: types.SETUSERARR,
        userarr
    };
}
export function setalarm(alarm){
    return{
        type: types.SETALARM,
        alarm
    };
}
export function backhandler(boolean){
    return{
        type: types.BACKHANDLER,
        backhandler:boolean
    };
}
export function barStyle(barStyle){
    return{
        type: types.BARSTYLE,
        barStyle
    };
}
export function page(page){
    return{
        type: types.PAGE,
        page
    };
}
export function bottom(bottom){
    return{
        type: types.BOTTOM,
        bottom
    };
}
export function progress(progress){
    return{
        type: types.PROGRESS,
        progress
    };
}
export function mgrefresh(index){
    return{
        type: types.MGREFRESH,
        mgrefresh:index
    };
}
export function home1refresh(index){
    return{
        type: types.HOME1REFRESH,
        home1refresh:index
    };
}
export function home_hloader(index){
    return{
        type: types.HOME_HLOADER,
        home_hloader:index
    };
}
export function mainrefresh(mainrefresh){
    return{
        type: types.MAINREFRESH,
        mainrefresh
    };
}
export function setcomment(comment){
    return{
        type: types.SETCOMMENT,
        comment
    };
}
//////////////////for dart////

export function mg_hloader(index){
    return{
        type: types.MG_HLOADER,
        mg_hloader:index
    };
}
export function alarm_leng(alarm_leng){
    return{
        type: types.ALARM_LENG,
        alarm_leng
    };
}
export function signout(){
    return{
        type: types.SIGNOUT,
    };
}
export function dcarr(dcarr){
    return{
        type: types.DCARR,
        dcarr
    };
}
export function dcarr1(key){
    return{
        type: types.DCARR1,
        key
    };
}
export function dcarr2(key){
    return{
        type: types.DCARR2,
        key
    };
}