import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"white",        
      },
      image: {
        width: 100,
        height: 100,
        
      },
      addButton: {
        backgroundColor: 'lightgray',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
      },
      modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      modalButton: {
        backgroundColor: 'lightgray',
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
      },
      buttonText: {
        color: 'black',
      },
      imageProduct:{
        flexDirection: 'row',
        top:50,
        borderWidth:1,
        borderColor:"grey",
      },
      input:{
        top:75,  
        margin:0,
        alignItems: 'center',
        justifyContent: 'center',
        padding:5,   
         
    },
    button:{
        top:100,
    },
    input1:{
        width: width/1.1,
        height: 150,
        borderWidth: 1,
        borderColor:"grey",
        borderRadius: 10,
        paddingHorizontal: 10,
       
    }
  
    }); 
