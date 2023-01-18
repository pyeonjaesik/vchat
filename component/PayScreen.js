import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Dimensions,Text,ScrollView,StatusBar} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
// import {MyStatusBar} from './MyStatusBar';
import {URL} from '../config';
import DialogC from './dialog/DialogC';
import DialogA from './dialog/DialogA';
// import Ripple from 'react-native-material-ripple';
import IMP from 'iamport-react-native';
import Toast from 'react-native-simple-toast';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight ;

const {width}=Dimensions.get("window");

class PayScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      pay_index:false,
      pay_amount:'1100',
      pay_method:'card',
      pay_mct:'0',
      dialog:false,
      dialogA:false,
      dialogA_txt:''
    }
    this._btnL=this._btnL.bind(this);
    this._btnR=this._btnR.bind(this);
    this._cancel=this._cancel.bind(this);
    this._dialog=this._dialog.bind(this);
    this._dialogA=this._dialogA.bind(this);
    this._payComplete=this._payComplete.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  _payComplete(imp_uid){
    let data={
      imp_uid:imp_uid
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/payments/complete`, obj)
    .then((response) => response.json())
    .then(((responseJson) => {
      if(responseJson.status===100){
        this.setState({
          pay_index:false,
        });
        this.props.setcoin(responseJson.coin);
        this.props.navigation.goBack();
        Toast.show('결재에 성공하였습니다.');
      }else if(responseJson.status>=800 &&responseJson.status<900){
        alert(`
        결제완료에 실패하였습니다. 
        개발진에서 에러증상(errorcode:${responseJson.status})을 토대로 검사가 실시됩니다. 
        자세한 문의는 dartDEV@gmail.com 로 해주시기바랍니다.
        `);
      }else{
        alert(`
          결제완료에 실패하였습니다.
          dartDEV@gmail.com 로 아래의 에러코드를 보내주시기 바랍니다.
          errorcode:${responseJson.status}
        `);
      }
    }).bind(this))
    .catch((error) => {
      console.error(error);
    });
  }
  _btnL(){
    if(parseInt(this.state.pay_amount)>5000){
      alert('소액결제가 불가합니다. 더 적은 금액의 해피볼을 구매하시거나 카드로 구매해 주시기바랍니다.');
      return;
    }
    let data={
      _id:this.props._id,
      amount:parseInt(this.state.pay_amount)*110,
      method:'phone'
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/makemct`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status===100){
        console.log('makemct success');
        console.log('mct:'+responseJson.mct)
        this.setState({
          dialog:false,
          pay_index:true,
          pay_method:'phone',
          pay_mct:responseJson.mct
        })
      }else if(responseJson.status>=700&&responseJson.status<800){
        this._dialogA(responseJson.alert);
      }else{
        alert('makemct failed');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _btnR(){
    let data={
      _id:this.props._id,
      amount:parseInt(this.state.pay_amount)*110,
      method:'card'
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/makemct`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status===100){
        console.log('makemct success');
        this.setState({
          dialog:false,
          pay_index:true,
          pay_method:'card',
          pay_mct:responseJson.mct
        });
      }else{
        alert('makemct failed');
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  _cancel(){
    this.setState({
      dialog:false,
      dialogA:false
    });
  }
  _dialog({pay_amount}){
    this.setState({
      dialogA:false,
      dialog:true,
      pay_amount
    })
  }
  _dialogA(txt){
    this.setState({
      dialog:false,
      dialogA:true,
      dialogA_txt:txt
    })
  }
  render(){
    return(
      <View style={styles.container}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <View style={styles.header}>
          <TouchableOpacity style={styles.leftbtn}
              onPress={() => this.props.navigation.goBack()}
          >
            <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
          </TouchableOpacity>
          <Text style={styles.subject}>해피볼 구매</Text>
        </View>
        {
          this.state.pay_index===true?(
            <IMP.Payment
            userCode={'imp77888976'} // 가맹점 식별코드
            data={{
              pg: 'html5_inicis',
              pay_method: this.state.pay_method,
              name: this.state.pay_amount*110+'해피볼',
              digital:false,
              merchant_uid: this.state.pay_mct,
              amount: this.state.pay_amount*110,
              buyer_name: `${this.props.id}/${this.props.user_id}`,
              buyer_tel: '010',
              buyer_email: 'your@email',
              // buyer_addr: '서울시 강남구 신사동 661-16',
              // buyer_postcode: '06018',
              app_scheme: '퍼피',
            }} // 결제 데이터
            callback={(rsp)=>{
              this._payComplete(rsp.imp_uid)
            }} // 결제 종료 후 콜백
            // loading={{
            //   message: '잠시만 기다려주세요...', // 로딩화면 메시지 
            //   image: require('../assets/loading.png') // 커스텀 로딩화면 이미지
            // }}
            />
          ):(
            <ScrollView style={{flex:1}}>
              {
                (()=>{
                  let dartArr=[10,20,30,50,100,200,300,400,500];
                  let dartJSX=dartArr.map((x)=>{
                    return(
                      <TouchableOpacity style={styles.comp}
                      rippleContainerBorderRadius={50}
                      rippleColor={'#ffffff'}
                      rippleDuration={300}
                      onPress={
                        ()=>{
                          this._dialog({pay_amount:x})
                        }
                      }
                      key={x}  
                    >
                      <Text style={styles.comp_txt}>{`해피볼 ${x}개 (${(x*110).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 원)`}</Text>
                    </TouchableOpacity>
                    )
                  })
                  return dartJSX;
                })()
              }
              <TouchableOpacity style={styles.url}
                onPress={()=>{
                  // this.props.navigation.navigate('Web',{type:3})
                }}
              >
                <Text style={styles.url_txt}>유료서비스이용약관 바로가기</Text>
              </TouchableOpacity>
          </ScrollView>
          )
        }
        {
          this.state.dialog===true?(
            <DialogC 
              subject='결제 수단'
              main={'어떤 결제 수단으로 \n'+this.state.pay_amount+' 해피볼을 구매하시겠습니까?' }
              _btnL={this._btnL}
              _btnR={this._btnR}
              _cancel={this._cancel}
              btnL_txt={'핸드폰 소액 결제'}
              btnR_txt={'카드'}
            />
          ):(null)
        }
        {
          this.state.dialogA===true?(
            <DialogA 
              subject='결제 불가'
              main={this.state.dialogA_txt}
              _cancel={this._cancel}
            />
          ):(null)
        }
      </View>
    )
    
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  header:{
    marginTop:STATUSBAR_HEIGHT,
    height:55,
    flexDirection:'row',
    alignItems:'center'
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
    fontSize:19,
    fontWeight:'600',
    marginLeft:5,
    color:'#000000'
  },
  comp:{
    width:'80%',
    height:50,
    alignSelf:'center',
    backgroundColor:'#ea1d5d',
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    marginBottom:10,
  },
  comp_txt:{
    fontSize:18,
    color:'#ffffff'
  },
  url:{
    marginTop:13,
    alignItems:'center',
    marginBottom:15
  },
  url_txt:{
    fontSize:14,
    color:'#000'
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    id:state.setinfo.id,
    user_id:state.setinfo.user_id
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
      setcoin: (coin)=>{
        dispatch(actions.setcoin(coin));
      },
  }   
}

export default connect(mapStateToProps,mapDispatchToProps)(PayScreen);