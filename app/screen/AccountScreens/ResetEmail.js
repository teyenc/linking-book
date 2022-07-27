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
import EvilIcons from "react-native-vector-icons/EvilIcons";
import * as Yup from "yup";
import styled from "styled-components";
import { ScrollView } from "react-native-gesture-handler";

// redux && helpers
import { useSelector } from 'react-redux';

// yup will set before fetch 
const validationSchema = Yup.object().shape({
  email: Yup.string().
  label("Email"),
  password: Yup.string().
  label("Password"),
});

const ResetEmail = ({ route, navigation }) => {

    // console.log(props)
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false)


  const sendCode = () => {
    fetch( BACKEND + "/user/reset-email", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "oldEmail": route.params.oldEmail,
        "newEmail": route.params.newEmail,
        "code": code
      })
    })
    .then( res => {
      if (res.status === 200) {
        navigation.navigate("Accounts", {refresh: true})
        Alert.alert("Email changed!")
        setIsLoading(false)
      }
      else if ( res.status === 404 ) {
        Alert.alert("User with this email does not exist. Please signup first!")
        setIsLoading(false)
      } 
      else if ( res.status === 400 ) {
        Alert.alert("Email can't be the same!.")
        setIsLoading(false)
      } 
      else {
        Alert.alert("Some error happened. Please try again!")
        setIsLoading(false)
      }
    })
  }

  const Resend = () => {
    fetch( BACKEND + "/user/check-email", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "oldEmail": route.params.oldEmail,
        "newEmail": route.params.newEmail,
        "password": route.params.password,
      })
    })
    .then( res => {
      if (res.status === 200 ) {
        Alert.alert("Email sent!!")
        setIsLoading(false)
      }
      else if ( res.status === 400 ) {
        res.json().then(() => {
          if (res.msg) {
            Alert.alert(res.msg)
            setIsLoading(false)
          }
          else {
            Alert.alert("Please enter correct email and password!")
            setIsLoading(false)
          }
        })
      } 
      else if (res.status === 401) {
        Alert.alert('Incorrect password!')
        setIsLoading(false)
      }
      else {
        Alert.alert("Some error happened. Please try again!")
        setIsLoading(false)
      }
    })
  }


  useEffect(() => {
    if (isLoading) {
      sendCode()
    }
    else setIsLoading(false)
  }, [ isLoading ])

  // console.log(email)

  return (
    <ScrollView style={{backgroundColor:"white"}}>
      <Pressable style={{padding:26, backgroundColor:"white", flex:1, alignItems:"center"}} onPress={Keyboard.dismiss}>
        <TouchableOpacity style={{paddingBottom:10, width:"100%"}} onPress={() => navigation.goBack()}>
          <EvilIcons color={color.black}  name="chevron-left" size={30}></EvilIcons>
        </TouchableOpacity>
        <Pressable style={{paddingVertical:60, width:"90%"}} onPress={Keyboard.dismiss}>
            {/* <Typography.H>Log in</Typography.H> */}
            <View style={{height:60}} />
        </Pressable>


        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={() => setIsLoading(true)}
          validationSchema={validationSchema} 
        >
          <View style={{paddingBottom:26, width:"100%"}}>
            
            <TextInput.email
              placeholder="Enter your code"
              name="email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              clearButtonMode="always"
              textContentType="emailAddress"
              onChangeText={(text) => setCode(text)}
            />
          </View>
          { isLoading ?
            <View style= {{backgroundColor:color.darkBrown, width:"100%", marginTop:15,height:50, borderRadius:20, alignItems:"center", justifyContent:"center"}} >
                <ActivityIndicator size="small" color={color.faintgray} />
            </View> 
            
            :
            <View style={{ width:"100%", paddingTop:15, height:65}}>
              <SubmitBtn title="Verify" />
            </View>
          }
        </AppForm>
        <Text style={{color:color.gray, paddingTop:30, paddingHorizontal:10}} >Please enter the 6-digit code we just sent to your email</Text>
        <View style={{paddingTop:30, flexDirection:"row", alignSelf:'center'}}>
          <Text color={color.gray}>Didn't get a code?</Text>
          <View style={{width:5}}/>
          <TouchableOpacity onPress={() => Resend()}>
            <Text style={{color:color.darkBrown}}>Resend</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </ScrollView>
  );
};

export default ResetEmail;
