import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Alert } from 'react-native';

//  asset && config 
import color from '../../config/color';
import * as Typography from "../../config/Typography";
import { BACKEND } from '../../config/config';

//component
import Header from "../../components/Bars&Header/Header";

// import redux 
import { refreshCollection } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getToken, storeData } from '../../helpers/functions';
import { Switch } from 'react-native';

const AddCollection = ({ navigation, route }) =>  {

  const UserData = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [isPrivate, setIsPrivate] = useState(false);
  const toggleSwitch = () => setIsPrivate(previousState => !previousState)

  // hooks
  const [ collectionName, setCollectionName] = useState("");

  const Cancel = () => {
    setCollectionName("");
    navigation.goBack()
  }

  const CreateCollection = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + '/collection/'+ UserData.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify({
          name: collectionName,
          isPrivate: isPrivate
        })
      })
      .then(res => {
        if (res.status === 200 || res.status === 201 ) {
          res.json().then(r => {
            storeData("LocalCollections", JSON.stringify(r.collections))
            dispatch(refreshCollection(r.collections))
          })
          navigation.navigate("UserCollections", {status:2})
        }
        else { 
          res.json().then(r => {
            if ( r.msg) {
              if ( r.msg == "You can only have 50 collections!") Alert.alert(r.msg)
              else Alert.alert("Sorry, some error happened!")
            }
            else Alert.alert("Sorry, some error happened!")
          })
        }
      })
    })
  }
  
  const Finish = () => {
    if (!collectionName ) Alert.alert("Please enter collection name!!")
    else if ( collectionName.length > 30  ) Alert.alert("Please limited in 30 characters!")
    else CreateCollection();
  }

  return (
    <View style={styles.container}>
      <Header icon="close" RightButtomName="Done" onPressLeft={() => Cancel()} onPressRight={() => Finish()}/>
      <View style={{paddingHorizontal:20, marginBottom:20 }}>
        <View style={{marginHorizontal:10}}><Typography.H2 color={color.black} >Add Collection Name</Typography.H2></View>
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
      </View>
      <View style={{paddingHorizontal:30, marginVertical:10 }}>
        <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-evenly"}}>
          <Typography.H4 color={color.black} >Set private?</Typography.H4>
          <View style={{width:"60%"}}/>
          <Switch  style={{marginLeft:"10%"}} onValueChange={toggleSwitch} value={isPrivate}/>
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
  },
});

export default AddCollection;