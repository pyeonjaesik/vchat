import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,TouchableOpacity,Image,View} from 'react-native';

const {width}=Dimensions.get("window");
export default class SelectedPerson extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }
  t_index=false;
  render(){
    return(
        <View style={styles.movie} activeOpacity={1} onPress={() => {
          }}>
          <Text style={styles.name}>{this.props.item.id}
          </Text>
          <TouchableOpacity style={styles.xbtn}
            onPress={()=>{
              this.props._select(this.props.item,false)
            }}
          >
            <Image style={styles.ximg} source={require('../../../assets/x_round.png')}/>
          </TouchableOpacity>
        </View>

    )
  }
}
const styles = StyleSheet.create({
  movie:{
    flexDirection:'row',
    paddingLeft:10,
    borderWidth:1,
    borderColor:'#333',
    borderRadius:30,
    height:30,
    alignSelf:'center',
    marginRight:15,
    justifyContent:'center',
    alignItems:'center'
  },
  name:{
    fontSize:16,
    color:'#000',
    marginRight:3
  },
  xbtn:{
    width:30,
    height:30,
    justifyContent:'center',
    alignItems:'center'
  },
  ximg:{
    width:30,
    height:30,
  }
})