import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: 'white',
        margin: 8,
        borderRadius: 8,
        padding: 16,
        alignItems:"center",
        borderWidth:1,
        borderColor:"grey",
      },
      image: {
        width: '100%',
        height: 175,
        borderRadius: 8,
    
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
      },
      price: {
        fontSize: 14,
        color: 'green',
        marginTop: 8,
      },
      icon:{
        alignItems:"flex-start",
        top:"4%",
        
        left:"60%", 
        flexDirection:"row",
      },
     text:{
      top:height*0.03,
      left:width*0.05,
      fontSize:18,
     },
     text1:{
      top:height*0.08,
      left:-width*0.125,
      fontSize:18,
     },
     
      appBar:{
        borderWidth:1,
        borderColor:"white",
        height:100,
        backgroundColor:"white",
        borderBottomLeftRadius:100,
        borderBottomRightRadius:100,
      },
      container:{
        backgroundColor:"white",
        flex:1,

      },
    
  });
  