import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import { View, Dimensions} from 'react-native'
//ekranlar
import Login from '../Screen/Login';
import Register from '../Screen/Register';
import Reset from '../Screen/Reset';
import User from '../Screen/User';
import Message from '../Screen/Message';
import Home from '../Screen/Home';
import Search from '../Screen/Search';
import Profile from '../Screen/Profile';
import Add from '../Screen/Add';
import MyAds from '../Screen/Profile/MyAds/MyAds';
import Product from '../Screen/Product';
import Address from '../Screen/Profile/Address/Address';
import Everybody from '../Screen/ProductEverybody..js/Everybody';
import Favorites from '../Screen/Profile/Favorites/Favorites';
import Chat from '../Screen/Chat/Chat';
import ChatList from '../Screen/Chat/ChatList';
import Chats from '../Screen/Chat/Chats';






const Tab = createBottomTabNavigator();
const stack = createNativeStackNavigator();

const { width, height } = Dimensions.get('window');

const StackNavigator = () => {


  
  return    <stack.Navigator option={{headerShown: false}}>
          <stack.Screen name="Login" component={Login}  options={{ headerShown: false }}/> 
          <stack.Screen name="Profile" component={Profile}  options={{ headerShown: false }}/> 
          <stack.Screen name="MyAds" component={MyAds}  options={{ headerShown: false }}/> 
           <stack.Screen name="User" component={User}  options={{ headerShown: false }}/> 
           <stack.Screen name="Register" component={Register}  options={{ headerShown: false }}/> 
           <stack.Screen name="Reset" component={Reset}  options={{ headerShown: false }}/> 
           <stack.Screen name="Product" component={Product}  options={{ headerShown: false }}/> 
           <stack.Screen name="Address" component={Address}  options={{ headerShown: false }}/> 
           <stack.Screen name="Everybody" component={Everybody}  options={{ headerShown: false }}/> 
           <stack.Screen name="Favorites" component={Favorites}  options={{ headerShown: false }}/> 
           <stack.Screen name="Chat" component={Chat}   options={{ headerShown: false }}/> 
           <stack.Screen name="ChatList" component={ChatList}  options={{ headerShown: false }}/> 
           <stack.Screen name="Chats" component={Chats}  options={{ headerShown: false }}/> 
           
         </stack.Navigator>
  
}



function MyTabs() {


  return (
 
                <Tab.Navigator
                initialRouteName="Profile"
                screenOptions={{
                  tabBarStyle: { backgroundColor: 'white',
                  height: height/10,
                  borderTopEndRadius:50,
                  borderTopStartRadius:50,
              }, 
                }}
                
                >
                  <Tab.Screen
                name="Home"
                options={{
               
                  tabBarActiveTintColor:"#FF5454",
                  tabBarInactiveTintColor:"black",
                  headerShown: false,
                    tabBarLabel: '--------',
                    tabBarIcon: ({ color }) => (
                      <AntDesign name="home" size={width/15} color={color} />
                    )
                }}
                component={Home} />
                  
  
                <Tab.Screen
                name="Workout"
                options={{
                  tabBarActiveTintColor:"#FF5454",
                  tabBarInactiveTintColor:"black",
                  headerShown: false,
                  tabBarLabel: '--------',
                    tabBarIcon: ({ color }) => (
                      
                      <AntDesign name="search1" size={width/15} color={color} />
                      
                      
                    )
                }}
                component={Search} />
  
               
                <Tab.Screen
           
                name="Add"
                
                options={{
                  headerShown: false,
                  tabBarActiveTintColor:"white",
                  tabBarInactiveTintColor:"black",
                  tabBarStyle:{display:'none'},
                    tabBarLabel: '',
                    tabBarIcon: ({ color }) => (
            
                        <View
                       
                        style={{
                          
                          width: 50,
                          height: 50,
                          borderRadius: 100,
                          borderBottomWidth: 0,
                          backgroundColor: '#FF5454',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: height/15,
                        
                        }}
                        >
                          
                           <AntDesign name="pluscircleo" size={width/9} color="white" />  
                        </View>
              
                    )
                
                }}
                component={Add}
              
                
                />
                <Tab.Screen
  
                name="Chatlist"
                options={{
                  headerShown: false,
                  tabBarActiveTintColor:"#FF5454",
                  tabBarInactiveTintColor:"black",
                  tabBarLabel: '--------',
                    tabBarIcon: ({ color }) => (
                      
                      <AntDesign name="message1" size={width/15} color={color} />
                      
                      
                    )
                }}
                component={ChatList} />
  
                <Tab.Screen
                name="Profile"
                options={{
                  headerShown: false,
                  tabBarActiveTintColor:"#FF5454",
                  tabBarInactiveTintColor:"black",
                  tabBarLabel: '--------',
                    tabBarIcon: ({ color }) => (
                      <AntDesign name="user" size={width/15} color={color} />
                    )
                }}
                component={StackNavigator} />
                
                </Tab.Navigator>
  );
}

export default function Routing() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}