import React, { useEffect, useState } from "react";
import {Dimensions, StyleSheet, View, Text, TouchableOpacity, Image, Platform, Alert, Keyboard } from "react-native";

// assets and config
import styled from "styled-components";
import color from "../../config/color";
import * as Typography from "../../config/Typography";
import { BACKEND } from "../../config/config";

// library 
import  Ionicons from "react-native-vector-icons/Ionicons";
// import * as ImagePicker from 'expo-image-picker';
import * as ImagePicker from "react-native-image-picker"
import ImageResizer from 'react-native-image-resizer';

// component 
import * as Button from "../../components/Blocks/Button";
import { LoadingModal } from "../../components/Blocks/Modals"
import Header from "../../components/Bars&Header/Header";

// redux && helpers
import { useDispatch, useSelector } from 'react-redux';
import { refresh, signupAddedInfo } from "../../store/actions";
import { getToken, storeData, UpdatePost } from "../../helpers/functions";

 

const { width, height } = Dimensions.get("window");

const Guide2 = ({ navigation, route }) => {

  const dispatch = useDispatch();

  const UserData = useSelector(state => state.auth)
  const [ isLoading, setIsLoading ] = useState(false)

  // edit 
  const [ name, setName] = useState(UserData.name);
  const [ job, setJob ] = useState(UserData.job);
  const [ education, setEducation ] = useState(UserData.education);
  const [ description, setDescription ] = useState(UserData.description);
  const [ title, setTitle ] = useState(UserData.title);
  const [ avatar, setAvatar ] = useState("");
  const [ imgWidth, setImgWidth ] = useState(0);
  const [ imgHeight, setImgHeight ] = useState(0);


  const pickImage = async () => {
    const options = {
      quality: Platform.OS == "android"? 1 : 0.000000000000000000000000000000000000000000000000001,
    }
    let result = await ImagePicker.launchImageLibrary(options, res => {
      // console.log(res)
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } 
      else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } 
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } 
      else if (res.assets[0].uri) {
        setAvatar(res.assets[0].uri)
        setImgHeight(res.assets[0].height)
        setImgWidth(res.assets[0].width)
        storeData("SignupAvatar")
      }
    })
  };

  // sign up 
  useEffect(() => {
    if (isLoading) {
      if ( avatar ){
        const resized =  async() => { 
          const q = Platform.OS == "android"? 70 : 1
          await ImageResizer.createResizedImage(avatar , 350, (imgHeight)*350/(imgWidth),'JPEG', q, 0, undefined, true, {onlyScaleDown: true, resizeMode: 'cover'}).then(response => {
            // console.log(response.uri)
            Upload(response.uri)
        } )}
        // ProcessImage()
        resized()
      }
      else Upload()
    }
  }, [ isLoading ])

  const Upload = (avatar) => {
    let formdata = new FormData();
    formdata.append("title", route.params.title);
    if (avatar) {
      formdata.append("avatar",{type:"image/jpg", uri : avatar, name : UserData.id + Date.now() + ".jpg"})
    }
    // console.log(formdata)
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/user/profile/" + UserData.id, UpdatePost(accessToken, formdata))
      .then(res => {
        // console.log(res.status)
        if (res.status === 200 || res.status === 201 ) {
          res.json().then( result => {
            dispatch(signupAddedInfo( avatar, route.params.title,))
            storeData("SignupTitle", "")
            setIsLoading(false)
            storeData("LandingType", "SignUp")
            navigation.navigate("RecUser")
          })
        }
      })
    })
  }

  const Finish = () => {
    if (!avatar && !route.params.title) {
      storeData("SignupTitle", "")
      storeData("LandingType", "SignUp")
      navigation.navigate("RecUser")
      // Alert.alert("Welcome!")
    }
    else setIsLoading(true)
  }

  const Later = () => {
    storeData("SignupTitle", "")
    storeData("LandingType", "SignUp")
    navigation.navigate("RecUser")
    // Alert.alert("Welcome!")
  }

  return (
    <View style={{paddingTop:10, flex:1, width:"100%", backgroundColor:"white" }} showsHorizontalScrollIndicator={false} onScrollBeginDrag={Keyboard.dismiss}>
      {/*  */}
      <LoadingModal visible={isLoading} />
      <Header icon="chevron-left" onPressLeft={() => navigation.navigate("AddTitle")} />
      {/*  */}
      <View style={styles.container}>
        <View style={{width:"100%"}}>
          <Typography.H1 color={color.black} >Upload a profile picture!</Typography.H1> 
        </View>
        <View  style={{width:"100%", alignSelf:"center", flexDirection:"row", justifyContent:"space-evenly", marginVertical:0.3*width, height:100}}>
          { avatar ? 
            <TouchableOpacity onPress={() => setAvatar("")} >
              <Image 
                style={{height:150, width:150, borderRadius:75, resizeMode:"cover", alignSelf:"center"}}
                source={{uri:avatar}}
              />
              <Text style={{ alignSelf:"center", paddingTop: 20,textDecorationLine: "underline", color:color.black  }}>Remove</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => pickImage(true)}>
              <View style={{ backgroundColor:color.lightgray, height:150, width:150, borderRadius:75, alignSelf:"center", justifyContent:"center", alignItems:"center"}}  >
                <Ionicons name="camera" size={40} color="white" />
              </View>
            </TouchableOpacity>
          }
        </View>
      </View>
      <View style={{width:"100%", flexDirection:"row", justifyContent:"space-evenly", marginTop:50}} >
        <View style={{width:"30%"}}>
          {route.params.title ? null :
            <Button.BtnLine
              fontSize={18} 
              label="Maybe later"  
              labelcolor="black"
              onPress={() => Later()}
            />
          }

        </View>
        <View style={{width:"10%"}}/>
        <View style={{width:"30%"}}>
          <Button.Btn 
            fontSize={20} 
            label="Next" 
            backgroundColor="black" 
            labelcolor="white"
            borderRadius={15}
            onPress={() => Finish()}
          />
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    justifyContent:"center",
    backgroundColor: '#fff',
    // backgroundColor: 'green',
    width:"100%",
    paddingHorizontal:40,
    marginTop:40
  },

  Modalheader:{
    flexDirection:"row",
    padding:20,
    // marginTop:10,
    width:"100%",
    justifyContent:"space-between",
  },

  modal: {
    backgroundColor: 'green',
    margin: 50, // This is the important style you need to set
    paddingTop:50,
  },
  form:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    paddingTop:20,
    paddingHorizontal:20,
    marginVertical:10,
    width:"100%",
    height:300,
    backgroundColor:color.faintgray,
    // marginTop:30,
  },

});

const AvatarEmpty = styled.View`
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  margin-right: 15px;
  background-color: ${color.lightgray};
`;


export default Guide2;
