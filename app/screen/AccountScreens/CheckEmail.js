import React, { useEffect, useState } from "react";
import { Text, KeyboardAvoidingView, Platform, Alert, Image , View, TouchableOpacity, ScrollView, Pressable, Keyboard, ActivityIndicator} from "react-native";
import * as Yup from "yup";

//import components
import AppForm from "../../components/forms/AppForm";
import * as TextInput from "../../components/forms/AppInput";
import SubmitBtn from "../../components/forms/SubmitBtn";

//import styles and assets
import styled from "styled-components";
import color from "../../config/color";
import * as Typography from "../../config/Typography";

//import config
import { BACKEND } from "../../config/config";
import EvilIcons from "react-native-vector-icons/EvilIcons";

// yup will set before fetch 
const validationSchema = Yup.object().shape({
  email: Yup.string().
  label("Email"),
  password: Yup.string().
  label("Password"),
});

// const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 80;

const CheckEmail = ({ navigation, route }) => {

  // console.log(route)
    const [ oldEmail, setOldEmail ] = useState("")
    const [ newEmail, setNewEmail ] = useState("")
    const [ password, setPassword ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false)

    useEffect(() => {
      if (isLoading) {
        if (!password) {
          Alert.alert("Please enter your password")
          setIsLoading(false)
        }
        else if (!oldEmail) {
          Alert.alert("Please enter your current email!")
          setIsLoading(false)
        }
        else if (!newEmail) {
          Alert.alert("Please enter your new email!")
          setIsLoading(false)
        }
        else if (oldEmail === newEmail) {
          Alert.alert("Please enter a different email!")
          setIsLoading(false)
        }
        else {
          getCode()
        }
      }
    }, [ isLoading ])

  const getCode = () => {
    fetch( BACKEND + "/user/check-email", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "oldEmail": oldEmail,
        "newEmail": newEmail,
        "password": password,
      })
    })
    .then( res => {
      if (res.status === 200 || res.status === 201 ) {
        Alert.alert("Email sent!!")
        navigation.navigate("AccountResetEmail", { oldEmail: oldEmail, newEmail:newEmail, password: password })
        setIsLoading(false)
      }
      else if (res.status === 401) {
        Alert.alert('Incorrect password!')
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
      else {
        Alert.alert("Some error happened. Please try again!")
        setIsLoading(false)
      }
    })
  }


  return (
    <ScrollView style={{ backgroundColor:"white", flex:1 }} showsVerticalScrollIndicator={false} >
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1, }}>
        <View style={{padding:26}} >
          <TouchableOpacity style={{paddingBottom:10, width:"100%"}} onPress={() => navigation.goBack()}>
            <EvilIcons 
              color={color.black}  
              name="chevron-left" 
              size={30}
            />
          </TouchableOpacity>
          <Pressable style={{paddingVertical:60, width:"90%"}} onPress={Keyboard.dismiss}>
            <Typography.H color={color.black}>Reset email</Typography.H>
          </Pressable> 
           <AppForm
            initialValues={{ name: "", email: "", password: "" }}
            onSubmit={() => setIsLoading(true)}
            validationSchema={validationSchema}
          >
            <Input>
              <TextInput.email
                placeholder="Current email"
                name="email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                clearButtonMode="always"
                textContentType="emailAddress"
                onChangeText={(text) => setOldEmail(text)}
              />
            </Input>
            <Input>
              <TextInput.email
                placeholder="new email"
                name="email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                clearButtonMode="always"
                textContentType="emailAddress"
                onChangeText={(text) => setNewEmail(text)}
              />
            </Input>
            <Input>
              <TextInput.AuthPw
                placeholder="password"
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
              <SubmitBtn title="Reset" />
            </View>
            }
          </AppForm> 
          <View style={{paddingTop:30, flexDirection:"row", alignSelf:'center'}}>
            <Text color={color.gray}>Please input your email and password to confirm your identity</Text>
          </View>
        </View>
        <View style={{height:200}} />
      </Pressable>
    </ScrollView>
  );
};


const Input = styled.View`
  padding-bottom: 26px;
`;


export default CheckEmail;
