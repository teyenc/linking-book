import React, { useEffect, useState } from "react";
import { Text, Alert, View, Image, TouchableOpacity, Pressable, Keyboard , ActivityIndicator} from "react-native";

// assets and config
import { BACKEND } from "../../config/config";
import color from "../../config/color";

// library 
import EvilIcons from "react-native-vector-icons/EvilIcons";
import * as Yup from "yup";
import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components";

// component 
import AppForm from "../../components/forms/AppForm";
import * as TextInput from "../../components/forms/AppInput";
import SubmitBtn from "../../components/forms/SubmitBtn";

// redux && helpers
import {useDispatch, useSelector} from 'react-redux';



// yup will set before fetch 
const validationSchema = Yup.object().shape({
  email: Yup.string().
  // required().email().
  label("Email"),
  password: Yup.string().
  // required().min(8). 
  label("Password"),
});


const Forget = ({ route, navigation }) => {

    // console.log(props)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch();

  const UserData = useSelector(state => state.auth)
  // const TokenData = useSelector(state => state.token)

  useEffect(() => {
    if (isLoading) {
      sendEmail()
    }
    else setIsLoading(false)
  }, [ isLoading ])

  const sendEmail = () => {
    fetch( BACKEND + "/user/forget-password", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email.trim().toLowerCase(), 
      })
    })
    .then( res => {
      if (res.status === 200 ) {
        navigation.navigate('AuthResetPwd', { email: email.trim().toLowerCase() })
        setIsLoading(false)
      }
      else {
        Alert.alert("Some error happened. Please try again!")
        setIsLoading(false)
      }
    })
  }

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
              placeholder="Enter your account email"
              name="email"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              clearButtonMode="always"
              textContentType="emailAddress"
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          {/* <Input>
            <TextInput.AuthPw
              placeholder="password"
              name="password"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              onChangeText={(text) => setPassword(text)}
            />
          </Input> */}
          { isLoading ?
          <View style= {{backgroundColor:color.darkBrown, width:"100%", marginTop:15,height:50, borderRadius:20, alignItems:"center", justifyContent:"center"}} >
              <ActivityIndicator size="small" color={color.faintgray} />
          </View> 
          
          :
          <View style={{ width:"100%", paddingTop:15, height:65}}>
            <SubmitBtn title="Send verification code" />
          </View>
          }
        </AppForm>
        {/* <View style={{paddingTop:30, flexDirection:"row", alignSelf:'center'}}>
          <Text color={color.gray}>Forget Email?</Text>
          <View style={{width:5}}/>
          <TouchableOpacity >
            <Text style={{color:color.darkBrown}}>Sorry I don't think that's my problem</Text>
          </TouchableOpacity>
        </View> */}

        
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

export default Forget;
