import React, {useState, useEffect, useRef} from 'react';
import { View, FlatList, Text, SectionList, StatusBar, Dimensions, Touchable, TouchableOpacity, Image, Alert } from "react-native";
import styled from "styled-components";
import color from "../../config/color";
import { Cap } from "../../config/Typography";
import { ScrollView } from "react-native-gesture-handler";
import * as Typography from "../../config/Typography";
import * as Button from "../Blocks/Button"
import { BACKEND } from "../../config/config";
import { CommonActions } from '@react-navigation/native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

export const AddButtom = ({ onPress, ExploreOnPress, DataLoaded, onPressAll}) => {
  return (
    <View >
      <TouchableOpacity onPress ={onPress} style = {{margin:10, width :"90%", flexDirection:"row", height:50, justifyContent:"space-between", alignItems:"center", paddingTop:10, alignSelf:"center" }}>
        <View>
          <MaterialIcons name="add-circle-outline" size={30} color={color.darkBrown} />
        </View>
        <View style={{paddingLeft:20 , margin:10, borderWidth:1, borderColor:color.gray , height:40, width:"85%", justifyContent:"center" , borderRadius:30}}  >
          <Typography.Sub1 color={color.gray} >Got some thoughts? Share with us!</Typography.Sub1>
        </View>
      </TouchableOpacity>
      {
        DataLoaded.length ? 
        null :
        <View style={{height:height -50, width:width,  alignItems:"center", paddingTop:width/2 }}>
          <Typography.H1 color={color.black}>No posts here!</Typography.H1>
          <View style={{marginTop: 30, flexDirection:"row", width:"100%", justifyContent:"space-evenly"}}>
            <View style={{width:120}} >
              <Button.BtnContain 
                label = "Explore"
                onPress = {ExploreOnPress}
                color={color.darkBrown}
              />
            </View>
            <View style={{width:120}} >
              <Button.BtnContain 
                label = "See all post"
                onPress = {onPressAll}
                color={color.darkBrown}
              />
            </View>
          </View>
        </View>
      }

    </View>
  )
}

export const  HomePageFooter = ({ onPress, ExploreOnPress, DataLoaded, onPressAll}) => {
  return (
    <View style={{ width:width,  alignItems:"center"}}>
      <Typography.H1 color={color.black}>No more posts!</Typography.H1>
      <View style={{marginVertical: 30, flexDirection:"row", width:"100%", justifyContent:"space-evenly"}}>
        <View style={{width:120}} >
          <Button.BtnContain 
            label = "Explore"
            onPress = {ExploreOnPress}
            color={color.darkBrown}
          />
        </View>
        <View style={{width:120}} >
          <Button.BtnContain 
            label = "See all post"
            onPress = {onPressAll}
            color={color.darkBrown}
          />
        </View>
      </View>
    </View>
  )
}