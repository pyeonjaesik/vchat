import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,TouchableOpacity,View} from 'react-native';
import FastImage from 'react-native-fast-image'
import Ripple from 'react-native-material-ripple';

const {width}=Dimensions.get("window");
export default class ProfilePerson extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  t_index=false;

  render(){
    return(
      <Ripple style={{...styles.container}} onPress={() => {
          this.props.navigation.navigate('Book',{
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
      </Ripple>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    height:64,
    alignItems:'center',
    backgroundColor:'#fff'
  },
  profile_img:{
    width:40,
    height:40,
    marginLeft:16,
    borderRadius:40,
    overflow:'hidden'
  },
  profile_id:{
    fontSize:16,
    marginLeft:2,
    marginRight:50,
    color:'rgba(0,0,0,0.9)',
    marginLeft:16
  },

})