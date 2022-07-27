import React, { useEffect, useState } from "react";
import { Text, Alert, View, TouchableOpacity, Pressable, Keyboard , ActivityIndicator} from "react-native";

// assets and config
import * as Typography from "../../config/Typography";
import { BACKEND } from "../../config/config";
import color from "../../config/color";

// library 
import  EvilIcons from "react-native-vector-icons/EvilIcons";
import styled from "styled-components";
import { ScrollView } from "react-native-gesture-handler";
import * as Yup from "yup";

// component 
import AppForm from "../../components/forms/AppForm";
import * as TextInput from "../../components/forms/AppInput";
import SubmitBtn from "../../components/forms/SubmitBtn";

// redux && helpers
import { useDispatch, useSelector} from 'react-redux';
import {login, setBlock } from "../../store/actions";
import { storeData, storeToken } from "../../helpers/functions";

// yup will set before fetch 
const validationSchema = Yup.object().shape({
  email: Yup.string().
  // required().email().
  label("Email"),
  password: Yup.string().
  // required().min(8). 
  label("Password"),
});

const Login = ({ route, navigation }) => {

    // console.log(props)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch();

  const UserData = useSelector(state => state.auth)
  // const TokenData = useSelector(state => state.token)

  useEffect(() => {
    if ( isLoading) FetchLogin()
  }, [isLoading])


  const FetchLogin = () => {
    fetch(BACKEND + '/user/signin', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email":email.trim().toLowerCase(), 
        "password":password,
      })
    })
    .then(res =>  {
      // console.log(res.status)
      if (res.status === 200 ) {
        res.json().then(result => {
          dispatch(login(
            "",
            "",
            result.name,
            email,
            result.id,
            result.phoneNumber,
            result.job,
            result.education,
            result.description,
            result.avatar,
            result.title,
            result.birthDate,
            result.gender,
          ))

          const User = JSON.stringify({ 
            name: result.name,
            email:email.trim().toLowerCase(),
            id:result.id,
            phoneNumber: result.phoneNumber,
            job: result.job,
            education: result.education,
            description: result.description,
            avatar:result.avatar,
            title:result.title,
            birthDate: result.birthDate,
            gender:result.gender,
          })
          // console.log(result.blockingIds)
          storeData('LoginData', User )
          if (result.blockingIds) {
            storeData("blockIds", result.blockingIds)
            const blcIds = JSON.parse("[" + result.blockingIds+ "]")
            dispatch(setBlock(blcIds))
          }
          storeData("storedFollowingIds", result.user_following) 
          storeToken("accessToken", result.accessToken)
          storeToken("refreshToken", result.refreshToken)
          storeData("LandingType", "Login")
          navigation.navigate("HomeTab")
          // Alert.alert("Logged In!")
          setIsLoading(false)
        })
      }
      else if ( res.status === 404) {
        res.json().then(result => {
          if( result.msg == "User with that email does not exist. Please signup!"){
            setIsLoading(false)
            Alert.alert(" This email does not exist. Please signup!")
          }
        })     
      }
      else if (res.status === 401 || res.status === 400) {
        res.json().then(result => {
          setIsLoading(false)
          if (result.message) Alert.alert(result.message);
          if (result.msg) Alert.alert(result.msg);
        })
      }
      else {
        setIsLoading(false)
        Alert.alert("Some error happened, Please try again later ")
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
            <Typography.H color={color.black}>Log in</Typography.H>
        </Pressable>

        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={() => setIsLoading(true)}
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
            <SubmitBtn title="Login" />
          </View>
          }
          <View style={{paddingTop:30, flexDirection:"row", alignSelf:'center'}}>
            <Text style={{color:color.black}}>Forget Password?</Text>
            <View style={{width:5}}/>
            <TouchableOpacity onPress={() => navigation.navigate("Forget")}>
              <Text style={{color:color.darkBrown}}>Reset password</Text>
            </TouchableOpacity>
          </View>
        </AppForm>
        
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

export default Login;
