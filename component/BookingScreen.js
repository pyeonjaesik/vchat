import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text,TextInput,ScrollView,Dimensions,FlatList,Platform,StatusBar} from 'react-native';
import ShowItem from './ShowItem';
// import Dialog from './Dialog';
import Toast from 'react-native-simple-toast';
import {KeyboardAvoidingView} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {URL} from '../config';
import BookPass from './BookPass';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? getStatusBarHeight() : StatusBar.currentHeight;
const {width,height}=Dimensions.get("window");
class BookingScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      setpw:'',
      dialog:false,
      whom:true,
      page:0,
      myname:'',
      friendname:'',
      text:'',
      roll_result:[],
      book_user_id:this.props.navigation.getParam('book_user_id'),
      book_price:this.props.navigation.getParam('book_price'),
    }
    console.log(this.state.book_user_id);
    // this.didFocus=this.props.navigation.addListener(
    //   'didFocus',
    //   payload => {
    //     this.props.setRollResult(this.props.navigation.getParam('result', []));
    //   }
    // );
    this.setPW=this.setPW.bind(this);

    this._post=this._post.bind(this);
  }
  static navigationOptions = {
    header:null
  };
  didFocus;
  update_index=false;
  resultcoin=0;

  componentWillUnmount(){
    // this.didFocus.remove();
  }
  setPW(n){
    this.setState({setpw:n});
  }
  async _post(){
    this.props.setcoin(this.props.coin-this.state.book_price);
    let roll_result = this.state.roll_result;
    let formData = new FormData();
    // if(roll_result.length>1){
    //   for(var i=0;i<roll_result.length;i++){
    //     await ImageResizer.createResizedImage(roll_result[i].uri, 1000, 1000, 'JPEG', 50, rotation=0, null).then((response) => {
    //       roll_result[i].uri=response.uri;
    //     }).catch((err) => {
    //       console.log('resizing err');
    //       alert('imageresizing err');
    //       return;
    //     });
    //   }
    //   let imagemode='';
    //   roll_result.forEach((elm,index)=>{
    //     formData.append("file", {
    //       uri: roll_result[index].uri,
    //       type: roll_result[index].type,
    //       name: 'coooolname',
    //     });
    //     imagemode+=elm.mode;
    //   });
    //   formData.append('imagemode',imagemode);
    // }else if(roll_result.length==1){
    //   if(roll_result[0].dur>0){
    //     formData.append("file", {
    //       uri: roll_result[0].uri,
    //       type: roll_result[0].type,
    //       name: 'coooolname',
    //     });
    //     formData.append('dur',roll_result[0].dur);
    //     let ratio=roll_result[0].ratio.toString();
    //     formData.append('imagemode',ratio);
    //   }else{
    //     await ImageResizer.createResizedImage(roll_result[0].uri, 1000, 1000, 'JPEG', 50, rotation=0, null).then((response) => {
    //       roll_result[0].uri=response.uri;
    //     }).catch((err) => {
    //       console.log('resizing err');
    //       alert('imageresizing err');
    //       return;
    //     });
    //     formData.append("file", {
    //       uri: roll_result[0].uri,
    //       type: roll_result[0].type,
    //       name: 'coooolname',
    //     });
    //     Image.getSize(roll_result[0].uri,(width,height)=>{
    //       console.log('getSize:'+width+'/'+height);
    //       let ratio=(height/width).toString();
    //       formData.append('imagemode',ratio);
    //       formData.append('text',result_txt);
    //       formData.append('coin',this.state.setcoin);
    //       formData.append('pw',this.state.setpw);
    //       formData.append('_id',this.props._id);
    //       formData.append('id',this.props.id);
    //       formData.append('user_id',this.props.user_id);
          
    //       const options = {
    //         method: 'POST',
    //         body: formData
    //       };
    //       fetch(`${URL}/uploadpost`, options)
    //       .then((response) => response.json())
    //       .then((responseJson) => {
    //         this.props.home_hloader(false);
    //         if(responseJson.status===100){
    //           Toast.show('미션을 성공적으로 업로드 하였습니다.');
    //           this.props.setcoin(responseJson.coin);
    //           this.props.home1refresh(parseInt(Date.now()));
    //         }else{
    //           Toast.show('미션 업로드중 문제가 발생하였습니다.');
    //         }
      
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });
    //     });
    //     return;
    //   }
    // }
    

    formData.append('pw',this.state.setpw);
    formData.append('_id',this.props._id);
    formData.append('id',this.props.id);
    formData.append('user_id',this.props.user_id);

    formData.append('myname',this.state.myname);
    if(this.state.whom===true){
      formData.append('friendname',this.state.friendname)
    }else{
      formData.append('friendname','')
    }
    formData.append('text',this.state.text);

    formData.append('book_price',this.state.book_price);
    formData.append('book_user_id',this.state.book_user_id);

    const options = {
      method: 'POST',
      body: formData
    };
    fetch(`${URL}/uploadpost`, options)
    .then((response) => response.json())
    .then(((responseJson) => {
      if(responseJson.status===100){
        Toast.show('영상 주문을 완료하였습니다.');
        this.props.navigation.goBack();
        // this.props.setcoin(responseJson.coin);
      }else{
        Toast.show('영상 주문 중 문제가 발생하였습니다.');
        this.props.navigation.goBack();
      }

    }).bind(this))
    .catch((error) => {
      console.error(error);
    });
  }
  render(){
    return(
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==='ios'?"height":""} enabled>
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'} translucent={true}/>
        <TouchableOpacity style={styles.leftbtn}
          onPress={()=>{
            if(this.state.page===0){
              this.props.navigation.goBack();
            }else{
              this.setState({
                page:0
              })
            }
          }}
        >
          <Image source={require('../assets/left_mint.png')} style={{width:40,height:40}}/>
        </TouchableOpacity>
        {
          this.state.page===0?(
            <View style={{flex:1}}>
              <View style={styles.ScrollView_container}>
                <ScrollView style={styles.main}>
                  <Text style={styles.title}>이름을 입력해 주세요.</Text>
                  <TextInput 
                    style={{...styles.myname_input}}
                    placeholder='홍길동'
                    multiline={false}
                    ref='mynameInput'
                    onChangeText={(myname)=>{
                      this.setState({myname})
                      // this.props.setText(text)
                    }}
                  />
                  <View style={styles.whom_container}>
                    <Text style={styles.title}>선물용으로 제작하시나요?</Text>
                    <View style={styles.whom_select_container}>
                      <TouchableOpacity style={this.state.whom==true?styles.whom_button_clicked:styles.whom_button} onPress={()=>{
                        this.setState({whom:true});
                      }}>
                        <Text style={this.state.whom==true?styles.whom_button_txt_clicked:styles.whom_button_txt}>네</Text>
                      </TouchableOpacity>  
                      <TouchableOpacity style={this.state.whom!==true?styles.whom_button_clicked:styles.whom_button} onPress={()=>{
                        this.setState({whom:false});
                      }}>
                        <Text style={this.state.whom!==true?styles.whom_button_txt_clicked:styles.whom_button_txt}>아니요</Text>
                      </TouchableOpacity>  
                    </View>
                    {
                      this.state.whom===true?(
                        <View style={{width,marginTop:10}}>
                          <Text style={styles.title}>상대방 이름을 입력해주세요.</Text>
                          <TextInput 
                          style={{...styles.myname_input}}
                          placeholder='피터'
                          multiline={false}
                          // autoFocus={true}
                          ref='mynameInput'
                          onChangeText={(friendname)=>{
                            this.setState({friendname})
                          }}
                          // value={this.props.text}
                          />
                        </View>
                      ):(null)
                      }
                  </View>
                  <Text style={styles.title}>요청 내용을 입력해주세요.</Text>
                  <TextInput 
                    style={{...styles.instruction_input}}
                    placeholder={this.state.whom==true?'피터에게 생일 축하한다고 말해주세요.':'생일 축하한다고 말해주세요.'}
                    multiline={true}
                    // autoFocus={true}
                    ref='mynameInput'
                    onChangeText={(text)=>{
                      this.setState({text})
                      // this.props.setText(text)
                    }}
                    // value={this.props.text}
                  />

                </ScrollView>
              </View>
              <View style={styles.bottom_container}>
                <TouchableOpacity style={styles.attach} onPress={()=>{
                  this.props.navigation.navigate('Picker',{
                    roll:this.props.roll
                  });
                }}>
                <Text style={styles.attach_txt}>사진/동영상 추가</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.finish} onPress={()=>{
                  // this.refs.mainInput.blur();
                  if(parseInt(this.props.coin)>=parseInt(this.state.book_price)){
                    if(this.state.myname.length==0){
                      Toast.show('이름을 적어주세요.');
                      return;
                    }
                    if(this.state.whom===true&&this.state.friendname.length==0){
                      Toast.show('상대방 이름을 적어주세요.');
                      return;
                    }
                    if(this.state.text.length==0){
                      Toast.show('요청 사항을 적어주세요.');
                      return;
                    }
                    this.setState({page:1})
                  }else{
                    alert('금액부족')
                  }
                  }}>
                <Text style={styles.finish_txt}>{`주문 $${this.state.book_price}`}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ):(
            <BookPass 
              instruction={{
                myname:this.state.myname,
                friendname:this.state.friendname,
                text:this.state.text,
                whom:this.state.whom,
              }}
              success={this._post}
              _id={this.props._id} 
              setPW={this.setPW} 
          />
          )
        }
        {/* {
          this.state.dialog===true?(
          <Dialog 
            _ok={this._ok} 
            _cancel={this._cancel} 
            subject='새 미션' 
            main={this.props.coin+'다트를 포상으로 하여 정말로 미션을 게시하시겠습니까?'}/>
          ):(null)
        } */}
      </KeyboardAvoidingView>
    )
    
  }
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  leftbtn:{
    marginTop:STATUSBAR_HEIGHT,
    marginLeft:0,
    height:55,
    width:55,
    justifyContent:'center',
    alignItems:'center'
  },
  ScrollView_container:{
    width,
    flex:1,
  },
  title:{
    fontSize:22,
    color:'#000',
    fontWeight:'bold',
    marginLeft:25,
    marginTop:10
  },
  subject:{
    fontSize:25,
    fontWeight:'500',
    color:'rgb(22,23,27)',
    textAlign:'center',
    alignSelf:'center',
    marginTop:-30,
  },
  main:{
    marginTop:50,
    flex:1,
    bottom:50,
  },
  myname_input:{
    marginTop:20,
    paddingHorizontal:20,
    fontSize:17,
    marginVertical:6,
    width:width-40,
    height:50,
    alignSelf:'center',
    backgroundColor:'rgb(240,240,240)',
    borderWidth:1,
    borderColor:'rgb(200,200,200)',
    borderRadius:10
  },
  whom_container:{
    width,
    paddingBottom:10
  },
  whom_select_container:{
    width:width-30,
    height:50,
    // backgroundColor:'red',
    alignSelf:'center',
    marginTop:15,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
  },
  whom_button:{
    width:(width-30)/2-50,
    height:50,
    // backgroundColor:'green',
    borderRadius:50,
    borderWidth:2,
    borderColor:'rgb(200,200,200)',
    justifyContent:'center',
    alignItems:'center'
  },
  whom_button_clicked:{
    width:(width-30)/2-50,
    height:50,
    backgroundColor:'#ea1d5d',
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center'
  },
  whom_button_txt:{
    fontSize:20,
    fontWeight:'bold',
    color:'rgb(150,150,150)'
  },
  whom_button_txt_clicked:{
    fontSize:20,
    fontWeight:'bold',
    color:'#fff'
  },
  instruction_input:{
    marginTop:20,
    paddingHorizontal:20,
    fontSize:17,
    marginVertical:6,
    width:width-40,
    height:300,
    alignSelf:'center',
    backgroundColor:'rgb(240,240,240)',
    borderWidth:1,
    borderColor:'rgb(200,200,200)',
    borderRadius:10
  },
  bottom_container:{
    position:'absolute',
    left:0,
    bottom:0,
    width:'100%',
    height:50,
    backgroundColor:'white',
    borderTopWidth:1,
    borderColor:'rgba(150,150,150,0.2)',
    flexDirection:'row',
    alignItems:'center',
  },
  bottom_txt:{
    color:'rgb(70,70,70)',
    fontSize:20,
    paddingLeft:15
  },
  attach:{
    position:'absolute',
    height:50,
    top:0,
    left:20,
    justifyContent:'center',
    alignItems:'center',
  },
  attach_txt:{
    fontSize:16,
    color:'rgb(22,23,27)',
    fontWeight:'400'
  },
  backgroundVideo: {
    position: 'absolute',
    top: 30,
    left: 0,
    width:300,
    height:300,
  },
  finish:{
    position:'absolute',
    top:7.5,
    right:20,
    height:35,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:40,
    backgroundColor:'#ea1d5d',
    paddingHorizontal:20
  },
  finish_txt:{
    fontSize:16,
    color:'rgb(240,240,240)',
    fontWeight:'bold'
  }
});
const mapStateToProps = (state) =>{
  return{
    _id:state.setinfo._id,
    id:state.setinfo.id,
    user_id:state.setinfo.user_id,
    coin:state.setinfo.coin
  }
}
const mapDispatchToProps = (dispatch) =>{
  return{
    setcoin: (coin)=>{
      dispatch(actions.setcoin(coin));
    },
  }   
}
export default connect(mapStateToProps,mapDispatchToProps)(BookingScreen);