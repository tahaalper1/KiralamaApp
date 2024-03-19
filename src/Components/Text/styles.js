import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
      container:{
        marginTop: 0,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text:{
        marginBottom:height/20,
        fontSize:32,
      }
});