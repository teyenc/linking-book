import React from "react";
import { View, Dimensions, TouchableOpacity, Alert } from "react-native";

//import styles and assets
import styled from "styled-components";
import color from "../../config/color";
import { Cap } from "../../config/Typography";
import { ScrollView } from "react-native-gesture-handler";
import * as Typography from "../../config/Typography";

// import component 
import { CommonActions } from '@react-navigation/native';
import { SingleList } from "../../components/InPageCpnt/Account";

// import redux
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/actions";
import { getData, storeData, storeToken } from "../../helpers/functions";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const AccountSettings = ({ navigation, route }) => {

  const UserData = useSelector(state => state.auth)
  const dispatch = useDispatch();

  const StoredItem = [
    "LoginData",
    "followingN", 
    "storedfollowingN", 
    "storedFollowingIds", 
    "ttpages", 
    "HomeLoadingPage",
    "exploreListingLoadingPage",
    "HomePageType",
    "LocalCollections",
    "SignupTitle",
    "SignupAvatar"
  ]

  const Logout = () => {
    StoredItem.map(item => {
      storeData(item, "")
    })
    storeToken("refreshToken","" )
    storeToken("accessToken","" )

    dispatch(login( "", "", "", "", "", "", "", "", "", "", "", "","",))
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Signup' },
        ],
      })
    );
  }

  // const LoadUserData

  const PressLogout = () => {
    Alert.alert("Sure to Log out?", "", [
      { text: "Yes", onPress: () => Logout() },
      { text: "no" },
    ]);
  }

  // console.log(UserData)

  return (
    <Container>
      <ScrollView>
        <TouchableOpacity style={{paddingBottom:10, width:"100%"}} onPress={() => navigation.goBack()}>
          <EvilIcons color={color.black}  name="chevron-left" size={30}></EvilIcons>
        </TouchableOpacity>
        <View style={{  paddingHorizontal: 20, marginTop: 20, marginBottom: 10 }}>
            <Cap color={color.gray}> Settings</Cap>
        </View>
        <SingleList  title="Reset Password" onPress={() => navigation.navigate("Confirm")}/>
        <SingleList  title="Delete account" onPress={() => navigation.navigate("ConfirmDeleteUser")}/>        
        <TouchableOpacity style={{ alignitems: "center", padding: 20, marginTop:20}} onPress={()=> PressLogout()} >
            <Typography.Sub1 color={color.gray}>Log Out</Typography.Sub1>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;


export default AccountSettings;
