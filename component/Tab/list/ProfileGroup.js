import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,TouchableOpacity,View} from 'react-native';
import FastImage from 'react-native-fast-image'

const {width}=Dimensions.get("window");
export default class profileGroup extends Component{
  constructor(props){
    super(props);
    this.state={
      member:this.props.item.member
    }
  }
  t_index=false;
  render(){
    return(
      <View style={{backgroundColor:'#888'}}>
        <TouchableOpacity style={{...styles.container}} activeOpacity={0.9} onPress={() => {
            this.props.navigation.navigate("Group",{
              id:this.props.item.id,
              member:this.state.member
            })
          }}>
          <View style={styles.profile_img}>
            <Image style={{width:20,height:20}} source={require('../../../assets/at.png')}/>
          </View>
          <View>
            <Text style={styles.profile_id}>{this.props.item.id}</Text>
            <Text style={styles.member}>멤버수 {this.state.member}명</Text>
          </View> 
        </TouchableOpacity>
      </View>
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
    backgroundColor:'#d52685',
    marginLeft:16,
    borderRadius:40,
    overflow:'hidden',
    justifyContent:'center',
    alignItems:'center'
  },
  profile_id:{
    fontSize:16,
    marginLeft:2,
    color:'rgba(0,0,0,0.9)',
    marginLeft:16
  },
  member:{
    fontSize:12,
    color:'rgba(100,100,100,0.8)',
    marginLeft:16,
    marginTop:4
  },
  grouping_c:{
    position:'absolute',
    right:16,
    width:48,
    height:28,
    borderRadius:3,
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderColor:"rgba(0,0,0,0.7)"
  },
  grouping_txt:{
    color:'rgba(0,0,0,0.7)',
    fontWeight:'bold'
  }
})