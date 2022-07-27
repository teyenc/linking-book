import React from "react";

//import navigation
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";

//import screens
import UserCollections from "../screen/SavedScreens/UserCollection"
import UpdateCollectionName from "../screen/SavedScreens/UpdateCollectionName"
import PostsInMyCollection from "../screen/SavedScreens/PostsInMyCollection"
import AddCollection from "../screen/SavedScreens/AddCollection";

//shared screens
import {
  SharedPostDetail,
  SharedEditPage,
  SharedUserProfile,
  SharedCollections,
  SharedUserList,
  SharedPostsInCollection,
  SharedComments,
} from "../screen/SharedScreens/index";
 
const Stack = createStackNavigator();

const SavedStack = ({route, navigation}) => {
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
        name="UserCollections" 
        component={UserCollections} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
      name="SavedPostsInCollection" 
      component={SharedPostsInCollection} 
      options={{
        title:false,
        headerBackTitleVisible: false,
      }}
      />
      <Stack.Screen 
        name="SavedPostDetail" 
        component={SharedPostDetail} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="SavedUserProfile" 
        component={SharedUserProfile} 
        options={{
          title:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen 
        name="SavedCollection" 
        component={SharedCollections} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="UpdateCollectionName" 
        component={UpdateCollectionName} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SavedUserList" 
        component={SharedUserList} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="SavedComments" 
        component={SharedComments} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="SavedPostsInMyCollection" 
        component={PostsInMyCollection} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="SavedAddCollection" 
        component={AddCollection} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
          name="SavedEditPage" 
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

export default SavedStack;
