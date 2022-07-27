import React, { useEffect, useState } from "react";
import { StyleSheet,View, Dimensions, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';

//import components
import { BlockModal, SaveModal } from "../../components/Blocks/Modals";
import { UserInfo } from "../../components/InPageCpnt/UserProfileCpnt";
import * as Card from "../../components/Blocks/Card"
  
//import styles and assets
import color from "../../config/color";

// import congif
import { BACKEND } from "../../config/config";

// redux && helpers
import { useDispatch, useSelector } from "react-redux";
import { ColtModal, setFolAct, refreshCollection, setBlock} from '../../store/actions';
import { unfollowFunction, followFunction, GET, getData, storeData, getToken } from "../../helpers/functions";
import Header from "../../components/Bars&Header/Header";


const { width, height } = Dimensions.get("window");


const SharedUserProfile = ({ route, navigation }) => {

  const UserData = useSelector(state => state.auth)
  const dispatch = useDispatch();

  const [profileUserId, setProfileUserId] = useState(route.params.userId)
  const [posterAvatar, setPosterAvatar] = useState("")
  const [posterName, setPosterName] = useState("")
  const [posterTitle, setPosterTitle] = useState("")
  const [posterJob, setPosterJob] = useState("")
  const [posterDescription, setPosterDescription] = useState("")
  const [posterEducation, setPosterEducation] = useState("")

  // follow
  const [ isFollowing, setIsFollowing ] = useState(false)
  const [ isGetData, setIsGetData ] = useState(false)
  const [ isLoadingFol, setIsLoadingFol ] = useState(false)

  // block
  const blockId = useSelector(state => state.folAct.blockId)
  const [ showBlock, setShowBlock ] = useState(false)
  const [ isBlocked, setIsBlock ] =useState(false)

  useEffect(() => {
    const bId = blockId.filter( Ids => Ids == parseInt(profileUserId))
    const blk = bId.length > 0 ? true : false
    setIsBlock(blk)
  },[])


  // load data 
  const [ firstLoad, setFirstLoad ] = useState(false)
  const [ DataLoaded, setDataLoaded ] = useState([])
  const [ postCount, setPostCount ] = useState(0);
  const [ totalPage, setTotalPage ] = useState(0)
  const [ pageloaded, setPageLoaded ] =useState(0) 
  
  // svae posts 
  const [ savedPost, setSavedPost] = useState("");

  // refresh && load 
  const [ refreshing, setRefreshing ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false)

 

  // navigation 
  const [ routeName, setRouteNmae ] = useState("")
  useEffect (() => {
    let name = route.name.charAt(0)
    if ( name == "E" ) { setRouteNmae("Explore")} 
    else if ( name == "S" ) { setRouteNmae("Saved")} 
    else if ( name == "H" ) { setRouteNmae("Home")} 
    else if ( name == "A" ) { setRouteNmae("Account")}
  }, [])

  // set follower/ following function  -------------
  // follow -------------------------------------

  const [ followersN, setFollowersN ] = useState("") 
  const [ followingsN, setFollowingsN ] = useState("") 
  
  const setFollow = ( N, router ) => {
    if (!N ){
      if ( router == "following") {setFollowingsN("0")}
      if ( router == "followers") {setFollowersN("0")}
    }
    if (N) {
      if ( router == "following") {setFollowingsN(N)}
      if ( router == "followers") {setFollowersN(N)}
    }
  }

  //get poster data -----------------------------------------
  const setProfileData = (res) => {
    setPosterAvatar(res.profile.avatar)
    setPosterName(res.profile.name)
    setPosterTitle(res.profile.title)
    setPosterJob(res.profile.job)
    setPosterDescription(res.profile.description)
    setPosterEducation(res.profile.education)
    setFollow( res.following, "following" )
    setFollow( res.followed, "followers" )
    setIsFollowing(res.isFollowing)
    setIsGetData(true)
    setRefreshing(false)
  }

  const fetchPosterData = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/user/userProfile/" + profileUserId , GET(accessToken))
      .then(res => res.json())
      .then(res => {
        setProfileData(res)
      })
    })
  }
  

  // start  notthing to do with post
  useEffect(() => {
    setFirstLoad(false);
    setPageLoaded(0);
    fetchPosterData()
    LoadFirstData();
  }, [ refreshing ])
  
  //Load firstdata && refresh-----------------------------------------------------

  const LoadFirstData = () => {
    setPageLoaded(0)
    if ( pageloaded == 0 ) FetchPosts()
    else setRefreshing(false)
  }

  const FetchPosts = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/posts?page=" + (pageloaded + 1) + "&authorIds=" +  profileUserId , GET(accessToken))
      .then(res => res.json())
      .then(res => {
        setFirstLoad(true)
        setTotalPage(res.pagination.totalPages)
        setPostCount(res.count)
        if (!isBlocked) setDataLoaded([])
        setDataLoaded(res.posts)//
        setPageLoaded((pageloaded + 1))//2
      })
    })
  }

  // load more data---------------------------------------
  useEffect(() => {
    if (pageloaded < totalPage) {
      getToken("accessToken").then(accessToken => {
        fetch( BACKEND + "/posts?page=" + (pageloaded + 1) + "&authorIds=" +  profileUserId , GET(accessToken))
        .then(res => res.json())
        .then(res => {
          if (!isBlocked)setDataLoaded(DataLoaded.concat(res.posts))
          setPageLoaded(pageloaded +1)
          setIsLoading(false)
          setRefreshing(false)
        })
      })
    }
  }, [ isLoading ]);


  // save posts----------------------------------------  
  const heartOnPress = (item) => {
    getData("LocalCollections").then( col => {
      dispatch(refreshCollection(JSON.parse(col)))
    })
    dispatch(ColtModal(true))
    setSavedPost(item.id)
  }

  const follow = () => {
    setIsLoadingFol(true)
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/follow/" + UserData.id , followFunction((profileUserId), accessToken ))
      .then(res => {
        setIsLoadingFol(false)
        console.log(res.status)
        if (res.status === 200 || res.status === 201){
          setIsFollowing(true)
          setRefreshing(true)
          res.json().then( r => {
            const data = JSON.parse("[" + r.user_following+ "]")
            dispatch(setFolAct(data))
            storeData("storedFollowingIds", r.user_following) 
          })
        }
        else {
          res.json().then(res => {
            console.log(res)
          })
        }
      })
    })
  }

  const unfollow = ( ) => {
    setIsLoadingFol(true)
    getToken("accessToken").then(accessToken => {
    fetch( BACKEND + "/follow/" + UserData.id , unfollowFunction((profileUserId), accessToken ))
    .then(res => {
      setIsLoadingFol(false)
      console.log(res.status)
      if (res.status === 200 || res.status === 201){
        setIsFollowing(false)
        setRefreshing(true)
        res.json().then( r => {
          const data = JSON.parse("[" + r.user_following+ "]")
          dispatch(setFolAct(data))
          storeData("storedFollowingIds", r.user_following) 
        })
      }
      else {
        res.json().then(res => {
          console.log(res)
        })
      }
    })
    })
  }

  useEffect(() => {
    getData("blockIds").then(r => {
      const data = JSON.parse("[" + r+ "]")
      dispatch(setBlock(data))
    })
  }, [])

  // console.log(blockId)

  const block = () => {
    getToken("accessToken").then(accessToken => {
      fetch(BACKEND + "/users/block" , {
        method:"POST",
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken,
        },
        body:JSON.stringify({
          blockedId : profileUserId
        })
      })
      .then(res => {
        if (res.status === 200 || res.status === 201 ) {
          res.json().then(r => {
            const data = JSON.parse("[" + r.blockingIds+ "]")
            dispatch(setBlock(data))
            storeData("blockIds", r.blockingIds)
            setIsBlock(true)
            setShowBlock(false)
            Alert.alert(posterName+  " Blocked")
          })
        }
        else {
          Alert.alert("Sorry Please try again!")
        }
      })
    })
  }

  const unblock = () => {
    getToken("accessToken").then(accessToken => {
      fetch(BACKEND + "/users/unblock" , {
        method:"DELETE",
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization" : "Bearer " + accessToken,
        },
        body:JSON.stringify({
          blockedId : profileUserId
        })
      })
      .then(res => {
        // console.log(res.status)
        if (res.status === 200 || res.status === 201 ) {
          res.json().then(r => {
            const data = JSON.parse("[" + r.blockingIds+ "]")
            dispatch(setBlock(data))
            storeData("blockIds", r.blockingIds)
            setIsBlock(false)
            setShowBlock(false)
            Alert.alert(posterName + " unBlocked")
          })
        }
        else Alert.alert("Sorry Please try again!")
      })
    })
  }

  const onPressBlock = ( ) => {
    if (isBlocked) unblock()
    else block()
  }
  

  return (
    <View style={{flex:1, backgroundColor:"white"}}>
      {/* save modal  */}
      <SaveModal postId={savedPost} /> 
      <BlockModal
        visible = {showBlock}
        onPressReport = {()=> console.log("report")}
        onPressBlock  = {()=> onPressBlock()}
        onPressCancel  = {() => setShowBlock(false)}
        isBlocked = {isBlocked}
      /> 
      <Header
        icon="chevron-left" 
        iconRight="ellipsis-vertical"
        onPressLeft={() => navigation.goBack()} 
        onPressRight={()=> setShowBlock(true)}
      />
      {/* main Page  */}
      <FlatList
        ListHeaderComponent={
          <UserInfo
            isBlocked={isBlocked}
            avatar = {posterAvatar}
            name  = {posterName }
            title  = { posterTitle}
            posterJob = {posterJob} 
            posterDescription = {posterDescription}
            posterEducation = {posterEducation}
            isFollowing = { isFollowing}
            userId = {UserData.id}
            othersId  = {profileUserId}
            unfollow = {() => unfollow()}
            follow= {() => follow()}
            NavigationFollowers = { ()=> navigation.push( routeName + "UserList", { previousPage: "HomeUserProfile", theUserId: profileUserId, type:"followers" })}
            NavigationFollowing = {()=> navigation.push(routeName + "UserList", { previousPage: "HomeUserProfile", theUserId: profileUserId, type:"following" }) }
            NavigationCollection = {() => navigation.push( routeName+ "Collection", profileUserId) }
            followersN = {followersN}
            followingsN = {followingsN}
            isGetData = {isGetData}
            isLoadingFol={isLoadingFol}
          />
        }
        style={{width:"100%"}}
        data={ isBlocked?  [] : DataLoaded}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        renderItem={({item }) => (
          <Card.NormalCards
            nextRoute={routeName+ "PostDetail"}
            item={item} 
            heartOnPress={() => heartOnPress(item)} 
            onPress={() => navigation.push(routeName+ "PostDetail", item)}
            onPressPoster={() => navigation.push(routeName+ "UserProfile", item)}
        />
        )}
        onEndReachedThreshold={0.4}
        onEndReached={()=> setIsLoading(true)}
        refreshControl = {
          <RefreshControl
            onRefresh={()=> setRefreshing(true)}
            refreshing={refreshing}
          />
        }
        ListFooterComponent = {
          <View>
            { (isLoading == true && pageloaded < totalPage) ? <ActivityIndicator size="large" color={color.darkBrown} /> : null}
          </View>
        }
      />
    </View>
  );
};


export {SharedUserProfile};
