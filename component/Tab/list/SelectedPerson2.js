import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,TouchableOpacity,Image,View} from 'react-native';
import FastImage from 'react-native-fast-image'

const {width}=Dimensions.get("window");
export default class SelectedPerson2 extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  t_index=false;
  render(){
    return(
        <TouchableOpacity style={styles.movie} activeOpacity={1} onPress={() => {
          this.props.navigation.navigate('Book',{
            item:{
              user_id:this.props.item.user_id,
              img:this.props.item.img,
              id:this.props.item.id
            }
          });
          }}>
            <View style={styles.profile_img}>
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
          <Text style={styles.profile_id}>{this.props.item.id}
          </Text>
          <TouchableOpacity style={styles.xbtn}
            onPress={()=>{
              this.props._select(this.props.item,false)
            }}
          >
            <Image style={{width:8,height:8}} source={require('../../../assets/minus.png')}/>
          </TouchableOpacity>
        </TouchableOpacity>

    )
  }
}
const styles = StyleSheet.create({
  movie:{
    height:80,
    minWidth:56,
    alignSelf:'center',
    marginRight:15,
    alignItems:'center',
  },
  profile_img:{
    width:48,
    height:48,
    backgroundColor:'#fff',
    borderRadius:56,
    overflow:'hidden'
  },
  profile_id:{
    fontSize:14,
    color:'rgba(0,0,0,0.8)',
    marginTop:4
  },
  xbtn:{
    position:'absolute',
    top:0,
    right:0,
    width:16,
    height:16,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'red',
    borderRadius:16
  },
  xbtn_txt:{
    color:'#fff',
    fontWeight:'bold',
    lineHeight:16
  }
})