import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert , Switch} from 'react-native';

// import asset 
import color from '../../config/color';
import * as Typography from "../../config/Typography";
import { BACKEND } from '../../config/config';

//compenet
import Header from "../../components/Bars&Header/Header";

//library 
import { showMessage, hideMessage } from "react-native-flash-message";

// helpers && redux 
import { getToken, UpdateCollection } from '../../helpers/functions';

const UpdateCollectionName = ({ navigation, route }) =>  {

  //set private
  const collection = route.params.collection
  const [isPrivate, setIsPrivate] = useState(collection.isPrivate);
  const toggleSwitch = () => setIsPrivate(previousState => !previousState)

  // hooks
  const [ collectionName, setCollectionName] = useState(collection.name);

  const Cancel = () => {
    setCollectionName("");
    navigation.goBack();
  }

  const EditCollection = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + '/collection/'+ collection.id, UpdateCollection(collectionName, isPrivate, accessToken))
      .then(res => {
        if ( res.status === 200 || res.status === 201 ) {
          res.json().then(result => {
            showMessage({message: "Updated!"})
            navigation.navigate("UserCollections", { status:3 })
          })
        }
        else Alert.alert("Sorry. Please try again!")
      })
    })
  }

  
  const Finish = () => {
    if (!collectionName)Alert.alert("Please enter collection name!!")
    else EditCollection(); 
  }



  return (
    <View style={styles.container}>
      <Header icon="close" RightButtomName="Done" onPressLeft={() => Cancel()} onPressRight={() => Finish()}/>
      <View style={{paddingHorizontal:20, marginBottom:20 }}>
        <View style={{marginHorizontal:10}}><Typography.H2 color={color.black} >Edit Collection Name</Typography.H2></View>
        <View style={styles.form}>
          <TextInput
            style={{paddingLeft:10, width:"100%", height:150,color:color.black}}
            placeholder="Collection Name"
            multiline
            numberOfLines={4}
            placeholderTextColor={color.gray}
            value={collectionName}
            onChangeText={(text) => setCollectionName(text)}
          />
        </View>
        <View style={{paddingHorizontal:30, marginVertical:10 }}>
          <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-evenly"}}>
            <Typography.H4 color={color.black} >Set private?</Typography.H4>
            <View style={{width:"60%"}}/>
            <Switch  style={{marginLeft:"10%"}} onValueChange={toggleSwitch} value={isPrivate}/>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop:30,
  },
  form:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    padding:10,
    marginVertical:10,
    width:"100%",
    backgroundColor:color.faintgray,
    // marginTop:30,
  },
});

export default UpdateCollectionName;