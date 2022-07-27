import { BACKEND } from "../config/config";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as SecureStore from 'expo-secure-store';
import { useDispatch } from "react-redux";
import { refreshCollection } from "../store/actions";
import { getLinkPreview } from "link-preview-js";
import { InAppBrowser } from 'react-native-inappbrowser-reborn'


// get youtube video id 
export function youtube_parser(url){
  let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  let match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}

export const openLink = async (link) => {
  try {
    // const url = 'https://www.proyecto26.com'
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(link, {
        // dismissButtonStyle: 'cancel',
        // preferredBarTintColor: '#453AA4',
        // preferredControlTintColor: 'white',
        // readerMode: false,
        // animated: true,
        // modalPresentationStyle: 'fullScreen',
        // modalTransitionStyle: 'coverVertical',
        // modalEnabled: true,
        // enableBarCollapsing: false,

      })
      // console.log(result)
      // Alert.alert(JSON.stringify(result))
    }
    else Linking.openURL(url)
  } catch (error) {
    console.log(error.message)
  }
}

// store credential -----------------------------------------
export const storeToken =  async (key, value) => {
  try {
    // await SecureStore.setItemAsync(key, value);
    await AsyncStorage.setItem( key, value)
  } catch (error) {
    console.log(error)
  }
}

export const getToken = async (key) =>  {
  try {
    // let result = await SecureStore.getItemAsync(key);

    const data = await AsyncStorage.getItem(key)
    return data 
    // console.log(result)
    return result
  } catch (error) {
    console.log(error)
  }
}


//store normal data------------------------------------
export const storeData = async ( LocalType ,value) => {
  try {
    await AsyncStorage.setItem( LocalType, value)
  } catch (e) {
    // saving error
    console.log(e)
  }
}

export const getData = async ( LocalType ) => {
  try {
    const data = await AsyncStorage.getItem(LocalType)
    return data 
  } 
  catch(e) {
    console.log(e)
  }
}

export const fetchLinkPreview = async (link) => {
  const preview = await getLinkPreview(link).then(data => {
    const img = data.images && data.images.length > 0
    ? data.images.find(function(element) {
        return (
          element.includes(".png") ||
          element.includes(".jpg") ||
          element.includes(".jpeg") ||
          (element.includes("image") && !element.includes("svg"))
        );
      })
    : ""

    const favicons = data.favicons && data.favicons.length > 0
    ? data.favicons.find(function(element) {
        return (
          element.includes(".png") ||
          element.includes(".jpg") ||
          element.includes(".jpeg") ||
          (element.includes("image") && !element.includes("svg"))
        );
      })
    : ""

    return img ? img : favicons
  })

  return preview
}


// --------------------------------------------------


export const unfollowFunction = (userIdFollowed, token) => {
  let response = {
    method:"DELETE",
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token,
    },
    body:JSON.stringify({
      userIdFollowed : userIdFollowed
    })
  }
  // console.log(response)
  return response
}

export const followFunction = (userIdFollowed, token) => {
  let response = {
    method:"POST",
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token,
    },
    body:JSON.stringify({
      userIdFollowed : userIdFollowed
    })
  }
  // console.log(response)
  return response
}

export const saveOne = ( postId, collectionId, token ) => {
  let response = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token
    },
    body: JSON.stringify({
      "postId": postId,
      "collectionId": collectionId
    })
  }
  return response
}

export const UpdateCollection = ( collectionName, isPrivate , token ) => {
  let response = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token
    },
    body: JSON.stringify({
      name: collectionName,
      isPrivate : isPrivate,
    })
  }
  return response
}

export const UpdatePost = ( token, formdata ) => {
  // console.log(formdata)
  let response = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
      "Authorization" : "Bearer " + token
    },
    body: formdata
  }
  return response
}



export const checkFollowFactor = (userIdFollowed, token ) => {
  let response =  {
    method:"POST",
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token,
    },
    body:JSON.stringify({
      userIdFollowed : userIdFollowed
    })
  }
  // console.log(response)
  return response
}

export const saveInNew = (collectionName, postId, token) => {
  let response = {
    method: 'POST',
    headers: {
      // 'Content-Type': 'multipart/form-data',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token
    },
    body: JSON.stringify({
      name: collectionName,
      postId: postId,
    })
  } 
  return response
}

export const RemoveSave = ( postId, collectionId, token) => {
  let response = {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token,
    },
    body: JSON.stringify({
      postId:postId ,
      collectionId:collectionId,
    })
  } 
  // console.log(response)
  return response
}

export const goToLink = (link) => {
  if (!link) {
    return(null)
  }
  else {Linking.openURL(link )}
}

export const getRefreshToken = async () => {
  try {
    const data = await AsyncStorage.getItem('LoginData')
    const user = JSON.parse(data)
    return user
  } 
  catch(e) {
    console.log(e)
  }
}

// export co

export const getNew = (refresh_token) => {
  let response = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refresh_token
      })  
    }
  return response
}

export const getTimeDif =  ( inputTime ) =>  {
  const postDate = Date.parse(inputTime)
  let date = new Date(postDate)

  const dif = new Date(Date.now()) - date  // timestamp - timestamp
  var diffMins = Math.floor((dif/1000)/60);

  if ( diffMins == 0) {
    return("just now")
  }
  else if ( 0 < diffMins && diffMins < 60 ) {
    return( JSON.stringify(diffMins)+ "m" )
  }
  else if ( 60*24 > diffMins &&  diffMins >= 60   ) { // hr
    return( JSON.stringify(Math.floor(diffMins/60)) + "hr" )
  }
  else if ( 60*24 <= diffMins && diffMins < 60*24*30  ) { // day
    return( JSON.stringify(Math.floor(diffMins/ (60*24))) + "d" )
  }
  else if ( 60*24*30 <= diffMins && diffMins < 60*24*30*12 ) { // mth
    return( JSON.stringify(Math.floor(diffMins/ (60*24*30))) + "mth" )
  }
  else { 
    return( JSON.stringify(Math.floor(diffMins/ (60*24*30*12))) + "y" )
  }
}

export const GET = (token) => {
  let response =  {
    method:"GET",
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token,
    },
  }
  return response
}


// this is a function of fetching 
export async function  saveInNewFetch ( collectionName, postId, token ) {
  const response = await fetch( BACKEND + '/collection_post/save_new', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + token
      },
      body: JSON.stringify({
          name: collectionName,
          postId: postId,
      })
  })
  return response
} 

export const load = ( userId, token ) => {
  const dispatch = useDispatch()

  // console.log(BACKEND + '/collection/profile/' + userId)
  // console.log(token)
  // const response =  
  fetch( BACKEND + '/collection/profile/' + userId, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Authorization" : "Bearer " + token,
    }
  })
  .then( res=> {
    res.json().then(r => {
      // console.log(r)
      dispatch(refreshCollection(r.collections))
      storeData("test" , JSON.stringify(r))
      return r
    }) 
    // console.log(res)
  })
  // .then( r => {
  //   r.json()
  // })
  // console.log("A_A")
  // console.log(response)
  // return response
} 

// add then((res ) => {console.log(res)}) function here  
