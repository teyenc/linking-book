import React, { useEffect, useState } from "react";
import {Dimensions,FlatList, ScrollView, StyleSheet, View, RefreshControl} from "react-native";

// assets and config
import styled from "styled-components";
import color from "../../config/color";
import * as Typography from "../../config/Typography";
import { BACKEND } from "../../config/config";

// component 
import * as List from "../../components/Blocks/List";
import { LoadingModal } from "../../components/Blocks/Modals"
import Header from "../../components/Bars&Header/Header";

// library 

// redux && helpers
import { useDispatch, useSelector } from 'react-redux';
import { refresh} from "../../store/actions";
import { GET, getNew, getRefreshToken, getToken, storeToken } from "../../helpers/functions";

const { width, height } = Dimensions.get("window");

const Profile = ({ navigation, route }) => {

  const UserData = useSelector(state => state.auth)
  // const TokenData = useSelector(state => state.token)

  const [ refreshing, setRefreshing ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  const setResult = (res) => {
    dispatch(refresh(
      "",
      "",
      res.profile.name,
      res.profile.email,
      res.profile.id,
      res.profile.phone_number,
      res.profile.job,
      res.profile.education,
      res.profile.description,
      res.profile.avatar,
      res.profile.title,
      res.profile.birthDate,
      res.profile.gender,
    ))
  }

  // renew Userdata--------------------------------------------
  const refreshUser = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/user/profile/" + UserData.id, GET(accessToken))
      .then(res => {
        // console.log(res.status)
        if ( res.status === 201 || res.status === 200 ) {
          res.json().then( res => {
            setResult(res)
            setRefreshing(false)
          })
        }
        else if (res.status === 403 ) {
          getToken("refreshToken").then(refreshToken => {
            fetch(BACKEND + '/user/refresh-token', getNew(refreshToken))
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
        else {res.json().then(res=> {
          setRefreshing(false)
        })}
      })
    })
  }



  useEffect(()=> {
    refreshUser()
  }, [ refreshing ] )
  

  const dispatch = useDispatch();
  const UserInfo = () => {
    // const A = "Carrol School of Management in boston College "
    return(
      <View>
        <View style={{flexDirection:"row", justifyContent:"space-evenly" }}>
         <View style={{width:0.8*width }}>
           <List.UserList
             image={UserData.avatar}
             title={UserData.name}
            //  secondary={A}
             secondary={UserData.title}
           />
         </View>
         {/* <View style={{alignSelf:"center"}}>
           <Button.BtnTxtUnderline
              label="Edit"
              size="small"
              color={color.green}
              onPress={() => navigation.navigate("EditUserProfile")}
           />  
         </View>  */}
       </View>
       {/* <View style={{paddingRight:20, paddingLeft:20}}>
         <Section>
           <View style={{paddingBottom:10}}>
             <Typography.H2>Job / Education</Typography.H2>
           </View> 
           <Typography.P>{UserData.job}</Typography.P>
           <Typography.P>{UserData.education}</Typography.P>
         </Section>
       </View> */}
        
        {/* Description */}
       <View style={{paddingRight:20, paddingLeft:20}}>
         <Section>
           <View style={{paddingBottom:10}}>
             <Typography.H2 color={color.black} >About Me</Typography.H2>
           </View>
           <Typography.P color={color.black} >
             {UserData.description}
           </Typography.P>
         </Section>
        </View>
      </View>
    )
  }

  return (
    <View style={{flex:1, backgroundColor:"white"}}>
      <LoadingModal visible={isLoading} />
      <Header icon="chevron-left" onPressLeft={() => navigation.goBack()} RightButtomName="Edit" onPressRight={ () => navigation.navigate("EditUserProfile")} />
    
      <FlatList
        style={{width:"100%"}}
        data={""}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        renderItem={null}
        ListHeaderComponent={<UserInfo/>}
        refreshControl = {
          <RefreshControl
            onRefresh={()=> setRefreshing(true)}
            refreshing={refreshing}
          />
        }
      />
    </View>


  );
};

const Section = styled.View`
  padding: 18px 0;
`;


const HLine = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${color.lightgray};
`;

const Step = styled.View`
  margin: 20px 0;
`;

const styles = StyleSheet.create({
  container: {
    // marginTop:50,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    // paddingTop:20,
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: height * 0.95,
    height: height * 0.95,

    // marginTop:200,
  },

  Modalheader:{
    flexDirection:"row",
    padding:20,
    // marginTop:10,
    width:"100%",
    justifyContent:"space-between",
  },

  modal: {
    // backgroundColor: 'green',
    margin: 50, // This is the important style you need to set
    paddingTop:50,
  },
  form:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    // paddingHorizontal:10,
    // marginHorizontal:10,
    // borderWidth:1,
    // paddingVertical:20,
    width:"100%",
    backgroundColor:color.faintgray,
    // marginTop:30,
  },

});





export default Profile;
