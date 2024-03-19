import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
      button: {
        width: width/1.1,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:"grey",
        borderWidth: 1,
        marginTop: 10,
 
      },
      buttonText: {
        color: '#12618b',
        fontSize: 16,
      },
      container:{
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center',
       
      }
     
});