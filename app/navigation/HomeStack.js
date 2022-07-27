import React from "react";

//import navigation
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";

//import screens
import HomePage from "../screen/HomeScreens/HomePage";
import {
  SharedPostDetail,
  SharedEditPage,
  SharedUserProfile,
  SharedCollections,
  SharedUserList,
  SharedPostsInCollection,
  SharedComments,
} from "../screen/SharedScreens/index";

import styled from "styled-components";

 
const Stack = createStackNavigator();

const HomeStack = ({route, navigation}) => {

  if (route.state ) {
    if (route.state.routes) {
      navigation.setOptions({
        tabBarVisible: ( route.state.routes[route.state.index].name.includes("Edit")) ? false : true,
      });
    }
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name="HomePostDetail" 
        component={SharedPostDetail} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="HomeUserProfile" 
        component={SharedUserProfile} 
        options={{
          headerShown: false, 
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="HomeUserList" 
        component={SharedUserList} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="HomeComments" 
        component={SharedComments} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="HomeCollection" 
        component={SharedCollections} 
        // options={{ headerShown: false }}
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="HomePostsInCollection" 
        component={SharedPostsInCollection} 
        // options={{ headerShown: false }}
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="HomeEditPage" 
        component={SharedEditPage} 
        options={{ 
          headerShown: false, 
          gestureEnabled:false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          tabBarVisible: false
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
