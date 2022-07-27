import React from "react";

//import navigation
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";

//import screens
import Explore from "../screen/ExploreScreens/Explore";
import ExploreListing from "../screen/ExploreScreens/ExploreListing"


// shared screen 
import {
  SharedPostDetail,
  SharedEditPage,
  SharedUserProfile,
  SharedCollections,
  SharedUserList,
  SharedPostsInCollection,
  SharedComments,
} from "../screen/SharedScreens/index";

import SearchUser from "../screen/ExploreScreens/SearchUser";
 
const Stack = createStackNavigator();

const ExploreStack = ({route, navigation}) => {

  if (route.state ) {
    if (route.state.routes) {
      navigation.setOptions({
        tabBarVisible: ( route.state.routes[route.state.index].name.includes("Edit")) ? false : true,
      });
    }
  }

  return(
    <Stack.Navigator header={null}>
      <Stack.Screen 
        name="Explore" 
        component={Explore} 
        options={{ headerShown: false }}
      />
      <Stack.Screen  
        name="ExploreListing" 
        component={ExploreListing} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ExplorePostDetail" 
        component={SharedPostDetail} 
        options={{
          title:false,
          headerBackTitleVisible: false,
      }}
      />
      <Stack.Screen 
        name="ExploreUserProfile" 
        component={SharedUserProfile} 
        options={{
          headerShown: false, 
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ExploreUserList" 
        component={SharedUserList} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ExploreComments" 
        component={SharedComments} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ExploreSearchUser" 
        component={SearchUser} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ExploreCollection" 
        component={SharedCollections} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ExplorePostsInCollection" 
        component={SharedPostsInCollection} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="ExploreEditPage" 
        component={SharedEditPage} 
        options={{ 
          headerShown: false, 
          gestureEnabled:false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          tabBarVisible: false
        }}
      />
    </Stack.Navigator>

  )
};

export default ExploreStack;
