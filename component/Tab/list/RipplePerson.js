import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,TouchableOpacity,View} from 'react-native';
import FastImage from 'react-native-fast-image'

const {width}=Dimensions.get("window");
export default class RippleePerson extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  t_index=false;

  render(){
    return(
      <TouchableOpacity style={{...styles.container}} activeOpacity={0.9} onPress={() => {
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
        <View style={styles.profile_img} onPress={()=>{

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
        </View>
        <Text style={styles.profile_id}>{this.props.item.id}</Text>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:width/4,
    alignItems:'center',
    backgroundColor:'#fff',
    marginTop:16,
    paddingHorizontal:12
  },
  profile_img:{
    width:40,
    height:40,
    borderRadius:40,
    overflow:'hidden',
  },
  profile_id:{
    marginTop:8,
    fontSize:11,
    color:'rgba(0,0,0,0.8)',
  },
  lottie_c:{
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    marginLeft:0
  },
  check_lottie:{
    width:50,
    height:50,
  }
})