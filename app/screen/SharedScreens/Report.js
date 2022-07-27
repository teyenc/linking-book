
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text,Platform, View, TextInput,Alert, ScrollView, Pressable,  TouchableOpacity, ActivityIndicator, Dimensions , Modal, Switch, Keyboard, KeyboardAvoidingView} from 'react-native';

// import asset 
import color from '../../config/color';
import Header from "../../components/Bars&Header/Header";

// helpers &&  redux 
import { useDispatch, useSelector } from 'react-redux';
import { GET, getToken } from '../../helpers/functions';

// config && assets
import { BACKEND } from '../../config/config';

// component 
import { reportData } from "../../data/report"

const { width, height } = Dimensions.get("window");


const SharedReport = ({ navigation, route }) =>  {

  const UserData = useSelector(state => state.auth)
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -150;

  const report = (postId) => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/report/" + UserData.id , {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify({
          "content":"",
          "postId": route.params.postId,
          "reporterId": UserData.id ,
          "reportType": postId
        })
      })
      .then(res => {
        if (res.status === 201 || res.status === 200 ) {
          Alert.alert("Thank you", "We will review this post very soon.", [
            // { text: "no" },
            { text: "OK", onPress: () => navigation.goBack() },
          ])
        }
      })
    })
  }


  const OptionList = ({ optionContent, onPress }) => {
    return(
      <TouchableOpacity style={{padding :15, flexDirection:"row", alignItems:"center"}} onPress={onPress}>
        <Text style={{marginLeft:10, fontSize:20, color:color.black}}>{optionContent}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
        <Header icon="close" onPressLeft={() => navigation.goBack()} />
        <ScrollView onScrollBeginDrag={Keyboard.dismiss}> 
          <View style={{paddingHorizontal:20, marginBottom:10 }}>
            {reportData.map((item, i) => (
                <OptionList 
                  optionContent={item.reportType} 
                  onPress={() => report(item.id)}
                />
              ))
            }
          <OptionList optionContent="Other" 
            onPress = {() => navigation.push("ReportOther", {postId:route.params.postId})} 
          />
          </View>
        </ScrollView>
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
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    flex: 1,
    backgroundColor: '#fff',
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

export {SharedReport};