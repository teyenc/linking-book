import React from "react";

//import navigation
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

//import screens
import Account from "../screen/AccountScreens/Accounts";
import UserProfile from "../screen/AccountScreens/UserProfile";
import PersonalInfo from "../screen/AccountScreens/PersonalInfo";
import MyPosts from "../screen/AccountScreens/MyPosts";
import PostDetail from "../screen/AccountScreens/MyPostDetail";
import EditPage from "../screen/AccountScreens/EditPage";
import EditUserProfile from "../screen/AccountScreens/EditUserProfile";
import ResetPwd from "../screen/auth/ResetPwd";
import Confirm from "../screen/AccountScreens/Confirm";
import CheckEmail from "../screen/AccountScreens/CheckEmail";
import ResetEmail from "../screen/AccountScreens/ResetEmail";

//shared screens
import {
  SharedPostDetail,
  SharedUserProfile,
  SharedCollections,
  SharedUserList,
  SharedPostsInCollection,
  SharedComments,
} from "../screen/SharedScreens/index";

//import styles and assets
import AccountSettings from "../screen/AccountScreens/AccountSettings";
import ConfirmDeleteUser from "../screen/AccountScreens/ConfirmDeleteUser";
  
const Stack = createStackNavigator();

const AccountStack = ({ route, navigation }) => {

  if (route.state ) {
    if (route.state.routes) {
      navigation.setOptions({
        tabBarVisible: ( route.state.routes[route.state.index].name.includes("Edit")) ? false : true,
      });
    }
  }


  return(
    <Stack.Navigator>
      <Stack.Screen 
        name="Accounts" 
        component={Account} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfile} 
        options={{ headerShown: false }}

      />
      <Stack.Screen 
        name="MyPosts" 
        component={MyPosts} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="MyPostDetail" 
        component={PostDetail} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AccountComments" 
        component={SharedComments} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="PersonalInfo" 
        component={PersonalInfo} 
        options={{
          headerShown:false,
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AccountResetPwd"
        component={ResetPwd}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="AccountResetEmail"
        component={ResetEmail}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false,
        }}
      />
      <Stack.Screen
        name="Confirm"
        component={Confirm}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="CheckEmail"
        component={CheckEmail}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen 
        name="EditPage" 
        component={EditPage} 
        options={{ 
          headerShown: false, 
          gestureEnabled:false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          tabBarVisible: false
        }}
      />
       <Stack.Screen 
        name="EditUserProfile" 
        component={EditUserProfile} 
        options={{ 
          headerShown: false, 
          gestureEnabled:false ,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          tabBarVisible: false
        }}
      />
      <Stack.Screen 
        name="AccountPostsInCollection" 
        component={SharedPostsInCollection} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AccountPostDetail" 
        component={SharedPostDetail} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AccountUserProfile" 
        component={SharedUserProfile} 
        options={{
          headerShown: false, 
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AccountCollection" 
        component={SharedCollections} 
        options={{
          title:false,
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="AccountUserList" 
        component={SharedUserList} 
        options={{
            title:false,
            headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={AccountSettings}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown: false, 
        }}
      />
      <Stack.Screen
        name="ConfirmDeleteUser"
        component={ConfirmDeleteUser}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
    </Stack.Navigator>
  )
};

export default AccountStack;
