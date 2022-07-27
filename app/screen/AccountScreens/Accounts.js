import React, {useEffect, useState} from "react";
import { View, Dimensions, TouchableOpacity, Alert, RefreshControl } from "react-native";

// assets and config

import styled from "styled-components";
import color from "../../config/color";
import { Cap } from "../../config/Typography";
import * as Typography from "../../config/Typography";
import { BACKEND } from "../../config/config";

// component 
import { SingleList } from "../../components/InPageCpnt/Account";
import * as List from "../../components/Blocks/List";
import * as Button from "../../components/Blocks/Button";

// library 
import { ScrollView } from "react-native-gesture-handler";

// redux && helpers
import { useDispatch, useSelector } from "react-redux";
import { refresh } from "../../store/actions";
import { GET, getNew, getToken, storeToken } from "../../helpers/functions";

const { width } = Dimensions.get("window");

const Accounts = ({ navigation, route }) => {

  const UserData = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const [ refreshing, setRefreshing ] = useState(false)
  const [ followersN, setFollowersN ] = useState("") 
  const [ followingsN, setFollowingsN ] = useState("") 

  // set follower/ following function  -------------
  const setFollow = ( N, router ) => {
    if (!N){
      if ( router === "following") setFollowingsN("0")
      if ( router === "followers") setFollowersN("0")
    }
    if (N) {
      if ( router === "following") setFollowingsN(N)
      if ( router === "followers") setFollowersN(N)
    }
  }

  const setResult = (r) => {
    dispatch(refresh(
      "",
      "",
      r.profile.name,
      r.profile.email,
      r.profile.id,
      r.profile.phone_number,
      r.profile.job,
      r.profile.education,
      r.profile.description,
      r.profile.avatar,
      r.profile.title,
      r.profile.birthDate,
      r.profile.gender,
    ))
    setFollow( r.following, "following" )
    setFollow( r.followed, "followers" )
    setRefreshing(false)
  }


  // refresh user data
  const refreshUser = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/user/profile/" + UserData.id, GET(accessToken))
      .then(res => {
        if ( res.status === 201 || res.status === 200 ) {
          res.json().then( res => {
            setResult(res)
          })
        }
        if (res.status === 403 ) {
          getToken("refreshToken").then(refresh_token => {
            fetch(BACKEND + '/user/refresh-token', getNew(refresh_token))
            .then(result => {
              if (result.status === 200 || result.status === 201 ) {
                result.json().then(t => {
                  const new_accessToken = t.accessToken
                  storeToken("accessToken", new_accessToken)
                  fetch( BACKEND + "/user/profile/" + UserData.id, GET(new_accessToken))
                  .then(r => {
                    if ( r.status === 201 || r.status === 200 ) {
                      r.json().then( user => {
                        setResult(user)
                      })
                    }
                  })
                })
              }
            })
          }) 
        }
      })
    })
  }

  useEffect(() => {
    refreshUser()
  }, [ refreshing ])

  useEffect(() => {
    if ( route.params) {
      if (route.params.refresh) setRefreshing(true)
    }
  }, [route.params])


  return (
    <Container>
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={()=> setRefreshing(true)}
        />
      }>
        <View 
          style={{ 
            flexDirection:"row", 
            paddingHorizontal:30
          }}
        >
          <View style={{width:0.6 * width}}>
            <TouchableOpacity 
              onPress={() => navigation.navigate("UserProfile")}
            > 
              <View>
                <List.UserList
                  image={UserData.avatar}
                  title={UserData.name ? UserData.name : ""}
                  secondary="Show Profile"
                  onPress={() => navigation.navigate("UserProfile")}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:"row", justifyContent:"space-evenly", marginBottom:20 }} />
        </View>
        <View style={{flexDirection:"row", justifyContent:"space-evenly" , marginBottom:30}}  >
          <TouchableOpacity style={{alignItems:"center"}} onPress ={()=> navigation.push( "AccountUserList", { previousPage: "HomeUserProfile", theUserId: UserData.id, type:"followers" })} >
            <Button.BtnText 
              label="followers" 
              color={color.gray}  
              onPress ={()=> navigation.push( "AccountUserList", { previousPage: "HomeUserProfile", theUserId: UserData.id, type:"followers" })}
            />
            <View style={{height:25}} >
              <Typography.H4 color={color.black} bold>{followersN}</Typography.H4>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{alignItems:"center"}}
            onPress ={()=> navigation.push( "AccountUserList", { previousPage: "HomeUserProfile", theUserId: UserData.id, type:"following" })}
          >
            <Button.BtnText 
              label="following" 
              color={color.gray} 
              onPress ={()=> navigation.push( "AccountUserList", { previousPage: "HomeUserProfile", theUserId: UserData.id, type:"following" })}  
            />
            <View style={{height:25}} >
              <Typography.H4 color={color.black} bold>{followingsN}</Typography.H4>
            </View>
          </TouchableOpacity>
        </View>
        <HLine />
        <View style={{ paddingHorizontal: 20, marginTop: 40, marginBottom: 10 }}>
            <Cap color={color.gray}>Account Settings</Cap>
        </View>
        <SingleList icon="account" title="Personal Information" onPress={() => navigation.navigate("PersonalInfo")}/>
        <SingleList icon="earth" title="My Posts" onPress={() => navigation.navigate("MyPosts")}/>
        <SingleList icon="cog-outline" title="Settings" onPress={() => navigation.navigate("AccountSettings")}/>
        <View style={{ paddingHorizontal: 20, marginTop: 40, marginBottom: 10 }}>
            <Cap color={color.gray}>Support</Cap>
        </View>
        <SingleList icon="help" title="Get Help" onPress={() => Alert.alert("Please contact support! Thank you!")}/>
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const HLine = styled.View`
  width: 100%;
  margin: 0 auto;
  height: 1px;
  background-color: ${color.lightgray};
`;


export default Accounts;
