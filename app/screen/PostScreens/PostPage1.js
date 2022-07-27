
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Platform, TouchableOpacity, Dimensions, BackHandler, ScrollView, Alert, Modal, ActivityIndicator} from 'react-native';

// import asset && config 
import color from '../../config/color';
import * as Typography from "../../config/Typography";
import { BACKEND } from '../../config/config';

// component 
import Header from "../../components/Bars&Header/Header";

//library
import * as ImagePicker from "react-native-image-picker"
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import extractDomain from 'extract-domain';
import ImageResizer from 'react-native-image-resizer';

// redux && helpers
import { useDispatch, useSelector } from 'react-redux';
import { dispatchtags, post, postImage } from '../../store/actions';
import { fetchLinkPreview, getData, getNew, getToken, storeData, storeToken } from '../../helpers/functions';


const { width, height } = Dimensions.get("window");

export default function PostPage1 ({ navigation, route }) {

  const postData = useSelector(state => state.post)
  const tags = useSelector(state => state.tags.tags)
  const dispatch = useDispatch();

  const UserId = useSelector(state => state.auth.id)

  const [ isPosting, setIsPosting ] = useState(false)

  // useEffect(() => {
  //   getData("PhotoAccessAsked").then( r => {
  //     if ( r == "N") {
  //       (async () => {
  //         if (Platform.OS !== 'web') {
  //           const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //           // console.log(status)
  //           if (status !== 'granted') {
  //             alert('To upload images, please change your privacy settings.');
  //           }
  //           storeData("PhotoAccessAsked", "Y")
  //         }
  //       })();
  //     }
  //   })
  // }, []);
  
  const pickImage = async () => { 
    const options = {
      quality: Platform.OS == "android"? 1 : 0.000000000000000000000000000000000000000000000000001,
    }
    let result = await ImagePicker.launchImageLibrary(options, res => {
      // console.log(res)
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } 
      else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } 
      else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } 
      else if (res.assets[0].uri) {
        // console.log(res.assets)
        // console.log(res.assets[0].uri)
        // dispatch(postImage(res.assets[0].uri)) 
        const q = Platform.OS == "android"? 70 : 1
        const resized =  async() => { 
          await ImageResizer.createResizedImage(res.assets[0].uri , 1024, 1024,'JPEG', q, 0, undefined, true, {onlyScaleDown: true, resizeMode: 'cover'}).then(response => {
            // console.log(response.uri)
            dispatch(postImage(response.uri)) 
        } )}
        resized()
      }
    });
  };


  const SelectImage = () =>{ // press image
    if (postData.post_image ) return( <View></View>)
    else {
      return(
      <TouchableOpacity onPress={pickImage} style={{width: width*0.5, height: width*0.5, backgroundColor:color.faintgray, borderRadius:12, alignItems:"center", justifyContent:"center", marginTop:height/2-width*0.25-110}} >
        <EvilIcons color={color.black}  name="camera" size={50}/>
      </TouchableOpacity>
    )}
  }

  const Back = () => {
    navigation.goBack()
  }

  const Submit = () => {
    let domain ="";
    if (postData.post_link) domain = extractDomain(postData.post_link)
    if (!postData.post_title) Alert.alert("You need to add a title!")
    else if (!postData.post_image && !postData.post_link)Alert.alert("You need to add a image or link!")
    else if ( postData.post_image || postData.post_link ){
      if (postData.post_link && domain !== "youtube.com") {
          fetchLinkPreview(postData.post_link).then( r => {
            Upload(r)
          })
      }
      else Upload();
    }
  }

  const Upload = (imgPreviewLink) => {
    setIsPosting(true)
    let formdata = new FormData();
    formdata.append("categoryId", 1);
    formdata.append("title", postData.post_title);
    formdata.append("price", 10.1);
    formdata.append("time", 2);
    formdata.append("content",postData.post_content)
    formdata.append("link",postData.post_link)

    if (imgPreviewLink) formdata.append("imgPreviewLink",imgPreviewLink)
    

    if (postData.post_image) {
      const uriParts = postData.post_image.split('.');
      const fileType = uriParts[uriParts.length - 1];

      // console.log(fileType)
      // console.log( uriParts)
      formdata.append("imageLink" , {
        // type:"png", 
        type: `image/${fileType}`,
        // uri :  postData.post_image, 
        uri :  postData.post_image, 
        name : UserId +  Date.now() +".png"})
      formdata.append("imageWidth", 100)
      formdata.append("imageHeight", 100)
      // console.log("------------------")
      // console.log(postData.post_image)
      // console.log("------------------")
    }

    for ( let i = 0 ; i < tags.length ; i ++ ) {
      formdata.append("tags",tags[i].id)
    }
    formdata.append("isPrivate", postData.isPrivate)

    // console.log(formdata)

    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + '/post/' + UserId, {
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization" : "Bearer " + accessToken
        },
        body: formdata
      })
      .then(res => {
        // console.log(res.status)
        // res.json().then( r => console.log(r))
        if (res.status === 200 || res.status === 201 ) {
          navigation.navigate("PostPage")
          navigation.navigate("HomePage",{isPosted:true})
          dispatch(post("","", null,"",false))
          dispatch(dispatchtags([]))
          setIsPosting(false)
        }
        else if ( res.status === 403 ) {
          getToken("refreshToken").then(refreshToken => {
            fetch(BACKEND + '/user/refresh-token', getNew(refreshToken))
            .then(result => {
              if (result.status === 200 || result.status === 201 ) {
                result.json().then(t => {
                  const new_accessToken = t.accessToken
                  storeToken("accessToken", new_accessToken)
                  fetch( BACKEND + '/post/' + UserId, {
                    method: 'post',
                    headers: {
                      'Content-Type': 'multipart/form-data',
                      "Authorization" : "Bearer " + accessToken
                    },
                    body: formdata
                  }) 
                  .then(res => {
                    if (res.status === 200 || res.status === 201 ) {
                      navigation.navigate("PostPage")
                      navigation.navigate("HomePage", {isPosted:true})
                      dispatch(post("","", null,"",false))
                      dispatch(dispatchtags([]))
                      setIsPosting(false)
                    }
                  })
                })
              }
              else { Alert.alert("Sorry, please try again!", "", [{text: "OK", onPress:() => setIsPosting(false)}]) }
              // setIsPosting(false)
            })
          })
        }
        else { 
          Alert.alert("Sorry, please try again!", "", [{text: "OK", onPress:() => setIsPosting(false)}]) 
        }
      })
    })
  }


  const LoadingModal = () => {
    return (
      <Modal visible={isPosting} transparent={true} animationType="fade">
        <View style={{width:"100%", height:"100%", backgroundColor: "#000000AA", justifyContent:"center", alignItems:"center"}} >
          <View style={{backgroundColor:"white", width:80, height:80, justifyContent:"center", alignItems:"center", borderRadius:20}}>
            <ActivityIndicator size="large" color={color.black}/>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <LoadingModal/>
      <Header 
        icon="chevron-left" 
        RightButtomName="Post" 
        onPressLeft={() => Back()} 
        onPressRight={()=> Submit()}
      />
      <View style={{paddingHorizontal:20, }}>
        <View style={{marginHorizontal:10, flexDirection:"row", alignItems:"center"}}>
          <Typography.H2 color={color.black} >Add Photo</Typography.H2>
          <Typography.Sub1 color={color.black} >  (Optional)</Typography.Sub1>
        </View>
      </View>
      <View style={{ marginHorizontal:30, flexDirection:"row", alignItems:"center"}}>
        <Text style={{color:color.gray, fontSize: 13}} >Sometimes a single picture tells more than thousand words. You can add a image if you want to!</Text>
      </View>
      <View style={{ alignItems:"center"}}>
          <SelectImage/>
          <TouchableOpacity onPress ={() => dispatch(postImage(null))} style={{marginTop: height/2-width*0.25-160}}>
            {postData.post_image && <Image source={{ uri: postData.post_image }} style={{ width: width*0.7, height: width*0.7, borderRadius:12, resizeMode:"cover"}} />}
            {/* <Image source={{ uri: image }} style={{ width: width*0.7, height: width*0.7, borderRadius:12, resizeMode:"contain"}} /> */}
          </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // paddingTop:30,
  },
  form:{
    flexDirection:"row", 
    alignItems:"center", 
    borderColor:color.gray, 
    borderRadius:25, 
    padding:10,
    // marginHorizontal:10,
    // borderWidth:1,
    marginVertical:10,
    width:"100%",
    backgroundColor:color.faintgray,
    // marginTop:30,
  },
});
