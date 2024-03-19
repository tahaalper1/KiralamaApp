import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export default styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "white",
        justifyContent: "flex-end", 
        alignItems: 'center',
      },
   switch:{
    marginRight:width/6,
    marginTop:10,
    marginBottom:5,
    flexDirection:"row",
   },
   kvkk:{
    marginTop:15,
    fontWeight:"bold",
   },
   button:{
    marginBottom:height/12,
   },
   kirala:{
    fontSize:24,
    color:"#FF5454",
    fontWeight:"bold",
  },
  text_2:{
    fontSize:24,
    fontWeight:"bold",
    color:"black",
    bottom: width/12,
  },
  text:{
    marginRight:width/2.5,
  },
  kvkk_baslik:{
    fontWeight:"bold",

  },
  kvkk_icerik_container: {
    padding: 16, // İçerik alanının etrafındaki boşluk
  },
   
});