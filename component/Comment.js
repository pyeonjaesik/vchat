import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions,Animated,TextInput,FlatList,KeyboardAvoidingView,Keyboard,Platform} from 'react-native';
import {URL} from '../config';
import CommentList from './Tab/list/CommentList';

const {width,height}=Dimensions.get("window");
const AnimatedFlatList= Animated.createAnimatedComponent(FlatList);
const { State: TextInputState } = TextInput;

export default class Comment extends Component{
  constructor(props){
    super(props);
    this.state={
      text:'',
      post:[],
      comment:[],
      number:0,
      player:[],
      keyboard:false,
      scrollEnabled:true,
      keyboardView:false,
      messages:[],
      headerloader:false,
      log:false
    }
    this.backInt=this.props.backInt;
    this._getfetch=this._getfetch.bind(this);
    this._send=this._send.bind(this);
    this._scrollTo=this._scrollTo.bind(this);
    this.renderBefore=this.renderBefore.bind(this);
    this._commentRead=this._commentRead.bind(this);

    this._keyboardDidShow=this._keyboardDidShow.bind(this);
    this._keyboardDidHide=this._keyboardDidHide.bind(this);
  }
  componentWillMount () {
    if(Platform.OS==='ios'){
      this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);
    }else{
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
  }
  componentDidMount(){
    this.props.page_f(`comment${this.props.post_id}`)
  }
  componentWillUnmount () {
    this.props.page_f(`video${this.props.post_id}`)
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  async _keyboardDidShow () {
  }
  async _keyboardDidHide () {
    this.setState({
      keyboardView:false
    })
  }
  hideIndex=false;
  commentSource=[];
  _getfetch(){
    let data={
      post_id:this.props.post_id,
      user_id:this.props.user_id
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/getcomment`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        var commentlist=[];
        responseJson.comment.map((emP,index)=>{
          let f_i=responseJson.user_arr.findIndex(emS=>emS.user_id==emP.user_id);
          if(f_i!==-1){
            commentlist.push({
              ...emP,
              id:responseJson.user_arr[f_i].id,
              img:responseJson.user_arr[f_i].img,
              index
            });
          }
        });  
        if(commentlist.length==0){
          responseJson.player=[];
        }
        console.log(responseJson);
        var u_i=responseJson.player.findIndex(em=>em.user_id==this.props.user_id);
        if(u_i==-1){
          var read_n=0;
        }else{
          var read_n=responseJson.player[u_i].read;
        }
        let comment_spliced=commentlist.splice(read_n,1000000);
        this.commentSource=commentlist.map(x=>x);
        var counted=0;
        //comment_spliced ==> 신 , this.commentSource ==> 구
        for(var i=commentlist.length-1;i>=0;i--){
          comment_spliced.unshift(commentlist[i]);
          this.commentSource.pop();
          if(i>0){
            if(commentlist[i-1].user_id!=commentlist[i].user_id){
              counted++;
            }
          }
          if(counted>=2){
            break;
          }
        }
        if(this.commentSource.length>0){
          await this.setState({
            headerloader:true
          });
        }
        this.props.setcomment({
          ...this.props.comment,
          [this.props.post_id]:comment_spliced
        });
        if(responseJson.comment.length==0){
          this.setState({
            log:true
          })
        }
      }else{
        
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async renderBefore(){
    var commentSource_temp=this.commentSource.map(x=>x);
    this.commentSource=[];
    await this.props.setcomment({
      ...this.props.comment,
      [this.props.post_id]:commentSource_temp.concat(this.props.comment[this.props.post_id])
    });
    this.setState({
      headerloader:false
    })
  }
  async _send({text}){
    if(text.length==0){
      return;
    }
    await Keyboard.dismiss();
    var comment_temp=this.props.comment[this.props.post_id];
    comment_temp.push({
      user_id:this.props.user_id,
      id:this.props.id,
      img:'',
      text,
      ct:parseInt(Date.now())
    })
    await this.props.setcomment({
      ...this.props.comment,
      [this.props.post_id]:comment_temp
    });
    await this.setState({
      text:'',
    });
    let data={
      _id:this.props._id,
      post_id:this.props.post_id,
      text
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/comment`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status=100){
      }else{

      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async _commentRead(){
    let data={
      user_id:this.props.user_id,
      post_id:this.props.post_id,
    };
    const obj = {
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST'
    }
    fetch(`${URL}/commentRead`, obj)
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status=100){
      }else{

      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  currentCommentLength=100000;
  async componentWillReceiveProps(nextProps) {
    if(this.backInt!=nextProps.backInt||nextProps.page=='background'){
      this.hideIndex=false;
      await this.refs._commentView._component.scrollTo({y: 0});
      setTimeout((()=>{
        this.props._comment(false,'');
      }).bind(this),600);
    }
    console.log(nextProps.comment[this.props.post_id].length+'/'+this.commentSource.length+'/'+this.currentCommentLength)
    if(nextProps.comment[this.props.post_id].length+this.commentSource.length>this.currentCommentLength){
      this._scrollTo(nextProps.comment[this.props.post_id].length-1);
      let next_user_id=nextProps.comment[this.props.post_id][nextProps.comment[this.props.post_id].length-1].user_id;
      if(next_user_id!=this.props.user_id){
        this._commentRead();
      }
    }
    this.currentCommentLength=nextProps.comment[this.props.post_id].length+this.commentSource.length;
  }
  scroll=0;
  toIndex=0;
  _scrollTo(index){
    this.toIndex=index;
    this.refs._ListView.scrollToIndex({
      index,
      animated:true
    });
  }
  render(){
    return(
      <>
      <View style={{
        ...styles.container,
        position:'absolute',
        width,
        height,
        top:0,
        left:0
      }}>
        <TouchableOpacity style={{height:height-this.props.height}}
          onPress={async ()=>{
            this.hideIndex=false;
            await this.refs._commentView._component.scrollTo({y: 0});
            setTimeout((()=>{
              this.props._comment(false,'');
            }).bind(this),600);
          }}
        />
        <View style={{position:'absolute',bottom:0,left:0,width,height:this.props.height}}>
          <Animated.ScrollView 
            style={{height:this.props.height*0.75}}
            pagingEnabled={true} 
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            bounces={false}
            scrollEventThrottle={16}
            ref='_commentView'
            keyboardShouldPersistTaps='always'
            scrollEnabled={this.state.scrollEnabled}
            onScroll={(e)=>{
              this.scroll=e.nativeEvent.contentOffset.y;
              if(e.nativeEvent.contentOffset.y==0){
                this.setState({scrollEnabled:false})
                if(this.hideIndex==true){
                  this.hideIndex=false;
                  this.props._comment(false,'');
                }else{
                  this.hideIndex=false;
                  setTimeout((()=>{
                    this.props._comment(false,'');
                  }).bind(this),400);
                }
              }
            }}
          > 
            <TouchableOpacity
              style={{
                width,
                height:this.props.height
              }}
              onPress={async ()=>{
                this.hideIndex=false;
                await this.refs._commentView._component.scrollTo({y: 0});
                setTimeout((()=>{
                  this.props._comment(false,'');
                }).bind(this),600);
              }}
            />
            <View style={{height:this.props.height,backgroundColor:'rgba(0,0,0,0.3)',overflow:'hidden',borderTopStartRadius:8,borderTopEndRadius:8}}
              onLayout={()=>{
                this._getfetch();
                this.refs._commentView._component.scrollTo({y: this.props.height});
                setTimeout((()=>{
                  this.hideIndex=true;
                }).bind(this),0);
              }}
            >
              <View style={{width,height:30,backgroundColor:'#fff',justifyContent:'center'}}>
                <Text style={{fontSize:11,color:'rgba(0,0,0,0.8)',justifyContent:'center',textAlign:'center',fontWeight:'bold'}}>{`브이챗 ${this.props.comment[this.props.post_id]==undefined?0:(this.props.comment[this.props.post_id].length+this.commentSource.length)}개`}</Text>
              </View>
              <View style={{flex:1}} onLayout={()=>{
              }}>
                <FlatList style={{flex:1,backgroundColor:'#fff'}}
                  bounces={false}
                  keyboardShouldPersistTaps='always'
                  nestedScrollEnabled={true}
                  onScrollToIndexFailed={()=>{
                    console.log('onScrollToIndexFailed: '+this.toIndex)
                    setTimeout((()=>{
                      this._scrollTo(this.toIndex);
                    }).bind(this),100)
                  }}
                  data={this.props.comment[this.props.post_id]==undefined?[]:this.props.comment[this.props.post_id]}
                  ListHeaderComponent={() => {
                    if(this.state.headerloader){
                      return(
                        <TouchableOpacity style={{width,height:40,backgroundColor:'rgba(100,100,100,0.1)',justifyContent:'center',alignItems:'center',flexDirection:'row'}} onPress={()=>{
                          this.renderBefore();
                        }}>
                          <Image style={{width:24,height:24,opacity:0.7,marginRight:8}} source={require('../assets/refresh.png')}/>
                          <Text style={{color:"rgba(0,0,0,0.8)",fontSize:13,fontWeight:'bold'}}>처음부터</Text>
                        </TouchableOpacity>
                      )
                    }else{
                      return null;
                    }
                  }}

                  renderItem={(props) => (
                    <CommentList
                      prev={props.index!=0?this.props.comment[this.props.post_id][props.index-1]:{user_id:'',ct:0}}
                      after={props.index<this.props.comment[this.props.post_id].length-1?this.props.comment[this.props.post_id][props.index+1]:{user_id:'',ct:9999999999999999}}  
                      index={props.index}
                      item={props.item} 
                      user_id={this.props.user_id}
                      post_user_id={this.props.post_user_id}
                      navigation={this.props.navigation}
                      player={this.state.player}
                    />
                  )}
                  contentContainerStyle={{paddingBottom:8}}
                  keyExtractor={(item,index) => index.toString()}
                  numColumns={1}
                  ref='_ListView'
                  onScrollEndDrag={async ()=>{
                    console.log(this.scroll);
                    if(Platform.OS==='ios'){
                    }else{
                      if(this.props.height-this.scroll>=-100&&this.props.height-this.scroll<8){
                       
                      }else if(this.props.height-this.scroll>=8&&this.props.height-this.scroll<64){
                        this.refs._commentView._component.scrollTo({y: this.props.height});
                      }else{
                        this.refs._commentView._component.scrollTo({y: 0});

                      }
                    }
                  }}
                />
                {
                  this.state.log&&this.props.comment[this.props.post_id].length==0?(
                    <Text style={{position:'absolute',alignSelf:'center',top:this.props.height*0.35,color:"rgba(0,0,0,0.8)",fontSize:13}}>친구에게 브이챗을 보내보세요.</Text>
                  ):(
                    null
                  )
                }
              </View>
              <View style={{bottom:0,width,height:48+this.props.bottom,left:0,flexDirection:'row',backgroundColor:'#fff',borderTopWidth:1,borderColor:'rgba(100,100,100,0.1)'}}>
                <TouchableOpacity style={{width,height:48,position:'absolute',top:0,left:0,justifyContent:'center'}} onPress={()=>{
                    this.setState({
                      keyboardView:true
                    })
                  }}
                  activeOpacity={1}
                >
                  <Text style={{color:'rgba(0,0,0,0.5)',marginLeft:16}}>친구들과 이야기를 나눠보세요</Text>
                  <View style={{width:48,height:48,position:'absolute',top:0,right:4,justifyContent:'center',alignItems:'center'}}>
                    <Image style={{width:32,height:32}} source={require('../assets/chat_send_black.png')}/>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.ScrollView>
        </View>
      </View>
      {
        this.state.keyboardView==true?(
          <KeyboardAvoidingView 
            behavior={Platform.OS==='ios'?"padding":""}
            style={{
              flex:1,
              backgroundColor:'rgba(0,0,0,0.3)',
              justifyContent:'flex-end'
            }}>
            <TouchableOpacity 
              activeOpacity={1}
              style={{
                flex:1,
                backgroundColor:'rgba(0,0,0,0)'
              }}
              onPress={()=>{
                this.setState({
                  keyboardView:false
                })
              }}
            />
            <View style={{backgroundColor:'#fff',width,height:56,paddingTop:0}}>
              <TextInput
                style={{...styles.main_input}}
                placeholder='친구들과 이야기를 나눠보세요.'
                multiline={true}
                autoFocus={true}
                ref='mainInput'
                onChangeText={(text)=>{
                  this.setState({text});
                }}
                value={this.state.text}
              />
              <TouchableOpacity style={{position:'absolute',width:56,bottom:0,right:0,height:56,justifyContent:'center',alignItems:'center'}} onPress={()=>{
                this._send({text:this.state.text})
              }}>
                {
                  this.state.text.length>0?(
                    <Image style={{width:36,height:36}} source={require('../assets/chat_send_pink.png')}/>
                  ):(
                    <Image style={{width:36,height:36,opacity:0.5}} source={require('../assets/chat_send_black.png')}/>
                  )
                }
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        ):(null)
      }
      </>
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
    backgroundColor:'rgba(0,0,0,0)',
  },
  main_input:{
    paddingLeft:16,
    paddingRight:16,
    fontSize:12,
    height:56,
    width:width,
    color:'rgba(0,0,0,0.8)',
    backgroundColor:'#fff',
    position:'absolute',
    left:0,
    bottom:0,
    width:width-48,
    justifyContent:'center',
    paddingTop:Platform.OS=='ios'?16:0
  },
});
