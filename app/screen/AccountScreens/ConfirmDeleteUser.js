import React, { useEffect, useState } from "react";
import { Text, Alert, View, Image, TouchableOpacity, Pressable, Keyboard , ActivityIndicator} from "react-native";

// assets and config
import { BACKEND } from "../../config/config";
import color from "../../config/color";

// component 
import AppForm from "../../components/forms/AppForm";
import * as TextInput from "../../components/forms/AppInput";
import SubmitBtn from "../../components/forms/SubmitBtn";

// library 
import { CommonActions } from '@react-navigation/native';
import EvilIcons from "react-native-vector-icons/EvilIcons";
import styled from "styled-components";
import { ScrollView } from "react-native-gesture-handler";
import * as Yup from "yup";

// redux && helpers
import {connect, useDispatch, useSelector} from 'react-redux';
import { getToken, storeData, storeToken } from "../../helpers/functions";
import { login } from "../../store/actions";

// yup will set before fetch 
const validationSchema = Yup.object().shape({
  email: Yup.string().
  label("Email"),
  password: Yup.string().
  label("Password"),
});

const ConfirmDeleteUser = ({ route, navigation }) => {

    // console.log(props)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch();

  const UserData = useSelector(state => state.auth)

  const Logout = () => {
    storeData("LoginData", "")
    storeData("followingN", "")
    storeData("storedfollowingN", "")
    storeData("storedFollowingIds", "")
    storeData("ttpages", "")
    storeData("HomeLoadingPage","" )
    storeData("exploreListingLoadingPage", "")
    storeData("HomePageType", "")
    storeData("LocalCollections","" )
    storeToken("refreshToken","" )
    storeToken("accessToken","" )

    dispatch(login( "", "", "", "", "", "", "", "", "", "", "", "","",))
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Signup' },
        ],
      })
    );
  }

  useEffect(() => {
    if ( isLoading) Verify()
  }, [isLoading])

  const AskDelete = () => {
    Alert.alert("DANGEREROUS MOVE!", "By pressing CONFIRM, you will lose ALL of your data. Sure to delete account? ", [
      { text: "CONFIRM", onPress: () => setIsLoading(true) },
      { text: "Cancel" },
    ]);
  }


  const DeleteUser = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/user/" + UserData.id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken,
        }
      })
      .then(res => {
        setIsLoading(false)
        if (res.status === 200 || res.status === 201 ) Logout()
        else Alert.alert("Some error happened. Please try again!")
      })
    })
  }

  const Verify = () => {
    fetch( BACKEND + "/user/signin", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email":email.trim().toLowerCase(), 
        "password": password
      })
    })
    .then( res => {
      console.log(res.status)
      if (res.status === 200 || res.status === 201 ) {
        DeleteUser()
      }
      else if ( res.status === 401 ) {
        Alert.alert("Incorrect password!")
        setIsLoading(false)
      }
      else if (res.status === 404 ) {
        Alert.alert("Sorry, we can't find this email")
        setIsLoading(false)
      }
      else { 
        res.json().then( r => {
          if (r.msg) {
            Alert.alert(r.msg)
            setIsLoading(false)
          }
          else {
            Alert.alert("Some error happened. Please try again!")
            setIsLoading(false)
          }
      })
      }
    })
  }

  return (
    <ScrollView style={{backgroundColor:"white"}}>
      <Pressable style={{padding:26, backgroundColor:"white", flex:1, alignItems:"center"}} onPress={Keyboard.dismiss}>
        <TouchableOpacity style={{paddingBottom:10, width:"100%"}} onPress={() => navigation.goBack()}>
          <EvilIcons color={color.black}  name="chevron-left" size={30}></EvilIcons>
        </TouchableOpacity>
        <Pressable style={{paddingVertical:60, width:"90%"}} onPress={Keyboard.dismiss}>
            {/* <Typography.H>Log in</Typography.H> */}
        </Pressable>

        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={() => AskDelete()}
          validationSchema={validationSchema} 
        >
          <View style={{paddingBottom:26, width:"100%"}}>
            <TextInput.email
              placeholder="email"
              name="email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              clearButtonMode="always"
              textContentType="emailAddress"
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <Input>
            <TextInput.AuthPw
              placeholder="current password"
              name="password"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              onChangeText={(text) => setPassword(text)}
            />
          </Input>
          { isLoading ?
          <View style= {{backgroundColor:color.darkBrown, width:"100%", marginTop:15,height:50, borderRadius:20, alignItems:"center", justifyContent:"center"}} >
              <ActivityIndicator size="small" color={color.faintgray} />
          </View> 
          
          :
          <View style={{ width:"100%", paddingTop:15, height:65}}>
            <SubmitBtn title="Next" />
          </View>
          }
          <View style={{paddingTop:30, flexDirection:"row", alignSelf:'center'}}>
            <Text color={color.gray}>Please input your email and password to confirm your identity</Text>
          </View>
        </AppForm>
        
      </Pressable>
    </ScrollView>
  );
};

const Input = styled.View`
  padding-bottom: 26px;
`;

export default ConfirmDeleteUser;
