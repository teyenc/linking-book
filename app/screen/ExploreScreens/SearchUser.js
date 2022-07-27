
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View , Dimensions, Image, FlatList, RefreshControl, ActivityIndicator} from 'react-native';

// import HomeStack from "./app/navigation/HomeStack";
// import  asset
import color from '../../config/color';
import * as Typography from '../../config/Typography';

import { BACKEND } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import component 
import RNUrlPreviewView from "../../components/Blocks/RNUrlPreviewView";
import * as List from "../../components/Blocks/List"


//import redux 
import { useDispatch, useSelector } from 'react-redux';
import { set } from 'react-native-reanimated';
import { getNew, getRefreshToken, getToken } from '../../helpers/functions';


const {width, height} = Dimensions.get("window")
 
const SearchUser = ({navigation, route}) =>  {
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


  useEffect(() => {
      setPageLoaded(0);
      LoadFirstData();
  }, [ refreshing ])

  const LoadFirstData = () => {
    setPageLoaded(0);
    if ( pageloaded == 0 ) {
      FetchUsers();
    }
    else setRefreshing(false)
  }

  const FetchUsers = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/users/users?name=" +route.params.title  + "&page=" + (pageloaded + 1), {
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
          setDataLoaded(res.users)
          setPageLoaded((pageloaded + 1))//2
          setFirstLoad(true)
        }
        else setFirstLoad(true)
      })
    })
  }

  // load more data---------------------------------------
  useEffect(() => {
      fetchMoreData();
  }, [isLoading]);

  const fetchMoreData = ()=> {
    if (pageloaded < totalPage && DataLoaded.length < postCount) {
      getToken("accessToken").then(accessToken => {
        fetch( BACKEND + "/users/users?name=" +route.params.title  + "&page=" + (pageloaded + 1), {
          method:"GET",
          headers:{
            "Authorization" : "Bearer " + accessToken,
          },
        })
        .then(res => res.json())
        .then(res => {
          setDataLoaded(DataLoaded.concat(res.users))
          setPageLoaded(pageloaded +1)
          setIsLoading(false)
          setRefreshing(false)
        })
      })
    }
  }


  const OneUserList = (item)=> {
    return(
      <TouchableOpacity onPress = {() => toUserProfile(item.item.id)} > 
        <TouchableOpacity onPress = {() => toUserProfile(item.item.id)} style={{width:width, marginLeft:"10%"}}>
          <List.UserList1
            onPress = {() => toUserProfile(item.item.id)}
            title = {item.item.name} 
            secondary={item.item.title}
            image = {item.item.avatar} 
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
    <View style={{ flex:1, backgroundColor:"white" }}>
      {
        (!refreshing && !isLoading &&  firstLoad && ( !DataLoaded?.length)) ?
        <View style={{justifyContent:"center", alignItems:"center", height:height*0.8}}>
          <Typography.H1 color={color.black} >No result!</Typography.H1>
        </View>
        :
        null
      }
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
    // // top:Constants.statusBarHeight, 
    alignSelf:"center",
    justifyContent:"center",
    overflow:"hidden",
    borderRadius:20
  }
});

export default SearchUser;
