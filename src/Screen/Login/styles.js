import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "white",
        padding: 30,
        paddingTop: height/5,
        justifyContent: 'center', 
        alignItems: 'center',
      },
      inputContainer: {
        marginBottom: 10,
      },
      button2: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        paddingLeft:15,
        marginTop:15,
      },
      buttonText2: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
      },

      text_2:{
        fontSize:36,
        fontWeight:"bold",
        color:"black",
        bottom: width/12,
      },
      kirala:{
        fontSize:36,
        color:"#FF5454",
        fontWeight:"bold",
      },
      google: {
        marginTop:15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white', // Google rengi
        padding: 12,
        borderRadius: 5,
        paddingHorizontal: width/5,
      },
      icon: {
        marginRight: 10,
      },
      googleText: {
        color: 'grey',
        fontSize: 16,
      },
      text:{
        marginRight:width/2.5,
      }
   
});