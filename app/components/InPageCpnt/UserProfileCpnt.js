import { View, Text, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";

//import styles and assets
import styled from "styled-components";
import * as Typography from "../../config/Typography";
import color from '../../config/color';

// import cpnt 
import * as Button from "../Blocks/Button";
import * as List from "../Blocks/List";
import * as Cards from "../Blocks/Cards";

const { width, height } = Dimensions.get("window");

export const UserInfo = ({ 
    isGetData,
    avatar, 
    name , 
    title , 
    unfollow, 
    isFollowing, 
    userId, 
    othersId , 
    follow,
    posterJob,  
    posterDescription, 
    posterEducation, 
    isLoadingFol,
    NavigationFollowers, 
    NavigationFollowing, 
    NavigationCollection,
    followersN,
    followingsN,
    isBlocked
}) => {
    return(
      <View>
        <View style={{flexDirection:"row", justifyContent:"space-evenly" }}>
          <View style={{width:0.6*width, marginRight:20}}>
            <List.UserList
                image={avatar}
                title={name}
                secondary={title}
              />
          </View>
          <View style={{alignSelf:"center"}}> 
            {
              (isGetData == false) ?
              <Button.BtnContain
                label="       "
                size="small"
                color="white"
                onPress={unfollow}
              />    
              :
              null
            }
            {
              (!isLoadingFol && isFollowing == true && userId !== parseInt(othersId) && isGetData == true) ?
              <Button.BtnContain
                label="unfollow"
                size="small"
                color={color.gray}
                onPress={unfollow}
              />    
              :
              null
            }
            {
              (!isLoadingFol && isFollowing == false && userId !== parseInt(othersId) && isGetData == true) ?
              <Button.BtnContain
                label="Follow"
                size="small"
                color={color.darkBrown}
                onPress={follow}
              />   
              :
              null               
            }
            {isLoadingFol?
              <View  style={{width:0.2*width}}>
                <ActivityIndicator/>
              </View>
              :
              null
            }
          </View> 
        </View>
        <View style={{flexDirection:"row", justifyContent:"space-evenly"}}>
          <TouchableOpacity style={{alignItems:"center"}}  onPress={NavigationFollowers}>
            <Button.BtnText label="followers" color={color.gray} onPress = { NavigationFollowers}/>
            <View style={{height:25}} >
              <Typography.H4 color={color.black} bold>{followersN}</Typography.H4>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{alignItems:"center"}} onPress ={NavigationFollowing} >
            <Button.BtnText label="following" color={color.gray} onPress = { NavigationFollowing}  />
            <View style={{height:25}} >
              <Typography.H4 color={color.black} bold>{followingsN}</Typography.H4>
            </View>
          </TouchableOpacity>
        </View>

         {
           posterDescription? 
           <View style={{paddingHorizontal:50, marginVertical:15}}>
            <Section>
              {/* <View style={{paddingBottom:10}}>
                <Typography.H2>About Me</Typography.H2>
              </View> */}
              <Typography.P color={color.black}>{posterDescription}</Typography.P>
            </Section>
          </View>
           :
           <View style={{height:20}} />

         }

        <HLine />
        {
          isBlocked ? null :
          <View style={{width:"90%", alignItems:"center", alignSelf:"center", paddingVertical:20}}>
            <Button.BtnContain label="View my collections" color={color.darkBrown} onPress={NavigationCollection} />
          </View>
        }

      </View>
    )
  }


const Section = styled.View`
padding: 18px 0;
`;

const HLine = styled.View`
border-bottom-width: 1px;
border-bottom-color: ${color.lightgray};
`;