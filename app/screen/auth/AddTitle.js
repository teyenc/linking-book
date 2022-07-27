import React, { useEffect, useState } from "react";
import {Dimensions, StyleSheet, View, Keyboard, TextInput } from "react-native";

// assets and config
import styled from "styled-components";
import color from "../../config/color";
import * as Typography from "../../config/Typography";

// library 

// component 
import Header from "../../components/Bars&Header/Header";
import * as Button from "../../components/Blocks/Button";

// redux && helpers
import { getData, storeData} from "../../helpers/functions";


const { width, height } = Dimensions.get("window");

const AddTitle = ({ navigation, route }) => {

  const [ isLoading, setIsLoading ] = useState(false)
  const [ title, setTitle ] = useState("");

  useEffect(() => {
    getData("SignupTitle").then( r => { if (r) setTitle(r) })
  },[])


  const Next = () => {
    if (title) {
      storeData("SignupTitle", title)
    }
    navigation.navigate("Guide2", {title:title})
  }

  const Later = () => {
    setTitle("")
    storeData("SignupTitle", "")
    navigation.navigate("Guide2", {title:""})
  }

  return (
    <View style={{paddingTop:10, flex:1, width:"100%", backgroundColor:"white" }} showsHorizontalScrollIndicator={false} onScrollBeginDrag={Keyboard.dismiss}>
      {/*  */}
      {/* <LoadingModal visible={isLoading} /> */}
      <Header icon="chevron-left" onPressLeft={() => navigation.goBack()} />
      {/*  */}
      <View style={styles.container}>
        <View style={{width:"100%", marginBottom:50}}>
          <Typography.H1 color={color.black} >Add a title to brief yourself!</Typography.H1> 
        </View>
        <View style={styles.form}>
          <TextInput
            style={{paddingHorizontal:20, paddingVertical:20, width:"100%",color:color.black}}
            placeholder="ex: Google engineer"
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholderTextColor={color.gray}

          />
        </View>
      </View>
      <View style={{width:"100%", flexDirection:"row", justifyContent:"space-evenly", marginTop:50}} >
        <View style={{width:"30%"}}>
          <Button.BtnLine
            fontSize={18} 
            label="Maybe later"  
            labelcolor="black"
            onPress={() => Later()}
          />
        </View>
        <View style={{width:"10%"}}/>
        <View style={{width:"30%"}}>
          <Button.Btn 
            fontSize={20} 
            label="Next" 
            backgroundColor="black" 
            labelcolor="white"
            borderRadius={15}
            onPress={() => Next()}
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
    width:"100%",
    backgroundColor:color.faintgray,
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


export default AddTitle;
