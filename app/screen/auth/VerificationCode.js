import React, { useEffect, useState } from "react";
import { Text, Alert, View, Image, TouchableOpacity, Pressable, Keyboard , ActivityIndicator} from "react-native";


// assets and config
import { BACKEND } from "../../config/config";
import color from "../../config/color";

// library 
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from "styled-components";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import * as Yup from "yup";
import { ScrollView } from "react-native-gesture-handler";

// component 
import AppForm from "../../components/forms/AppForm";
import * as TextInput from "../../components/forms/AppInput";
import SubmitBtn from "../../components/forms/SubmitBtn";

// redux && helpers
import {connect, useDispatch, useSelector} from 'react-redux';
import {login, signup } from "../../store/actions";
import { storeToken } from "../../helpers/functions";

// yup will set before fetch 
const validationSchema = Yup.object().shape({
  email: Yup.string().
  // required().email().
  label("Email"),
  password: Yup.string().
  // required().min(8). 
  label("Password"),
});

const VerificationCode = ({ route, navigation }) => {

    // console.log(props)
  const signupData = route.params
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch();

  const UserData = useSelector(state => state.auth)
  // const TokenData = useSelector(state => state.token)

  const sendCode = () => {
    fetch( BACKEND + '/user/signup', 
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "name":signupData.name,
          "email":signupData.email.trim().toLowerCase(), 
          "password":signupData.password,
          "code": code,
        })
      })
      .then(res => {
        if (res.status === 201 || res.status === 200 ) {
          res.json()
          .then(result => {
            dispatch(signup(
              "",
              "",
              result.name,
              result.email,
              result.id,
              result.phoneNumber,
              result.avatar,
            ))
            // dispatch(Token(result.accessToken, result.refreshToken))

            const User = JSON.stringify({ 
              name: result.name,
              email:result.email,
              id:result.id,
              phoneNumber: result.phoneNumber,
              avatar: result.avatar,
            })
            const storeData = async (value) => {
              try {
                await AsyncStorage.setItem('LoginData', value)
              } catch (e) {
                // saving error
                console.log(e)
              }
            }
            storeData(User)
            // storeToken("")
            storeToken("accessToken", result.accessToken)
            storeToken("refreshToken", result.refreshToken)
            navigation.navigate("Guide1")
            setIsLoading(false)
            // Alert.alert("Welcome!")
          })
        }
        else if ( res.status === 400) {
          res.json().then(result => {
            // console.log(result)
            // console.log(JSON.stringify(result));
            if ( result.msg == "email must be unique" ) {
              setIsLoading(false)
              Alert.alert("This email is used")
            } 
            else if (result.msg == "phone_number must be unique") { 
              setIsLoading(false)
              Alert.alert("This phone is used")
            }
            else if (result.msg == "Email is required") { 
              setIsLoading(false)
              Alert.alert("Email is required")
            }
            else if (result.msg == "The user existed, plz sign in.") { 
              setIsLoading(false)
              Alert.alert("The user existed. Please sign in.")
            }
            else {
              setIsLoading(false)
              Alert.alert(result.msg)
            }
          })     
        }
        else if ( res.status === 404) {
          res.json().then(result => {
            let noUser = JSON.stringify(result.message)
            setIsLoading(false)
            Alert.alert(result.error)
          })     
        }
        else if (res.status === 401) {
          res.json().then(result => {
            setIsLoading(false)
            Alert.alert(result.error);
          })
        }
        else {res.json().then(result => {
            setIsLoading(false)
            Alert.alert(result.error);
        })}
      })
  }

  const Resend = () => {
    fetch( BACKEND + "/user/signup-email", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name":signupData.name,
        "email":signupData.email.trim().toLowerCase(), 
        "password":signupData.password,
      })
    })
    .then( res => {
      // console.log(res.status)
      if (res.status === 200) {
        // setIsLoading(false)
        Alert.alert("Email sent!")
      }
      else {
        Alert.alert("Some error happened. Please try again!")
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
            <View style={{height:50}} />
        </Pressable>
        <Text style={{color:color.black, marginBottom:30, paddingHorizontal:0}} >Please enter the 6-digit code we just sent to your email</Text>


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
        <View style={{paddingTop:30, flexDirection:"row", alignSelf:'center'}}>
          <Text style={{color:color.gray}}>Can't find code? Check your spam or promotion folder!</Text>
          <View style={{width:5}}/>
        </View>
        <TouchableOpacity onPress={() => Resend()} style={{marginTop:20}}>
          <Text style={{color:color.darkBrown, fontWeight:"400"}} >Or press here to resend</Text>
        </TouchableOpacity>

        
      </Pressable>
    </ScrollView>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Main = styled.View`
  padding: 26px;
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

export default VerificationCode;
