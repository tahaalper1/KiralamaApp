import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
    textInput: {
        width: width/1.1,
        height: 42,
        borderWidth: 1,
        borderColor:"grey",
        borderRadius: 10,
        paddingHorizontal: 10,
        
      },
      container:{
        margin:0,
        alignItems: 'center',
        justifyContent: 'center',
        padding:5,
      }
});