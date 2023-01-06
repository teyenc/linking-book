import React, { useEffect, useState } from "react";
import { Alert, Image , View, TouchableOpacity, ScrollView, Pressable, Keyboard, ActivityIndicator, Dimensions, Text, Linking } from "react-native";



//config and assests 
import styled from "styled-components";
import color from "../../config/color";
import * as Typography from "../../config/Typography";
import { BACKEND, tester } from "../../config/config";

// library 
import * as Yup from "yup";
import * as WebBrowser from 'expo-web-browser';

// component 
import AppForm from "../../components/forms/AppForm";
import * as TextInput from "../../components/forms/AppInput";
import SubmitBtn from "../../components/forms/SubmitBtn";

// redux && helpers
import { useDispatch } from 'react-redux';
import { openLink, storeData, storeToken } from "../../helpers/functions";
import { login, setBlock } from "../../store/actions";

// yup will set before fetch 
const validationSchema = Yup.object().shape({
  email: Yup.string().
  // required().email().
  label("Email"),
  password: Yup.string().
  // required().min(8). 
  label("Password"),
});

// const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 80;
const { width, height } = Dimensions.get("window");


const Signup = ({ navigation }) => {

    const [ name, setName ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ isLoading, setIsLoading ] = useState(false)

    const dispatch = useDispatch();

    useEffect(() => {
      if (isLoading) {
        if (!name) {
          Alert.alert("Please enter your name!")
          setIsLoading(false)
        }
        else if (!email) {
          Alert.alert("Please enter your email!")
          setIsLoading(false)
        }
        else if (!password) {
          Alert.alert("Please enter your password")
          setIsLoading(false)
        }
        else {
          signupEmail()
        }
      }
    }, [ isLoading ])

    useEffect(() => {
      setName(firstName + " " + lastName)
    }, [ firstName, lastName])


  const signupEmail = () => {
    fetch( BACKEND + "/user/signup-email", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "name":name,
        "email":email.trim().toLowerCase(), 
        "password":password,
      })
    })
    .then( res => {
      // console.log(res.status)
      if (res.status === 200) {
        navigation.navigate('VerificationCode', { name: name, email: email.trim().toLowerCase(), password:password })
        setIsLoading(false)
      }
      else {
        res.json().then(res => {
          if (res.msg) Alert.alert(res.msg)
          else Alert.alert("Some error happened. Please try again!")
          setIsLoading(false)
        })
      }
    })
  }

  const testerSignin = () => {
    fetch(BACKEND + '/user/signin', 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email":tester.email, 
        "password":tester.pwd,
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
            tester.email,
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
            email:tester.email,
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

  const touUri = "https://linkingbook.io/term-of-use/"
  const plcyUri = "https://linkingbook.io/data-policy/"

  return (
    <ScrollView style={{ backgroundColor:"white", flex:1}}>
      <Pressable style={{width:"100%", alignItems:"center", paddingTop:80}} onPress={Keyboard.dismiss}>
        <Image  style ={{height:40, resizeMode:"contain", marginVertical:20}} source={require('../../asset/text.png')}/> 
      </Pressable>
      <Pressable onPress={Keyboard.dismiss} style={{ padding:0,  }}>
        <View style={{paddingHorizontal:26, paddingTop:26, paddingBottom:15 }} >
           <AppForm
            initialValues={{ name: "", email: "", password: "" }}
            onSubmit={() => setIsLoading(true)}
            validationSchema={validationSchema}
          >
            <View style={{flexDirection:"row", width:"100%", alignItems:"center", paddingBottom:26}}>
              <View style={{width:"47%", marginRight:"3%"}}>
                <TextInput.name
                  placeholder="First name"
                  name="name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  clearButtonMode="always"
                  textContentType="name"
                  onChangeText={(text) => setFirstName(text)}
                />
              </View>
              <View style={{width:"47%", marginLeft:"3%"}}>
                <TextInput.name
                  placeholder="Last name"
                  name="name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  clearButtonMode="always"
                  textContentType="name"
                  onChangeText={(text) => setLastName(text)}
                />
              </View>
            </View>
            <Input>
              <TextInput.email
                placeholder="email"
                name="email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                clearButtonMode="always"
                textContentType="emailAddress"
                // onChangeText={(text) => setEmail(text)}
                onChangeText={(text) => setEmail(text)}
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
            {/* <SubmitBtn title="Signup" /> */}
            { isLoading ?
            <View style= {{backgroundColor:color.darkBrown, width:"100%", marginTop:15,height:50, borderRadius:20, alignItems:"center", justifyContent:"center"}} >
                <ActivityIndicator size="small" color={color.faintgray} />
            </View> 
            :
            <View style={{ width:"100%", paddingTop:15, height:65}}>
              <SubmitBtn title="Sign up" />
            </View>
            }
          </AppForm> 
          {/* <View style={{ width:"100%", paddingTop:15, height:65}}>
            <Button.BtnContain label= "Sign in with Google" onPress ={()=> handleGoogleSignin()} />
          </View> */}
        </View>
      </Pressable>

      <Pressable style={{flexWrap:"wrap", paddingHorizontal:"10%", width:"100%", justifyContent:"center", flexDirection:"row", alignContent:"center"}}>
        <Text style={{color:color.darkBrown, fontSize:13 }}>By signing up, I agree with </Text>
        <TouchableOpacity onPress={() => openLink(touUri)}>
          <Text style={{fontSize:14, color:color.blue}}>Term of use</Text>
        </TouchableOpacity>
        <Text style={{color:color.darkBrown, fontSize:13}}> and </Text>
        <TouchableOpacity onPress={() => openLink(plcyUri)}>
          <Text style={{color:color.blue, fontSize:14}}>Privacy policy</Text>
        </TouchableOpacity>
      </Pressable>


      <View style={{paddingTop:50, flexDirection:"row", alignSelf:'center'}}>
        <Typography.H3 color={color.gray}>Already an user?</Typography.H3>
        <View style={{width:5}}/>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Typography.H3 color={color.darkBrown}>Log in</Typography.H3>
        </TouchableOpacity>
      </View>
      <View style={{ width:"60%", paddingTop:15, height:65, alignSelf:"center", alignItems:"center"}}>
        {/* <SubmitBtn title="Contunue as tester" /> */}
        <TouchableOpacity 
          style={{
            // backgroundColor:color.lightBrown,
            padding:10,
            borderRadius:10
          }}
          onPress = {() => testerSignin()}
        >
          <Text style={{fontSize:15, fontWeight:"300"}}>or Contunue as tester</Text>
        </TouchableOpacity>
      </View>

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



export default Signup;
