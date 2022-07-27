
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text,Platform, View, TextInput,Alert, Dimensions , Modal, Switch, Keyboard, KeyboardAvoidingView} from 'react-native';

// asset && config
import color from '../../config/color';

// helpers && redux 
import {  useSelector } from 'react-redux';
import { getToken } from '../../helpers/functions';

// import data
import { BACKEND } from '../../config/config';

// component 
import Header from "../../components/Bars&Header/Header";

const { width, height } = Dimensions.get("window");


const SharedReportOther = ({ navigation, route }) =>  {

  const UserData = useSelector(state => state.auth)
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -150;
  const [ content, setContent ] = useState("")

  const report = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/report/" + UserData.id , {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify({
          "content":content,
          "postId": route.params.postId,
          "reporterId": UserData.id ,
          "reportType": 0
        })
      })
      .then(res => {
        if (res.status === 201 || res.status === 200 ) {
          Alert.alert("Thank you", "We will review this post very soon.", [
            // { text: "no" },
            { text: "OK", onPress: () => {
              navigation.goBack() 
              navigation.goBack() 
              navigation.goBack() 
            }},
          ])
        }
      })
    })
  }


  return (
    <View style={styles.container}>
        <Header 
          icon="chevron-left" 
          RightButtomName="Report" 
          onPressLeft={() => navigation.goBack()} 
          onPressRight={() => report()}
        />
        <View style={{paddingHorizontal:20, marginBottom:10 }}>
          <View style={styles.form}>
            <TextInput
              style={{paddingHorizontal:20, paddingVertical:90, paddingTop:20, height:280, width:"100%",color:color.black }}
              placeholder="Tell us why this post is improper"
              multiline
              numberOfLines={4}
              value={content}
              placeholderTextColor={color.gray}
              onChangeText={(text) => setContent(text)}
            />
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    width:"100%",
    backgroundColor:color.faintgray,
  },
  // heartOnPress style
  searchTag:{
    flexDirection:"row", 
    alignItems:"center", 
    alignSelf:"center",
    borderColor:color.gray, 
    borderRadius:25, 
    padding:10,
    width:"90%",
    backgroundColor:color.faintgray,
  },
  header:{
    flexDirection:"row",
    padding:20,
    // marginTop:10,
    width:"100%",
    justifyContent:"space-between"
  },
  Hline :{
    width: "100%",
    margin: 0,
    height: 1,
    backgroundColor: "#e6e6e6",
  },
  text:{
    marginLeft:20,
    fontSize:15,
    width:200,
    alignSelf:"center", 
    justifyContent:"center"
  },
  Modalcontainer: {
    // marginTop:50,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    // paddingTop:20,
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: height * 0.92,
    // marginTop:200,
  },
  option:{
    flexDirection:"row",
    width:"100%", 
    height:60, 
    // backgroundColor:"green"
  },
});

export {SharedReportOther};