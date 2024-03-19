import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export default styles = StyleSheet.create({
    touch:{
      borderWidth:1,
      borderColor:"grey",
      borderRadius:8,
  
    },
    icon:{
      top:height/12,
      justifyContent:"center",
      alignItems:"center",
     
    },
    card:{
      top:height/10,
     
    },
    container: {
      flex: 1,
      backgroundColor:"white",
     
    },
    infoContainer: {
      marginTop:0,
      marginLeft:0,
    },
   
  });