import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

//import components

//import styles and asses
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { ActivityIndicator } from "react-native";
import color from "../../config/color";

const Header = ({
  icon,
  RightButtomName,
  onPressLeft,
  onPressRight,
  isLoading,
  iconRight,
  title
}) => {
  return (
    <View style={styles.Modalheader}>
      <TouchableOpacity onPress={onPressLeft} style={{paddingVertical:10, paddingHorizontal:20}}>
        <EvilIcons  color={color.black} name={icon} size={30}></EvilIcons>
      </TouchableOpacity>
      {
        title? 
        <View style={{justifyContent:"center", paddingVertical:10, paddingHorizontal:20}}>
          <Text style={{color:color.black, fontSize:20, fontWeight:"300"}}>{title}</Text>
        </View>
        :
        null
      }
      <TouchableOpacity style={{justifyContent:"center", paddingVertical:10, paddingHorizontal:20}} onPress={onPressRight}>
        {isLoading ? 
          <ActivityIndicator  color={color.darkBrown}/>
          :
          [RightButtomName ? 
            <Text style={{fontSize:20, fontWeight:"300", textDecorationLine:"underline", color:color.black}}>{RightButtomName}</Text>      
            :
            [ iconRight? 
              <Ionicons color={color.black}  name={iconRight} size={20}></Ionicons>
              :
              null
            ]
          ]
        }
      </TouchableOpacity>
    </View>
  );
};



const styles = StyleSheet.create({

  Modalheader:{
    flexDirection:"row",
    width:"100%",
    justifyContent:"space-between"
  },
})

export default Header;
