import React from "react";

//import navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useScrollToTop } from '@react-navigation/native';

// import Stacks 
import HomeStack from "./HomeStack";
import ExploreStack from "./ExploreStack";
import SavedStack from "./SavedStack";
import AccountStack from "./AccountStack";
import PostStack from "./PostStack";

//import styles and assets

//icon
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
 
const Tab = createBottomTabNavigator();

const HomeTab = () => (
  <Tab.Navigator tabBarOptions={{ showLabel: false }}>
    <Tab.Screen
      name="Home"
      component={HomeStack}
      options={{
        showLabel: false,
        tabBarIcon: ({ color, size }) => (
          <SimpleLineIcons name="home" color={color} size={size-7}  /> 
        ),
      }}
      tabBarVisible={false}
    />
    <Tab.Screen
      name="Explore"
      component={ExploreStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <EvilIcons name="search" color={color} size={size} />
        ),
      }}
      tabBarVisible={false}
      
    />
    <Tab.Screen
      name="Post"
      component={PostStack}
      tabBarVisible={false}
      options={{
        tabBarIcon: ({ color, size }) => (
          <EvilIcons name="plus" color={color} size={size} />
        ),
      }}
      tabBarVisible={false}

    />
    <Tab.Screen
      name="Saved"
      component={SavedStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          // <EvilIcons name="tag" color={color} size={size} />
          <Ionicons name="book-outline" color={color} size ={size-5} />
        ),
      }}
      tabBarVisible={false}
    />
    <Tab.Screen
      name="Account"
      component={AccountStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <EvilIcons name="user" color={color} size={size} />
        ),
      }}
      tabBarVisible={false}
    />
  </Tab.Navigator>
);

export default HomeTab;
