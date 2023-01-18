import React,{Component} from 'react';
import { StyleSheet, Text,Dimensions,Image,TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image'

const {width}=Dimensions.get("window");
export default class PersonList extends Component{
  constructor(props){
    super(props);
    var s_i=this.props.selected.findIndex(em=>em.user_id==this.props.item.user_id);
    this.state={
      backgroundColor:s_i==-1?'#fff':'rgba(200,200,200,0.2)'
    }
  }
  t_index=false;
  async componentWillReceiveProps(nextProps) {
    var s_i=this.props.selected.findIndex(em=>em.user_id==this.props.item.user_id);
    if(s_i===-1){
      this.setState({
        backgroundColor:'#fff'
      })
    }else{
      this.setState({
        backgroundColor:'rgba(200,200,200,0.2)'
      })
    }
  }
  render(){
    return(
      <TouchableOpacity style={{...styles.container,backgroundColor:this.state.backgroundColor}} activeOpacity={1} onPress={() => {
          var s_i=this.props.selected.findIndex(em=>em.user_id==this.props.item.user_id);
          if(s_i===-1){
            this.props._select(this.props.item,true);
            this.props._clearQuery();
          }else{
            this.props._select(this.props.item,false);
          }
        }}>
        <TouchableOpacity style={styles.profile_img} onPress={()=>{
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
        </TouchableOpacity>
        <Text style={styles.profile_id}>{this.props.item.id}</Text>
      </TouchableOpacity>
    )
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    height:64,
    alignItems:'center',
  },
  profile_img:{
    width:40,
    height:40,
    backgroundColor:'#999',
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