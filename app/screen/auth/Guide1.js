import React, { useEffect, useState } from "react";
import { Text,  View, StyleSheet} from "react-native";

// assets and config
import * as Typography from "../../config/Typography";

// library 
import  Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// component 
import * as Button from "../../components/Blocks/Button"
import { notificationListener, requestUserPermission } from "../../util/notificationService";
import color from "../../config/color";


const Guide1 = ({ route, navigation }) => {

  // async function getToken ()  {
  //   let fcmToken =  await AsyncStorage.getItem("fcmToken")
  //   if (fcmToken) {
  //     console.log(fcmToken)
  //   }
  // }

  // useEffect(() => {
  //   getToken()
  // },[])
  
  const List = ({ icon, title  }) => {
    return (
      <View style = {{flexDirection:"row", marginVertical:10, alignItems:"center"}}>
        <Ionicons color={color.black}  name={icon} size={30} style={{marginRight:10}} />
        <Typography.H3 color={color.black} >{title}</Typography.H3>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{marginBottom:50}}>
        <Typography.H color={color.black} >Welcome to Linking Book!</Typography.H>
        <View style={{height:20}} />
        <Typography.H2 color={color.black} >Here, people share</Typography.H2>
        <View style={{height:20}} />
        <List icon = "library-outline" title = "Books" /> 
        <List icon = "book-outline" title = "Articles" /> 
        <List icon = "play-outline" title = "Videos" /> 
        <Typography.H3 color={color.black} >or Anything we read</Typography.H3>
        {/* <Text style={{fontSize:30, marginVertical:20, fontFamily:"Cochin"}} >We read everyday</Text> */}
      </View>
      <View style={{width:"100%", flexDirection:"row-reverse"}} >
        <View style={{width:"30%", marginRight:20}}>
          <Button.Btn 
            fontSize={20} 
            label="Next" 
            backgroundColor="black" 
            labelcolor="white"
            borderRadius={15}
            onPress={()=> navigation.navigate("AppIntro")}
          />
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Guide1;
