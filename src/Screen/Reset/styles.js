import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "white",
        padding: 30,
        paddingTop: width/2,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    inputContainer: {
      marginBottom: 10,
    },
    text_2:{
        fontSize:20,
        fontWeight:"bold",
        color:"black",
        textAlign:"center",
        marginBottom:10,
      },
   
  });

    
   
