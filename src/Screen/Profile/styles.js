import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:"white",
    },
    buttonGroupContainer: {
      height: height/2, // ButtonGroup yüksekliği
      width:width/1.1,
      borderRadius: 10, // ButtonGroup kenar yuvarlama
      borderColor:"grey",    
    },
    icon:{
        justifyContent:"center",
        alignItems:"center",
      },
    
  });
  