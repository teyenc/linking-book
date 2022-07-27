import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, Image, Modal, TextInput, Pressable, RefreshControl, ActivityIndicator, Alert, Switch} from 'react-native';

//import component
import { AddButtom, HomePageFooter } from '../../components/InPageCpnt/HomePage';
import * as Card from "../../components/Blocks/Card"
import { SaveModal } from '../../components/Blocks/Modals';

// library
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useScrollToTop } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';
import { showMessage } from "react-native-flash-message";
import { notificationListener, requestUserPermission } from '../../util/notificationService';
import messaging from '@react-native-firebase/messaging';

// config && assest 
import color from '../../config/color';
import { BACKEND } from '../../config/config';
import { Common, ModalStyle } from '../../styles';

// helpers
import { GET, getData, getToken, storeData } from '../../helpers/functions';// save

// redux
import { ColtModal, setFolAct} from '../../store/actions';
import { refreshCollection} from '../../store/actions';
import { useGetCollection } from "../../helpers/ApiFunctions"
import { useDispatch, useSelector } from "react-redux";

const { width, height } = Dimensions.get("window");
 
const HomePage = ({ route, navigation }) => {

  // notification
  // const notificationNavigator = (data) => {
  //   if (data.type === "postDetail" || data.type === "comment" ) {
  //     if (data.postId) navigation.navigate("HomePostDetail", {postData : {id:data.postId}, notification: true})
  //   }
  //   if (data.type === "userProfile") {
  //     if (data.userId) navigation.navigate("HomeUserProfile", {userId: data.userId})
  //   }
  // }

  // React.useEffect(() => {
  //   messaging().onNotificationOpenedApp( remoteMessage => {
  //     console.log(
  //       "notification caaused app to open from the background state: ", remoteMessage
  //     )
  //     notificationNavigator(remoteMessage.data)
  //     console.log(remoteMessage.data)
  //   })

  //   messaging().onMessage(async remoteMessage => {
  //         console.log("received in foreground", remoteMessage)
  //   })

  //   messaging()
  //   .getInitialNotification()
  //   .then(remoteMessage => {
  //     if (remoteMessage) {
  //       console.log(
  //         "notification caused app to open from quit state",
  //         remoteMessage
  //       )
  //       notificationNavigator(remoteMessage.data)
  //     }
  //   })
  // }, [])



  useEffect(() => {
    const get = async () => {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          getData("fcmToken").then( r => {
              getToken("accessToken").then(accessToken => {
                fetch( BACKEND + "/users/fcmToken", {
                  method:"PUT",
                  headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization" : "Bearer " + accessToken,
                  },
                  body:JSON.stringify({
                    fcmToken : fcmToken
                  })
                })
                .then(res => {
                  if (res.status === 200) console.log("upload good!")
                })
              })
              storeData("fcmToken", fcmToken)
          })
        } 
      } catch (r) {console.log(r)}
    }
    get()
  }, [])


  useEffect(() => {
    getData("LandingType").then(r => {
      if (r) {
        if (r === "SignUp") openAlert("Welcome!")
        else if (r === "Login") openAlert("Welcome Back!")
      }
    })
  }, [])

  const openAlert = (msg) => {
    storeData("LandingType", "N")
    Alert.alert( msg, "", [
      { text: "Ok", onPress: () => clickOk() },
    ]);
  }

  const clickOk = () => {
    storeData("LandingType", "N")
    requestUserPermission()
  }

  const data = useSelector(state => state.auth)
  const UserData = {...data}

  const dispatch = useDispatch();

  // load data 
  const [ firstLoad, setFirstLoad ] = useState(false)
  const [ DataLoaded, setDataLoaded ] = useState([])
  const [ postCount, setPostCount ] = useState(0);
  const [ totalPage, setTotalPage ] = useState(0)
  const [ pageloaded, setPageLoaded ] =useState(0) 
  
  // svae posts 
  const [ savedPost, setSavedPost ] = useState("");

  // refresh && load 
  const [ userFollowing, setUserFollowing ] = useState("");
  const [ refreshing, setRefreshing ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false)
  const [ type, setType ] = useState("")

  // API 
  const [ colt, setColt ] = useGetCollection(UserData.id);

  // API functions

  useEffect(() => {
    if (colt.status) {
      if (colt.status === 200 || colt.status === 201 ) {
        dispatch(refreshCollection(colt.response.collections))
        const coltStoring = JSON.stringify(colt.response.collections)
        storeData("LocalCollections",coltStoring )
        colt.status = null
      }
    }
  }, [colt])  

  useEffect(() => {
    setColt()
  },[])


  // scroll view scroll to top --------------------------
  const scrollRef = useRef(); 
  useScrollToTop(scrollRef);

  const toTop = () => {
    if (firstLoad && position !== 0 && DataLoaded.length) {
      scrollRef.current.scrollToIndex({index: 0});
    }
  };

  const [ position, setPosition ] = useState(0)
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    setPosition(scrollPosition)
  };

  //Load firstdata && refresh

  let load = false
  let refresh = false

  useEffect(() => {
    getData("storedFollowingIds").then( r => {
      if (r) {
        const data = JSON.parse("["+ r+ "]")
        dispatch(setFolAct(data))
      }
    })
    setPageLoaded(0)
    getData("HomePageType").then(r => {
      if (r === "1" || !r) { // all post
        setType("All posts")
        setPageLoaded(0);
        if ( UserData.id && pageloaded === 0 ) {
          FetchPosts("")
        }
        else setRefreshing(false)
      }
      else if ( r === "2" ) {
        setType("Home")
        getData("storedFollowingIds").then(res => {
          setPageLoaded(0);
          if (UserData.id && pageloaded === 0) {
            if (res) {
              setUserFollowing(res)
              FetchPosts(res)
            }
            else {
              setDataLoaded([])
              setRefreshing(false)
              setFirstLoad(true)
            }
          }
          else setRefreshing(false)
        })
      }
    })
  }, [ 
    refreshing 
    // refresh
  ]);

  const setRefresh = (data) => {
    refresh = data
  }

  const FetchPosts = (authorIds) => {
    fetch( BACKEND + "/posts?page=1&authorIds=" + authorIds, GET())
    .then(res => {
      if ( res.status === 200) {
        res.json().then( res => {
          if (res.count) {
            setTotalPage(res.pagination.totalPages)
            setPostCount(res.count)
          }
          setDataLoaded([])
          setDataLoaded(res.posts)//
          setPageLoaded(1)
          storeData("HomeLoadingPage", "2") // means the next page will be loaded
          setFirstLoad(true)
          setRefreshing(false)
          setIsLoading(false)
        })
      }
      else {
        setRefreshing(false)
        setIsLoading(false)
      }
    })
  }

  // load more data---------------------------------------
  useEffect(() => {
    if ( !refreshing &&  0 < pageloaded < totalPage && isLoading ) {
      getData("HomeLoadingPage").then(pg => {
        getData("HomePageType").then(tp => {
          let Ids ;
          if ( tp == "1" || !tp) Ids = ""
          if ( tp == "2" ) Ids = userFollowing
          if ((JSON.parse(pg)-1 ) < totalPage) {
            fetch( BACKEND + "/posts?page=" + pg+ "&authorIds=" + Ids , GET())
            .then(res => res.json())
            .then(res => {
              if (res.posts) {
                const nextPg = JSON.stringify(JSON.parse(pg)+ 1)
                setDataLoaded(DataLoaded.concat(res.posts))
                storeData("HomeLoadingPage",nextPg ).then( r => {
                  setIsLoading(false)
                })
                setRefreshing(false)
                setPageLoaded(JSON.parse(pg))
              }
              else setIsLoading(false)
            })
          }
          else setIsLoading(false)
        })
      })
    }
  }, [ isLoading ]);

  // save posts----------------------------------------
  const heartOnPress = (item) => {
    getData("LocalCollections").then( col => {
      dispatch(refreshCollection(JSON.parse(col)))
    })
    setSavedPost(item.id)
    dispatch(ColtModal(true))
  }

  // ---------------------
  const Action = (v) => {
    setFirstLoad(false)
    if (v == 1) {
      setType("All posts")
      setRefreshing(true)
      storeData("HomePageType", "1")
    } 
    else if (v == 2) {
      setType("Home")
      setRefreshing(true)
      storeData("HomePageType", "2")
    }
  }

  // sho measaage and flash

  useEffect(() => {
    if (route.params) {
      if (route.params.isPosted) {
        if (route.params.isPosted ==  true) {
          showMessage("Posted!")
          setRefreshing(true)
        }
      }
    }
  }, [ route.params ])


  return (
    <View style={styles.container}>
      <View style={{paddingBottom:5, flexDirection:"row", alignItems:"center"}}>
        <Pressable style={{  width:"70%"}} onPress = { () => toTop()}>
          <Image  style ={{height:30,width:150, marginLeft:"5%", resizeMode:"contain"}} source={require('../../asset/text.png')}/> 
        </Pressable>
        <View style={{justifyContent:"center", width:"30%", alignItems:"center"}}>
          <Menu onSelect={value => Action(value)}>
            <MenuTrigger>
              <View style={{flexDirection:"row", alignItems:"center", paddingLeft:10, paddingRight:5 }}>
                <Text style={{marginRight:5, color:color.black}} >{type}</Text>
                <Ionicons name="chevron-down-outline" size={20} color={color.black}/>
              </View>
            </MenuTrigger>
            <MenuOptions>
                <MenuOption value={1}>
                  <Text style={{ margin:10, color:color.black}}>All Post</Text>
                </MenuOption>
                <MenuOption value={2}>
                  <Text style={{ margin:10, color:color.black}}>Home</Text>
                </MenuOption>
              </MenuOptions>
          </Menu>
        </View>
      </View>
      <View style={Common.Hline}/>
      
      {/* <CollectionModal/> */}
      <SaveModal postId={savedPost} /> 

      { firstLoad ? 
        <FlatList
          style={{width:"100%"}}
          ref={scrollRef}
          data={DataLoaded}
          onScroll={handleScroll}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => ( 
            <Card.NormalCards
              item={item} 
              heartOnPress={() => heartOnPress(item)}
              nextRoute={"HomePostDetail"}
              onPress={()=> navigation.push( "HomePostDetail", item)} 
              onPressPoster={() => navigation.push("HomeUserProfile", {userId: item.userId})}
            />
          )}
          onEndReachedThreshold={1}
          onEndReached={()=> setIsLoading(true)}
          refreshControl = {
            <RefreshControl
              onRefresh={()=> setRefreshing(true)}
              refreshing={refreshing}
            />
          }
          ListHeaderComponent={ <AddButtom 
            onPress = {() => navigation.navigate("Post")}
            ExploreOnPress = {() => navigation.navigate("Explore")}
            onPressAll = {() => Action(1)}
            DataLoaded={DataLoaded}
          />
          }
          ListFooterComponent = {
            <View>
              { (isLoading && pageloaded < totalPage) ? <ActivityIndicator size="large" color={color.darkBrown} /> : null}
              { (pageloaded >= totalPage && type == "Home" && DataLoaded.length > 0 ) ? 
                <HomePageFooter
                  // onPress = {() => navigation.navigate("Post")}
                  ExploreOnPress = {() => navigation.navigate("Explore")}
                  onPressAll = {() => Action(1)}
                />:
                null
              }
            </View>
          }
        />
      :
        <View style={{justifyContent:"center", height:"100%"}}>
          <ActivityIndicator size="large" color={color.darkBrown} />
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width:width, 
    // paddingTop: Constants.statusBarHeight,
    alignItems:"center", 
    backgroundColor:"white",
    paddingBottom:"10%",
  },
});

export default HomePage;

