import React from "react";

//import navigation
import { createStackNavigator } from "@react-navigation/stack";

//import screens
import Blank from "../screen/PostScreens/Blank"
import PostPage from "../screen/PostScreens/PostPage"
import PostPage1 from "../screen/PostScreens/PostPage1"

//import styles and assets
 
const Stack = createStackNavigator();


const ExploreStack = ({ navigation, route}) => {

  return(
    <Stack.Navigator header={null}>
      
      {/* <Stack.Screen 
        name="Blank" 
        component={Blank} 
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen 
        name="PostPage" 
        component={PostPage} 
        options={{ 
          headerShown: false, 
          gestureEnabled:false 
        }}
      />
      <Stack.Screen 
        name="PostPage1" 
        component={PostPage1} 
        options={{ 
          headerShown: false, 
          gestureEnabled:false 
        }}
      />
      
    </Stack.Navigator>
  )

  

};

export default ExploreStack;
