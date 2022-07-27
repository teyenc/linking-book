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
import styled from "styled-components";
import { ScrollView } from "react-native-gesture-handler";
import * as Yup from "yup";

// redux && helpers
import {connect, useDispatch, useSelector} from 'react-redux';

// yup will set before fetch 
const validationSchema = Yup.object().shape({
  email: Yup.string().
  label("Email"),
  password: Yup.string().
  label("Password"),
});

const Confirm = ({ route, navigation }) => {

  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const UserData = useSelector(state => state.auth)

  useEffect(() => {
    if (isLoading) Verify()
  }, [isLoading])

  // console.log( email, password)

  const Verify = () => {
    fetch( BACKEND + "/user/reset-password-email", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email":UserData.email.trim().toLowerCase(), 
        "password": password
      })
    })
    .then( res => {
      if (res.status === 200 || res.status ==201 ) {
        Alert.alert("Email sent!!")
        navigation.navigate("AccountResetPwd", {email: UserData.email.trim().toLowerCase() })
        setIsLoading(false)
      }
      else if ( res.status === 401 ) {
        Alert.alert("Incorrect password!")
        setIsLoading(false)
      }
      else { res.json( r => {
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
          <EvilIcons 
            color={color.black}  
            name="chevron-left" 
            size={30}
          />
        </TouchableOpacity>
        <Pressable style={{paddingVertical:"30%", width:"90%"}} onPress={Keyboard.dismiss}>
        </Pressable>
        <AppForm
          initialValues={{ email: "", password: "" }}
          onSubmit={() => setIsLoading(true)}
          validationSchema={validationSchema} 
        >
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
            <Text color={color.gray}>Please enter your password to confirm your identity</Text>
          </View>
        </AppForm>
      </Pressable>
    </ScrollView>
  );
};

const Input = styled.View`
  padding-bottom: 26px;
`;


export default Confirm;
