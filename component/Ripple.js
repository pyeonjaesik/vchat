import React,{Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Image,Text,Dimensions,Animated,TextInput,FlatList,KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback} from 'react-native';
import {URL} from '../config';
import RipplePerson from './Tab/list/RipplePerson';

const {width,height}=Dimensions.get("window");
const AnimatedFlatList= Animated.createAnimatedComponent(FlatList);
const { State: TextInputState } = TextInput;

export default class Ripple extends Component{
  constructor(props){
    super(props);
    this.state={
      post:[],
      number:0,
      scrollEnabled:true
    }
    this.backInt=this.props.backInt;
    this._getfetch=this._getfetch.bind(this);
  }
  hideIndex=false;
  _getfetch(){
    let data={
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
    fetch(`${URL}/getreadprofile`, obj)
    .then((response) => response.json())
    .then(async (responseJson) => {
      if(responseJson.status==100){
        this.setState({
          post:responseJson.user_arr,
          number:responseJson.number
        })
      }else{

      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async componentWillReceiveProps(nextProps) {
    console.log(nextProps.backInt)
    if(this.backInt!=nextProps.backInt){
      this.hideIndex=false;
      await this.refs._rippleView._component.scrollTo({y: 0});
      setTimeout((()=>{
        this.props._ripple(false,'');
      }).bind(this),300);
    }
  }
  scroll=0;
  render(){
    return(
      <View style={styles.container}>
        <TouchableOpacity style={{height:height}}
          onPress={async ()=>{
            this.hideIndex=false;
            await this.refs._rippleView._component.scrollTo({y: 0});
            setTimeout((()=>{
              this.props._ripple(false,'');
            }).bind(this),300);
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
            ref='_rippleView'
            keyboardShouldPersistTaps='always'
            contentContainerStyle={{paddingTop:0}}
            scrollEnabled={this.state.scrollEnabled}
            onScroll={(e)=>{
              this.scroll=e.nativeEvent.contentOffset.y;
              if(e.nativeEvent.contentOffset.y==0){
                this.setState({scrollEnabled:false});
                if(this.hideIndex){
                  this.hideIndex=false;
                  this.props._ripple(false,'');
                }else{
                  this.hideIndex=false;
                  setTimeout((()=>{
                    this.props._ripple(false,'');
                  }).bind(this),300);
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
                await this.refs._rippleView._component.scrollTo({y: 0});
                setTimeout((()=>{
                  this.props._ripple(false,'');
                }).bind(this),300);
              }}
            />
            <View style={{height:this.props.height,backgroundColor:'rgba(0,0,0,0.3)',overflow:'hidden',borderTopStartRadius:8,borderTopEndRadius:8}}
              onLayout={()=>{
                this._getfetch();
                this.refs._rippleView._component.scrollTo({y: this.props.height});
                this.hideIndex=true;
              }}
            >
              <View style={{width,height:30,backgroundColor:'#fff',justifyContent:'center'}}>
                <Text style={{fontSize:11,color:'rgba(0,0,0,0.8)',justifyContent:'center',textAlign:'center',fontWeight:'bold'}}>{`조회 ${this.state.number}명`}</Text>
              </View>
              <AnimatedFlatList style={{height:this.props.height-30,backgroundColor:'#fff'}}
                bounces={true}
                keyboardShouldPersistTaps='always'
                nestedScrollEnabled={true}
                data={this.state.post}
                renderItem={({ item }) => <RipplePerson user_id={this.props.user_id} item={item} navigation={this.props.navigation}/>}
                contentContainerStyle={{paddingBottom:8}}
                keyExtractor={item => item.toString()}
                numColumns={4}
                onScrollEndDrag={async ()=>{
                  if(Platform.OS==='ios'){
                  }else{
                    if(this.props.height-this.scroll>=-100&&this.props.height-this.scroll<8){
                     
                    }else if(this.props.height-this.scroll>=8&&this.props.height-this.scroll<32){
                      this.refs._rippleView._component.scrollTo({y: this.props.height});
                    }else{
                      this.refs._rippleView._component.scrollTo({y: 0});
                    }
                  }
                }}
              />
            </View>
          </Animated.ScrollView>
        </View>
      </View>
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
    position:'absolute',
    bottom:0,
    left:0,
    paddingHorizontal:30,
    fontSize:17,
    minHeight:56,
    maxHeight:200,
    width:width,
    color:'rgba(0,0,0,0.8)'
  },
});