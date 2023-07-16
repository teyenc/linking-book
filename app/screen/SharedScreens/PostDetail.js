import React, { useState, useEffect } from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert, Modal, Pressable, TextInput, ActivityIndicator, RefreshControl, Platform, KeyboardAvoidingView } from "react-native";

//import components
import { Description, Visit, PostDetailCpnt} from "../../components/InPageCpnt/PostDetailCpnt";
import { MyPostsSetting, ReportModal, SaveModal } from "../../components/Blocks/Modals";

// config and assets
import color from "../../config/color";
import * as Typography from "../../config/Typography";
import { BACKEND } from "../../config/config";

//library
import { useDispatch, useSelector } from "react-redux";
import extractDomain from "extract-domain";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import FastImage from 'react-native-fast-image'

//icon
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";



// import redux  && helpers
import { getTimeDif, GET, getToken, getData, followFunction, unfollowFunction, storeData, youtube_parser, openLink} from "../../helpers/functions";
import { ColtModal, deleted, like_post, refreshCollection, setFolAct } from "../../store/actions";
import { useDltPost, useGetPost } from "../../helpers/ApiFunctions";
import { showMessage } from "react-native-flash-message";

const { width, height } = Dimensions.get("window");
 

const SharedPostDetail = ({ route, navigation }) => {

  const PostData = route.params.postData
  const postId =  route.name == "SavedPostDetail" ? PostData.postId: PostData.id

  const UserData = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const deletedPostId = [ ...useSelector(state => state.postCard.deleted)]

  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : -150;

  // save 
  const [ showModal, setShowModal] = useState(false);
  const [ savedPost, setSavedPost] = useState(false)

  // post data  
  const [ avatar, setAvatar] = useState(PostData.userAvatar);
  const [ posterId, setPosterId] = useState(PostData.userId)
  const [ posterName, setPosterName] = useState(PostData.userName);
  const [ createdTime, setCreatedTime] = useState(PostData.createdAt);
  const [ imageLink, setImageLink] = useState(PostData.imageLink? PostData.imageLink : "");
  const [ link, setLink] = useState(PostData.link ? PostData.link:"");
  const [ title, setTitle] = useState(PostData.title?PostData.title:"");
  const [ content, setContent] = useState(PostData.content? PostData.content:"");
  const [ tags, setTags] = useState(PostData.tags? PostData.tags : []);
  const [ imgPreview, setImgPreview] = useState(route.params.imgPreview ? route.params.imgPreview:"")
  const domain = extractDomain(link?link : "")


  const [ isLike, setIsLike] =useState(false)
  const [ like_count, setLike_count] =useState(PostData.like_count)
  const [ isChecking, setIsChecking ] =useState(true)
  const [ showPostSettings, setShowPostSettings ] = useState(false)
  
  //comments
  // refresh && load 
  const [ refreshing, setRefreshing ] = useState(route.params.notification? true:false);
  const [ isLoading, setIsLoading] = useState(false)

  // notification 

  // load comments data 
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
          postId: postId,
          posterId:posterId // not necessary 
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

  //Load firstdata 
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
      fetch( BACKEND + "/comment/" + postId + "?page=" + (pageloaded + 1) + "&order=ASC", {
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
          setRefreshing(false)
        }
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
        fetch( BACKEND + "/comment/" + postId + "?page=" + (pageloaded + 1) + "&order=ASC", {
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
        <View style={{ width: "100%", height: 1, backgroundColor: "#e6e6e6",}}/>  
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <TouchableOpacity style={{paddingHorizontal:15,marginVertical:10, flexDirection:"row", alignItems:"center", width:"85%"}} onPress= {()=> toCommentUserProfile(comment.userId)}>
            { !comment.user.avatar ?
              <View style={{ backgroundColor:color.lightgray, height:30, width:30, borderRadius:width*0.1, justifyContent:"center", alignItems:"center"}} >
                <AntDesign name="user" size={15} color="white" />
              </View>
              :
              // <Cache.Image style={{width:30, height:30, borderRadius:40}} uri={comment.user.avatar } />
              <FastImage 
                style={{width:30, height:30, borderRadius:40}} 
                source={{ uri: comment.user.avatar, priority: FastImage.priority.high}}    
              />
              
            }
            <View style={{marginLeft:10}}></View>
            <Typography.Sub1 color={color.black}  style={{ flex:1}}> {comment.user.name}</Typography.Sub1>
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


  //follow
  const [ isFollowing, setIsFollowing ] = useState(false)
  const [ isLoadingFol, setIsLoadingFol ] = useState(false)

  // console.log(PostData)

  // API 
  const [ post, setPost ] = useGetPost(postId);
  const [ dltPost, setDltPost ] = useDltPost(PostData.id);

  useEffect(() => {
    if (post.status) {
      if (post.status == 200 || post.status ==201 ) {
        const data = post.response.post
        if (data.imgPreviewLink) setImgPreview(data.imgPreviewLink? data.imgPreviewLink: "")
        if (data.link !== link) setLink(data.link)
        if (data.imageLink) setImageLink(data.imageLink)
        setLike_count(data.like_count)
        setPosterId(data.userId)
        setCreatedTime(data.createdAt)
        setAvatar(data.userAvatar)
        setPosterName(data.userName)
        setTitle(data.title)
        setContent(data.content)
        setTags(data.tags)
        post.status = null
      }
      if (post.status === 404) navigation.goBack()
    }
    if (dltPost.status) {
      if (dltPost.status === 200 || dltPost.status === 201 ) {
        dispatch(deleted(deletedPostId.concat(PostData.id)))
        showMessage({message: "Deleted!"})
        navigation.goBack()
        dltPost.status = null
      }
      else Alert.alert("Some error happened!")
    }
    if (route.params.isUpdated) {
      setRefreshing(true)
      route.params.isUpdated = null
    }
  }, [post, dltPost, route.params])



  useEffect(() => {
    dispatch(deleted(deletedPostId.concat(1)))
    if (refreshing) {
      setPost()
      setRefreshing(false)
    }
  }, [refreshing])

  // save Post-------------------------------
  // different!!!!
  const heartOnPress = (postId) => {
    getData("LocalCollections").then( col => {
      dispatch(refreshCollection(JSON.parse(col)))
    })
    setSavedPost(postId)
    dispatch(ColtModal(true))
  }

  // follow----------------------------------------------

  const follow = () => {
    setIsLoadingFol(true)
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/follow/" + UserData.id , followFunction(JSON.stringify(posterId), accessToken ))
      .then(res => {
        setIsLoadingFol(false)
        if (res.status === 200 || res.status === 201){
          res.json().then( r => {
            const data = JSON.parse("[" + r.user_following+ "]")
            dispatch(setFolAct(data))
            storeData("storedFollowingIds", r.user_following) 
          })
        }
      })
    })
  }

  const unfollow = () => {
    setIsLoadingFol(true)
    getToken("accessToken").then(accessToken => {
    fetch( BACKEND + "/follow/" + UserData.id , unfollowFunction(JSON.stringify(posterId), accessToken ))
    .then(res => {
      setIsLoadingFol(false)
      if (res.status === 200 || res.status === 201){
        res.json().then( r => {
          const data = JSON.parse("[" + r.user_following+ "]")
          dispatch(setFolAct(data))
          storeData("storedFollowingIds", r.user_following) 
        })
      }
    })
    })
  }

  // navigation 
  const [ routeName, setRouteNmae ] = useState("")
  useEffect (() => {
    let name = route.name.charAt(0)
    if ( name == "E" ) { setRouteNmae("Explore")} 
    else if ( name == "S" ) { setRouteNmae("Saved")} 
    else if ( name == "H" ) { setRouteNmae("Home")} 
    else if ( name == "A" ) { setRouteNmae("Account")}
  }, [])

  // console.log(route.name.charAt(0))
  const toUserProfile = () => {
    navigation.push( routeName + "UserProfile", { userId:posterId, isFollowing: isFollowing })
  }

  //edit post
  const clickEdit = () => {
    const data = {
      content:content,
      id: postId,
      tags:tags,
      link:link,
      title:title,
      imageLink: imageLink
    }
    setShowPostSettings(false)
    navigation.navigate(routeName + "EditPage", {postData: data})
  }

  // delete post
  const DeletePost = () => {
    setShowPostSettings(false)
    setDltPost()
  }

  // delete
  const DeleteAlert = () => {
    Alert.alert("Delete", "Do you want to delete the post?", [
      { text: "No", onPress: () => setShowPostSettings(false)  },
      { text: "Yes", onPress: () => DeletePost()},
    ]);
  };

  //like--------------------------------------
  useEffect (() => {
    checkLike()
  }, [])

  const like = () => {
    setIsLike(true)
    setLike_count(like_count+1)
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/like" , {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify({
          "postId": postId
        })
      })
    })
  }

  const checkLike = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/like/check/" + postId , GET(accessToken))
      .then( res => {
        setIsChecking(false)
        if (res.status === 201 || res.status ===200 ) {
          res.json().then(r => {
            setIsLike(r.isLike)
          })
        }
      })
    })
  }

  const redux_like  = useSelector(state => state.postCard.like_post)

  useEffect(() => {
    const item = { postId: postId, like_count:like_count }
    if (!redux_like?.length) {
      let data = [...redux_like]
      data = data.filter(remain => remain.postId == postId)
      if (!data) { 
        dispatch(like_post(redux_like.concat(item)))
      }
      else {
        let dataToChange = [...redux_like]
        dataToChange = dataToChange.filter(remain => remain.postId !== postId)
        dispatch(like_post(dataToChange.concat(item)))
      }
    } 
    else {
      dispatch(like_post([item]))
    }
  }, [ like_count ])

  const unlike = () => {
    setIsLike(false)
    setLike_count(like_count-1)
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/like/unlike" , {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken
        },
        body: JSON.stringify({
          "postId": postId
        })
      })
      .then(res => {
        if (res.status === 201 || res.status ===200 ) {
          setIsLike(res.isLike)
        }
      })
    })
  }


  const pressLike = () => {
    if (isLike) unlike()
    else like() 
  }

  const folActId = useSelector(state => state.folAct.folAct)
  const isFol = ((folActId.filter(res => res == posterId)).length) !== 0

  const dotsOnPress = () => {
    if (UserData.id == posterId) setShowPostSettings(true) 
    else setShowModal(true)
  }

  const report = () => {
    setShowModal(false) 
    navigation.push("Report", {postId: PostData.id})
  }

  const PostCpnt = () => {
    return(
      <PostDetailCpnt
        toUserProfile={() => toUserProfile()}
        avatar={avatar}
        posterName={posterName} 
        PostData ={PostData}
        isLoadingFol={isLoadingFol} 
        link ={link}
        like_count ={like_count}
        isChecking ={isChecking}
        isLike ={isLike}
        title ={title}
        saveOnPress ={() => heartOnPress(postId)}
        pressLike ={() => pressLike()}
        content ={content}
        tags ={tags}
        isFol ={isFol}
        unfollow ={() => unfollow()}
        follow ={() => follow()}
        dotsOnPress ={() => dotsOnPress()}
        PressLink ={() => openLink(link)}
        imgPreview ={imgPreview}
        domain ={domain}
        imageLink={imageLink}
        createdTime={createdTime}
        posterId={posterId}
      /> 
    )
  }
 
  return (
    <View style={{ flex:1, backgroundColor:"white" }}>
      <SaveModal postId={savedPost} />         
      <ReportModal visible = {showModal} onPressReport={()=> report()} onPressCancel={()=> setShowModal(false)}  />
      <MyPostsSetting
        visible={showPostSettings} 
        DeleteOnPress = {()=> DeleteAlert()} 
        BackGroundOnPress = {() => setShowPostSettings(false)} 
        CancelOnPress ={() => setShowPostSettings(false)} 
        EditOnPress ={() => clickEdit()}
      />
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
          ListHeaderComponent={
            <PostCpnt/>
          }
        />
        <View style={{ width: "100%", height: 1, backgroundColor: "#e6e6e6",}} />
        <View style={{paddingVertical:10, flexDirection:"row", alignItems:"center", paddingRight:10, maxHeight:70}}>
          <TextInput
            style={{width:"80%", paddingHorizontal:10, paddingVertical:15, color:color.black}}
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
};

export {SharedPostDetail};
