import React, { useEffect, useState } from "react";
import {Dimensions, ScrollView, StyleSheet, View, Text, Image, Platform, Alert, Keyboard, TextInput, Pressable } from "react-native";

// assets and config
import color from "../../config/color";
import { BACKEND } from "../../config/config";

// component 
import Header from "../../components/Bars&Header/Header";
import * as Button from "../../components/Blocks/Button";
import { EditAvatarModal, LoadingModal } from "../../components/Blocks/Modals"

// library 
import * as ImagePicker from "react-native-image-picker"

import styled from "styled-components";
import ImageResizer from 'react-native-image-resizer';

//icon
import AntDesign from "react-native-vector-icons/AntDesign";


// redux && helper
import { useDispatch, useSelector } from 'react-redux';
import { refresh, renewAvatar } from "../../store/actions";
import { getNew, getToken, storeToken, UpdatePost } from "../../helpers/functions";


const { width, height } = Dimensions.get("window");

const EditUserProfile = ({ navigation, route }) => {

  const dispatch = useDispatch();

  const UserData = useSelector(state => state.auth)
  // const TokenData = useSelector(state => state.token)

  const [ isLoading, setIsLoading ] = useState(false)

  // edit 
  const [ name, setName] = useState(UserData.name);
  const [ job, setJob ] = useState(UserData.job);
  const [ education, setEducation ] = useState(UserData.education);
  const [ description, setDescription ] = useState(UserData.description);
  const [ title, setTitle ] = useState(UserData.title);

  const pickImage = async () => { 
    const options = {
      quality: Platform.OS == "android" ? 1 : 0.000000000000000000000000000000000000000000000000001,
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
        const resized =  async() => { 
          const q = Platform.OS == "android"? 70 : 1
          await ImageResizer.createResizedImage(res.assets[0].uri , 1024, 1024,'JPEG', q, 0, undefined, true, {onlyScaleDown: true, resizeMode: 'cover'}).then(response => {
            patchPhoto(response.uri)
        } )}
        resized()
      }
    });
  };



  const removeAvatar = () => {
    let formdata = new FormData();
    formdata.append("avatar","")
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/user/profile/" + UserData.id, UpdatePost(accessToken, formdata))
      .then(res => {
        if (res.status === 200 || res.status === 201) setEditModal(false) 
        else Alert.alert("Sorry, please try again")
      })
    })
  }

  const setResult = ( result ) => {
    dispatch(refresh(
      "",
      "",
      result.name,
      result.email,
      UserData.id,
      result.phone_number,
      result.job,
      result.education,
      result.description,
      result.avatar,
      result.title,
      result.birthDate,
      result.gender,
    ))
  }


  const patchProfile = () => {
    let formdata = new FormData();
    formdata.append("name", name);
    formdata.append("job", job);
    formdata.append("education", education);
    formdata.append("description", description);
    formdata.append("title", title);

    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/user/profile/" + UserData.id, UpdatePost(accessToken, formdata))
      .then(res => { 
        if (res.status === 200 || res.status === 201 ) {
          res.json().then( result  => {
            setResult(result)
            setIsLoading(false)
            navigation.navigate("UserProfile") 
          })
        }
        else if (res.status === 403) {
          getToken("refreshToken").then(refreshToken => {
            fetch(BACKEND + '/user/refresh-token', getNew(refreshToken))
            .then(result => {
              if (result.status === 200 || result.status === 201 ) {
                result.json().then(t => {
                  const new_accessToken = t.accessToken
                  storeToken("accessToken", new_accessToken)
                  fetch( BACKEND + "/user/profile/" + UserData.id, UpdatePost(new_accessToken, formdata))
                  .then(r => {  
                    if (r.status === 200 || r.status === 201 ) {
                      r.json().then (r =>  {
                        setResult(r)
                      })
                      setIsLoading(false)
                      navigation.navigate("UserProfile", {isUpdated: true}) 
                    }
                  })
                })
              }
              else { 
                Alert.alert("Sorry. Please try again!")
                setIsLoading(false) 
              }
            })
          })
        }
        else { 
          Alert.alert("Sorry. Please try again!")
          setIsLoading(false)
        }
      })
    })
  }

  useEffect(() => {
    if ( isLoading){
      patchProfile()
    }
  }, [isLoading])

  const patchPhoto = (avatar) => {
    setEditModal(false)
    let formdata = new FormData();
    formdata.append("avatar",{type:"image/jpg", uri : avatar, name : UserData.id + Date.now() + ".jpg"})
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/user/profile/" + UserData.id, UpdatePost(accessToken, formdata))
      .then(res => {
        if (res.status === 200 || res.status === 201 ) {
          res.json().then( result => {dispatch(renewAvatar(avatar))})
        }
      })
    })
  }

  const Save = () => {
    setIsLoading(true)
  }

  const [ editModal, setEditModal ] = useState(false)

  return (
    <View style={{flex:1,width:"100%", backgroundColor:"white" }} showsHorizontalScrollIndicator={false} onScrollBeginDrag={Keyboard.dismiss}>
      <LoadingModal visible={isLoading} />
      <EditAvatarModal 
        visible={editModal} 
        onPressRemove={() => removeAvatar()} 
        onPressCancel={() => setEditModal(false)}
        onPressEdit={() => pickImage(true)}
      />
      <Header icon="close" onPressLeft={() => navigation.navigate("UserProfile")} RightButtomName="Save" onPressRight= {() => Save()} />
      <ScrollView onScroll={Keyboard.dismiss}>
        <View style={styles.container}>
          <View  style={{width:"100%", height:width*0.3, alignSelf:"center", flexDirection:"row", justifyContent:"space-evenly"}}>
              { (!UserData.avatar)? 
                // <AvatarEmpty>
                <View style={{ backgroundColor:color.lightgray, height:70, width:70, borderRadius:width*0.1, alignSelf:"center", justifyContent:"center", alignItems:"center"}}  >
                  <AntDesign name="user" size={30} color="white" />
                </View>
                :
                null
              }
            <Image 
              style={{height:width*0.2, width:width*0.2, borderRadius:width*0.1, resizeMode:"cover", alignSelf:"center"}}
              source={{uri:UserData.avatar}}
            />
            <View style={{ alignSelf:"center",  padding:10}}>
              <Button.BtnTxtUnderline
                label="Edit"
                size="small"
                color={color.darkBrown}
                onPress={() => setEditModal(true)}
              />  
            </View>
          </View>
          <Step>
            <Text style={{color: "black"}}>Name</Text>
            <TextInput
              style={{borderBottomWidth:0.5, borderColor:color.gray, paddingVertical:13, color:color.black}}
              name="title"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor={color.gray}
              maxLength={50}
              placeholder="Name"
            />
          </Step>
          <Step>
            <Text style={{color: "black"}}>Title</Text>
            <TextInput
              style={{borderBottomWidth:0.5, borderColor:color.gray, paddingVertical:13,color:color.black}}
              name="title"
              value={title}
              onChangeText={(text) => setTitle(text)}
              placeholderTextColor={color.gray}
              maxLength={50}
              placeholder="Title"
            />
          </Step>
          <View style={{marginTop:20}} >
            <Text style={{color: "black"}}>About Me </Text>
            <TextInput
              style={styles.form}
              name="title"
              value={description}
              onChangeText={(text) => setDescription(text)}
              maxLength={2000}
              multiline={true}
              placeholderTextColor={color.gray}
              placeholder="Inroduce yourself!"
            />
          </View>

          <View style={{height:600}} />
        {/* </ScrollView> */}
        </View>
      </ScrollView>
    </View>


  );
};

const Step = styled.View`
  margin: 20px 0;
`;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width:"100%",
    paddingHorizontal:40
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
    margin: 50, 
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
    color:color.black
  },

});

export default EditUserProfile;
