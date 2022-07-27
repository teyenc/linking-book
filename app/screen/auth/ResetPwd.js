import React, { useEffect, useState } from "react";
import { Text,  Alert, View, TouchableOpacity, ScrollView, Pressable, Keyboard, ActivityIndicator } from "react-native";

// assets and config
import styled from "styled-components";
import color from "../../config/color";
import { BACKEND } from "../../config/config";

// library 
import EvilIcons from "react-native-vector-icons/EvilIcons";
import * as Yup from "yup";

// component 
import AppForm from "../../components/forms/AppForm";
import * as TextInput from "../../components/forms/AppInput";
import SubmitBtn from "../../components/forms/SubmitBtn";

// redux && helpers
import {useDispatch } from 'react-redux';

const validationSchema = Yup.object().shape({
  email: Yup.string().
  // required().email().
  label("Email"),
  password: Yup.string().
  // required().min(8). 
  label("Password"),
});

// const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 80;

const ResetPwd = ({ navigation, route }) => {

  // console.log(route)

    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPwd, setConfirmPwd ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false)
    const [code, setCode] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
      if (isLoading) {
        if (!password) {
          Alert.alert("Please enter your password")
          setIsLoading(false)
        }
        else if (!code) {
          Alert.alert("Please enter your verification code!")
          setIsLoading(false)
        }
        else if ( password !== confirmPwd ) {
          Alert.alert("password doen't match!")
          setIsLoading(false)
        }
        else {
          Reset()
        }
      }
    }, [ isLoading ])


    const Resend = () => {
      if (route.name == "AuthResetPwd") {
        getCode("forget-password")
      }
      else if ( route.name == "AccountResetPwd") {
        getCode("reset-password-email")
      }
    }

    const getCode = (router) => {
      fetch( BACKEND + "/user/" + router , {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email":route.params.email.trim().toLowerCase(), 
        })
      })
      .then( res => {
        if (res.status === 200 ) {
          Alert.alert("Email sent!!")
          setIsLoading(false)
        }
        else if (res.status === 401) {
          Alert.alert('Incorrect password!')
          setIsLoading(false)
        }
        else if (res.status === 404) { 
          res.json().then(res => {
            if (res.msg) {
              if (res.msg == 'Redis error occurred in forgetPassword') {
                Alert.alert("Some error happened. Please try again!")
                setIsLoading(false)
              }
              else {
                Alert.alert( res.msg )
                setIsLoading(false)
              }
            }
            else {
              Alert.alert("Some error happened. Please try again!")
              setIsLoading(false)
            }
          })
        }
        else {
          Alert.alert("Some error happened. Please try again!")
          setIsLoading(false)
        }
      })
    }

    const Reset = () => {
      fetch( BACKEND + "/user/reset-password" , {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": route.params.email.trim().toLowerCase(),
          "password":password,
          "comfirmPwd":confirmPwd,
          "code":code
        })
      })
      .then( res => {
        if (res.status === 200) {
          Alert.alert("Reset successfully!")
          if (route.name == "AuthResetPwd") {
            navigation.navigate('Login')
          }
          else {
            navigation.navigate('Accounts')
          }
          setIsLoading(false)
        }
        else if (res.status === 404) {
          Alert.alert('User with this email does not exist. Please signup at first!')
          setIsLoading(false)
        }
        else {
          Alert.alert("Some error happened. Please try again!")
          setIsLoading(false)
        }
      })
    }


  return (
    <ScrollView style={{ backgroundColor:"white", flex:1, }}>
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1, }}>
        <View style={{padding:26}} >
          <TouchableOpacity style={{paddingBottom:10, width:"100%"}} onPress={() => navigation.goBack()}>
            <EvilIcons color={color.black}  name="chevron-left" size={30}></EvilIcons>
          </TouchableOpacity>
          <Pressable style={{paddingVertical:40, width:"90%"}} onPress={Keyboard.dismiss}>
              {/* <Typography.H>Reset Password</Typography.H> */}
          </Pressable>
           <AppForm
           
            initialValues={{ name: "", email: "", password: "" }}
            onSubmit={() => setIsLoading(true)}
            validationSchema={validationSchema}
          >
            <Input>
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
            </Input>
            <Input>
              
              <TextInput.AuthPw
                placeholder="new password"
                name="password"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                onChangeText={(text) => setPassword(text)}
              />
            </Input>
            <Input>
              
              <TextInput.AuthPw
                placeholder="confirm password"
                name="password"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                onChangeText={(text) => setConfirmPwd(text)}
              />
            </Input>
            {/* <SubmitBtn title="Signup" /> */}
            { isLoading ?
            <View style= {{backgroundColor:color.darkBrown, width:"100%", marginTop:15,height:50, borderRadius:20, alignItems:"center", justifyContent:"center"}} >
                <ActivityIndicator size="small" color={color.faintgray} />
            </View> 
            :
            <View style={{ width:"100%", paddingTop:15, height:65}}>
              <SubmitBtn title="Reset" />
            </View>
            }
          </AppForm> 
          <Text style={{color:color.gray, paddingTop:30, paddingHorizontal:10}} >Please enter the 6-digit code we just sent to {route.params.email}</Text>
          <View style={{paddingTop:30, flexDirection:"row", alignSelf:'center'}}>
            <Text color={color.gray}>Didn't get a code?</Text>
            <View style={{width:5}}/>
            <TouchableOpacity onPress={() => Resend()}>
              <Text style={{color:color.darkBrown}}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </ScrollView>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Main = styled.ScrollView`
  padding: 26px;
`;

const Header = styled.Text`
  margin-bottom: 60px;
`;

const Input = styled.View`
  padding-bottom: 26px;
`;

const Inputfield = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #d4d4d4;
  padding: 20px 0;
  /* height: 40px; */
`;



export default ResetPwd;
