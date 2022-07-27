import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View ,TextInput, Dimensions, FlatList, RefreshControl, Alert, Platform} from 'react-native';

// config && asset
import color from '../../config/color';
import * as Typography from '../../config/Typography';
import { BACKEND } from '../../config/config';

//library
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import FastImage from "react-native-fast-image";

//icon
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";

//import redux && helpers
import { useDispatch, useSelector } from 'react-redux';
import { getTimeDif, getToken } from '../../helpers/functions';

const {width, height} = Dimensions.get("window")
 
const SharedComments = ({navigation, route}) =>  {

  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -150;

  // navigation 
  const [ routeName, setRouteNmae ] = useState("")
  useEffect (() => {
    let name = route.name.charAt(0)
    if ( name == "E" ) { setRouteNmae("Explore")} 
    else if ( name == "S" ) { setRouteNmae("Saved")} 
    else if ( name == "H" ) { setRouteNmae("Home")} 
    else if ( name == "A" ) { setRouteNmae("Account")}
  }, [])

  const UserData = useSelector(state => state.auth)

  // refresh && load 
  const [ refreshing, setRefreshing ] = useState(false);
  const [ isLoading, setIsLoading] = useState(false)

  // load data 
  const [ firstLoad, setFirstLoad ] = useState(false)
  const [ DataLoaded, setDataLoaded ] = useState([])
  const [ postCount, setPostCount ] = useState(0);
  const [ totalPage, setTotalPage ] = useState(0)
  const [ pageloaded, setPageLoaded ] =useState(0)  
  
  // comment 
  const [ comment, setComment ] =useState("")  

  //add comment----------------------------------

  const AddComment = () => {
    if (comment) Post()
  }

  const Post = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + '/comment/'+ UserData.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify({
          content : comment,
          postId: route.params.postId,
          posterId:route.params.posterId
        })
      })
      .then(res => {
        if (res.status === 200 || res.status === 201 ) {
          setComment("")
          setRefreshing(true)
        }
        else {
          Alert.alert("Some Error Happened!")
        }
      })
    })
  }



  //Load firstdata -----------------------------------------------------

  useEffect(() => {
      setPageLoaded(0);
      LoadFirstData();
  }, [ refreshing ])

  const LoadFirstData = () => {
    setPageLoaded(0);
    if ( pageloaded == 0 ) FetchComment();
    else { 
      setRefreshing(false)
    }
  }

  const FetchComment = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/comment/" + route.params.postId + "?page=" + (pageloaded + 1) + "&order=ASC", {
        method:"GET",
        headers:{
          "Authorization" : "Bearer " + accessToken,
        },
      })
      .then(res => res.json())
      .then(res => {
        if (res.count) {
          setTotalPage(res.pagination.totalPages)
          setPostCount(res.count)
          setDataLoaded([])
          setDataLoaded(res.posts)
          setPageLoaded((pageloaded + 1))//2
          setFirstLoad(true)
          setRefreshing(false)
        }
        else {     
          setDataLoaded([])
          setFirstLoad(true)
          setRefreshing(false)}
      })
    })
  }

  // load more data---------------------------------------
  useEffect(() => {
      fetchMoreData();
  }, [ isLoading ]);

  const fetchMoreData = ()=> {
    if (pageloaded < totalPage && DataLoaded.length < postCount) {
      getToken("accessToken").then(accessToken => {
        fetch( BACKEND + "/comment/" + route.params.postId + "?page=" + (pageloaded + 1) + "&order=ASC", {
          method:"GET",
          headers:{
            "Authorization" : "Bearer " + accessToken,
          },
        })
        .then(res => res.json())
        .then(res => {
          setDataLoaded(DataLoaded.concat(res.posts))
          setPageLoaded(pageloaded +1)
          setIsLoading(false)
          setRefreshing(false)
        })
      })
    }
  }

  const Action = (v, commenterId, commentId) => {
    if ( v == 2 ) toCommentUserProfile(commenterId) 
    else if ( v == 1) {
      if ( UserData.id == route.params.posterId ) {
        RemoveByPoster(commentId)
        setRefreshing(true)
      }
      else if ( UserData.id == commenterId) {
        RemoveByCommenter(commentId)
        setRefreshing(true)
      }
    }
  }

  const CommentList = (item)=> {
    const comment = item.item
    return(
      <View > 
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <TouchableOpacity style={{paddingHorizontal:15,marginVertical:10, flexDirection:"row", alignItems:"center", width:"85%"}} onPress= {()=> toCommentUserProfile(comment.userId)}>
            { !comment.user.avatar ?
              <View style={{ backgroundColor:color.lightgray, height:30, width:30, borderRadius:width*0.1, justifyContent:"center", alignItems:"center"}} >
                <AntDesign name="user" size={15} color="white" />
              </View>
              :
              // <Image style={{width:30, height:30, borderRadius:40}} uri={comment.user.avatar } />
              <FastImage 
                style={{width:30, height:30, borderRadius:40}} 
                source={{ uri: comment.user.avatar, priority: FastImage.priority.high}}    
              />
            }
            <View style={{marginLeft:10}}></View>
            <Typography.Sub1  color={color.black} style={{ flex:1}}> {comment.user.name}</Typography.Sub1>
            <Text style={{color:color.gray, marginLeft:15, fontSize:11}}>{getTimeDif(comment.createdAt)}</Text>

          </TouchableOpacity>
          <View style={{ width:"15%", alignItems:"flex-end", paddingRight:10 }}>
            <Menu onSelect={value => Action(value, comment.userId, comment.id )}>
              <MenuTrigger>
                <View style={{padding:10}}>
                  <Ionicons color={color.black}  size={15} name="ellipsis-vertical-outline" />
                </View>
              </MenuTrigger>
              <MenuOptions>
                {(UserData.id == comment.userId || UserData.id == comment.posterId) ? 
                  <MenuOption value={1}>
                    <Text style={{color: 'red', margin:10}}>Delete</Text>
                  </MenuOption>:
                  <MenuOption value={2}>
                    <Text style={{ margin:10, color:color.black}}>See user</Text>
                  </MenuOption>
                }
              </MenuOptions>
            </Menu>
          </View>
        </View>
        <Text style={{marginHorizontal:25, marginBottom:10, color:color.black}}>{comment.content}</Text>
        <View style={styles.Hline}/>  
      </View>
    )
  }

  const RemoveByPoster = (commentId) => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/comment/poster/" + UserData.id, {
        method:"DELETE",
        headers:{
          "Authorization" : "Bearer " + accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          commentId : commentId
        })
      })
      .then( res => {
        if (res.status === 201 || res.status === 200) {
          // console.log("A_A")
        }
        else Alert.alert("Some error happened!")
      })
    })
  }

  const RemoveByCommenter = (commentId) => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/comment/" + UserData.id, {
        method:"DELETE",
        headers:{
          "Authorization" : "Bearer " + accessToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          commentId : commentId
        })
      })
      .then( res => {
        if (res.status === 201 || res.status === 200) {
          // console.log("A_A")
        }
        else Alert.alert("Some error happened!")
      })
    })
  }

  // navigation
  const toCommentUserProfile = (userId) => {
    getToken("accessToken").then(accessToken => {
      // console.log("A_A")
      fetch( BACKEND + "/follow/check/" + UserData.id , {
        method:"POST",
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken,
        },
        body:JSON.stringify({
          userIdFollowed : userId
        })
      })
      .then(res => res.json())
      .then(res => {
          navigation.push( routeName + "UserProfile", {userId:userId, isFollowing: res.isFollowing })
        }
      )
    })
  }


  // console.log("------------------------------------------")
  // // console.log(collection)
  
  // console.log("totalPage: " + totalPage)
  // console.log("PageLoaded: " + pageloaded)
  // console.log("postcount: " + postCount)
  // console.log("DataLoaded.length:" + DataLoaded.length)
  // // console.log(DataLoaded)
  // // console.log(savedPost)
  // // console.log(UserData)
  // // console.log(props.route)
  // // console.log(useSelector(state=>state.collections.collection))
  // // console.log(props)
  // console.log(refreshing)
  // console.log("params:")
  // console.log(route.params)

  // console.log("------------------------------------------")



  return (
    <View style={{ flex:1, backgroundColor:"white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <FlatList
          data={DataLoaded}
          keyExtractor={(item, index) => index}
          horizontal={false}
          numColumns={1}
          renderItem={CommentList}
          onEndReachedThreshold={0.001}
          onEndReached={()=> setIsLoading(true)}
          refreshControl = {
            <RefreshControl
              onRefresh={()=> setRefreshing(true)}
              refreshing={refreshing}
            />
          }
        />
        <View style={styles.Hline} />
        <View style={{paddingVertical:10, flexDirection:"row", alignItems:"center", paddingRight:10}}>
          <TextInput
            style={{width:"80%", paddingHorizontal:10, paddingVertical:15,color:color.black}}
            onChangeText={(text) => setComment(text)}
            value={comment}
            multiline
            numberOfLines={4}
            placeholderTextColor={color.gray}
            placeholder="Comment..."
          />
          <TouchableOpacity style={{width:"20%", backgroundColor:color.darkBrown, borderRadius:8, justifyContent:"center", alignItems:"center", paddingVertical:10}} onPress={() => AddComment()}>
            <Text style={{color:"white"}}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop:10,
    width:"100%"
  },
  collection:{
    width:width*0.4, 
    height: width*0.4, 
    marginVertical: 12, 
    marginLeft: '3%',
    marginRight: '3%', 
    borderRadius:12, 
    alignItems:"center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  textCollection:{
    width:width*0.4, 
    height: width*0.4*0.5, 
    marginVertical: 12, 
    marginLeft: '3%',
    marginRight: '3%', 
    borderRadius:12, 
    alignItems:"center",
    justifyContent:"center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor:color.darkBrown,
  },
  Modalheader:{
    flexDirection:"row",
    width:"100%",
  },
  Hline :{
    width: "100%",
    margin: 0,
    height: 1,
    backgroundColor: "#e6e6e6",
  },
  flashText:{
    fontSize:20, 
    padding:15, 
    color:"white",
    backgroundColor:color.darkBrown, 
    marginBottom:20, 
    position:'absolute', 
    // // top:Constants.statusBarHeight, 
    alignSelf:"center",
    justifyContent:"center",
    overflow:"hidden",
    borderRadius:20
  }
});

export {SharedComments};
