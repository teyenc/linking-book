import React, { useEffect, useState } from "react";
import { Text,  View, StyleSheet, Dimensions, ScrollView} from "react-native";

// assets and config
import * as Typography from "../../config/Typography";


// component 
import * as Button from "../../components/Blocks/Button"
import FastImage from "react-native-fast-image";
import Header from "../../components/Bars&Header/Header";
import color from "../../config/color";


const AppIntro = ({ route, navigation }) => {
  const { width, height } = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <Header icon="chevron-left" onPressLeft={() => navigation.goBack()} />
      <View style={{paddingHorizontal:26}}>
        <View style={{paddingTop:10}}>
          <Typography.H1 color={color.black} >The world is full of untrusted information. We believe people deserve a better information source</Typography.H1>
        </View>
        <View style={{paddingTop:26}}>
          <Typography.H1 color={color.black} >Let's build a community, based on people's trust.</Typography.H1>
        </View>
      </View>
      <FastImage 
       style={{height:0.6*width, width:0.6*width}} 
       source={require('../../asset/network.png')}  
      />
      <View style={{width:"100%", flexDirection:"row-reverse", marginTop:width*0.1}} >
        <View style={{width:"30%", marginRight:20}}>
          <Button.Btn 
            fontSize={20} 
            label="Next" 
            backgroundColor="black" 
            labelcolor="white"
            borderRadius={15}
            onPress={()=> navigation.navigate("AddTitle")}
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
    // justifyContent: 'center',
  },
});

export default AppIntro;
