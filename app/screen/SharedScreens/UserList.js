import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableOpacity, 
  View, 
  Dimensions, 
  FlatList, 
  RefreshControl
} from 'react-native';

// config && asset
import color from '../../config/color';
import { BACKEND } from '../../config/config';

// component 
import * as List from "../../components/Blocks/List"

// library 

//import redux 
import { useDispatch, useSelector } from 'react-redux';
import { GET, getToken } from '../../helpers/functions';


const {width, height} = Dimensions.get("window")
 
const SharedUserList = ({navigation, route}) =>  {
  const dispatch =  useDispatch()

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
  // const TokenData = useSelector(state => state.token)

  // refresh && load 
  const [ refreshing, setRefreshing ] = useState(false);
  const [ isLoading, setIsLoading] = useState(false)

  // load data 
  const [firstLoad, setFirstLoad] = useState(false)
  const [DataLoaded, setDataLoaded] = useState([])
  const [postCount, setPostCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0)
  const [pageloaded, setPageLoaded ] =useState(0)   

  //Load firstdata -----------------------------------------------------

  //token
  // token  

  useEffect(() => {
    //renewtoken()
    if (route.params.type == "followers"){
      setPageLoaded(0);
      const router = "followers/"
      LoadFirstData(router);
    }
    else if (route.params.type == "following"){
      setPageLoaded(0);
      const router =  "following/"
      LoadFirstData(router);
    }
    setIsLoading(false)
  }, [refreshing])

  const LoadFirstData = (router) => {
    setPageLoaded(0);
    if ( pageloaded == 0 ) {
      FetchUsers(router);
    }
    else { console.log("not refreshing !")}
    setRefreshing(false)
  }

  const FetchUsers = (router) => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/follow/" + router + route.params.theUserId + "?page=" + (pageloaded + 1), GET(accessToken))
      .then(res => res.json())
      .then(res => {
        // console.log(res)
        if (res.count) {
          setTotalPage(res.pagination.totalPages)
          setPostCount(res.count)
          setDataLoaded([])
          if (route.params.type == "followers"){
            setDataLoaded(res.followers)
          }
          if (route.params.type == "following"){
            setDataLoaded(res.followings)
          }
          setPageLoaded((pageloaded + 1))//2
          console.log("loaded!!")
          setFirstLoad(true)
        }
        else setFirstLoad(true)
      })
    })
  }

  // load more data---------------------------------------
  useEffect(() => {
    if (route.params.type == "followers"){
      const router = "followers/"
      fetchMoreData(router);
    }
    else if (route.params.type == "following"){
      const router =  "following/"
      fetchMoreData(router);
    }
  }, [isLoading]);

  const fetchMoreData = (router)=> {
    if (pageloaded < totalPage && DataLoaded.length < postCount) {
      getToken("accessToken").then(accessToken => {
        fetch( BACKEND + "/follow/" + router + route.params.theUserId + "?page=" + (pageloaded + 1), {
          method:"GET",
          headers:{
            "Authorization" : "Bearer " + accessToken,
          },
        })
        .then(res => res.json())
        .then(res => {
          if (route.params.type == "followers"){
            setDataLoaded(DataLoaded.concat(res.followers))
          }
          if (route.params.type == "following"){
            setDataLoaded(DataLoaded.concat(res.followings))
          }
          setPageLoaded(pageloaded +1)
          setIsLoading(false)
          setRefreshing(false)
        })
      })
    }
  }


  const OneUserList = (item)=> {
    return(
      <TouchableOpacity onPress = {() => toUserProfile(item.item.User.id)} > 
        <TouchableOpacity onPress = {() => toUserProfile(item.item.User.id)} style={{width:width, marginLeft:"10%"}}>
          <List.UserList1
            onPress = {() => toUserProfile(item.item.User.id)}
            title = {item.item.User.name} 
            secondary={item.item.User.title}
            image = {item.item.User.avatar} 
          />
        </TouchableOpacity>
        <View style={styles.Hline}/>  
      </TouchableOpacity>
      
    )
  }

  // navigation
  const toUserProfile = (userId) => {
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
    // <View style={styles.container}>
    <View style={{ flex:1, backgroundColor:"white", alignItems:"center" }}>
      <FlatList
        data={DataLoaded}
        keyExtractor={(item, index) => index}
        horizontal={false}
        numColumns={1}
        renderItem={OneUserList}
        onEndReachedThreshold={0.001}
        onEndReached={()=> setIsLoading(true)}
        refreshControl = {
          <RefreshControl
            onRefresh={()=> setRefreshing(true)}
            refreshing={refreshing}
          />
        }
      />
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
    // shadowOpacity: 0.12,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor:color.darkBrown,
  },
  Modalheader:{
    flexDirection:"row",
    // padding:20,
    // marginTop:10,
    width:"100%",
    // justifyContent:"space-between"
  },
  Hline :{
    width: "100%",
    margin: 0,
    height: 1,
    backgroundColor: "#e6e6e6",
  },
  flashText:{
    // width:"90%", 
    fontSize:20, 
    padding:15, 
    color:"white",
    backgroundColor:color.darkBrown, 
    marginBottom:20, 
    position:'absolute', 
    // top:Constants.statusBarHeight, 
    alignSelf:"center",
    justifyContent:"center",
    overflow:"hidden",
    borderRadius:20
  }
});

export {SharedUserList};
