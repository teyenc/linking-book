import React, { useEffect, useState } from "react";
import { Platform, Image } from "react-native";

//import navigation
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import HomeStack from "./HomeStack";
import HomeTab from "./HomeTab";

//import screens
import Login from "../screen/auth/Login";
import Signup from "../screen/auth/Signup";
import Forget from "../screen/auth/Forget";
import VerificationCode from "../screen/auth/VerificationCode";
import ResetPwd from "../screen/auth/ResetPwd";
import Guide1 from "../screen/auth/Guide1";
import Guide2 from "../screen/auth/Guide2";
import AppIntro from "../screen/auth/AppIntro";
import RecUser from "../screen/auth/RecUser";
import test from "../screen/auth/test";
// import PostDetail from "../screen/SharedScreens/PostDetail";
 
//import styles and assets
import styled from "styled-components";

// import redux 
import { login, setBlock, setFolAct } from "../../app/store/actions"
import { Provider,useSelector, useDispatch } from "react-redux";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BACKEND } from "../config/config";
import { GET, getToken, storeToken } from "../helpers/functions";
import AddTitle from "../screen/auth/AddTitle";

import { SharedReport, SharedReportOther } from "../screen/SharedScreens/index";



const Stack = createStackNavigator();

const NotSignedIn = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ 
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="RecUser"
        component={RecUser}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Guide1"
        component={Guide1}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="AppIntro"
        component={AppIntro}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Forget"
        component={Forget}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="AuthResetPwd"
        component={ResetPwd}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="VerificationCode"
        component={VerificationCode}
        options={{
          title: false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="AddTitle"
        component={AddTitle}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Guide2"
        component={Guide2}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="test"
        component={test}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="HomeTab"
        component={HomeTab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  )
};

const SignedIn = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTab"
        component={HomeTab}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="RecUser"
        component={RecUser}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Forget"
        component={Forget}
        options={{
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="AuthResetPwd"
        component={ResetPwd}
        options={{
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="VerificationCode"
        component={VerificationCode}
        options={{
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Guide1"
        component={Guide1}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="AppIntro"
        component={AppIntro}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="AddTitle"
        component={AddTitle}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Guide2"
        component={Guide2}
        options={{ 
          title: false,
          gestureEnabled:false,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="Report"
        component={SharedReport}
        options={{ 
          title: false,
          gestureEnabled:true,
          headerBackTitleVisible: false,
          headerShown:false
        }}
      />
      <Stack.Screen
        name="ReportOther"
        component={SharedReportOther}
        options={{ 
          title: false,
          gestureEnabled:true,
          headerShown:false
        }}
      />
    </Stack.Navigator>
  )
};


const AuthStack = () => {
  const [loginData, setLoginData] = useState(null);
  const [isGotData, setIsGotData] = useState(false);
  const [ isGotToken, setIsGotToken ] = useState(0) // 0 for not yet, 2 for success, 4 for failed
  const dispatch = useDispatch();
  // console.log(isGotToken)

  const renewToken = () => {
    getToken("refreshToken").then(refresh_Token => {
      fetch(BACKEND + "/user/refresh-token", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: refresh_Token
        })
      })
      .then( res => {
        if (res.status === 201 || res.status === 200 ) {
          res.json().then( t => {
            storeToken("accessToken", t.accessToken)
            setIsGotToken(2)
          })
        }
        else setIsGotToken(4)
      })
    })
  }

  const getData = async () => {
    try {
      const data = await AsyncStorage.getItem('LoginData')
      if(data) {
        const user = JSON.parse(data)
        setLoginData(user)
        dispatch(login(
          "",
          "",
          user.name,
          user.email,
          user.id,
          user.phoneNumber,
          user.job,
          user.education,
          user.description,
          user.avatar,
          user.title,
          user.birthDate,
          user.gender
        ));
      }
      setIsGotData(true)
      return data
    } 
    catch(e) {
      console.log(e)
    }
  }

  const getBlockIds = async () => {
    const blockIds = await AsyncStorage.getItem('blockIds')
    if (blockIds) {
      const data = JSON.parse("[" + blockIds+ "]")
      // console.log(data)
      dispatch(setBlock(data))
    }
  }

  const LoadLocalFlw = async () => {
    const flwIds = await AsyncStorage.getItem("storedFollowingIds")
    // console.log(flwIds)
    if (flwIds) {
      const data = JSON.parse("[" + flwIds+ "]")
      dispatch(setFolAct(data))
    }
  }


  useEffect(() => {
    getBlockIds()
    LoadLocalFlw()
    getData().then( res => {
      renewToken()
    })
  }, []);


  if (isGotData) {
    if (!loginData) {
      return <NotSignedIn />
    } 
    else if (loginData.id) {
      if (isGotToken == 0) return<></>
      else if (isGotToken == 4) return<NotSignedIn/>
      else return <SignedIn />
    } 
    else {
      return (
        <NotSignedIn />
      );
    }
  } 
  else {
    return (
      <></>
    );
  }
}

const IconWrapper = styled.View`
  margin-left: ${Platform.OS === "ios" ? "15px" : 0};
`;

export default AuthStack;
