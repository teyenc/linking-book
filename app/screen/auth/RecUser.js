
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View , Dimensions, Image, FlatList, RefreshControl, ActivityIndicator, Pressable} from 'react-native';

// import HomeStack from "./app/navigation/HomeStack";
// import  asset
import color from '../../config/color';
import { user } from "../../data/user";

import { BACKEND } from '../../config/config';

// import component 
import * as List from "../../components/Blocks/List"


//import redux 
import { useDispatch, useSelector } from 'react-redux';
import { followFunction, getNew, getRefreshToken, getToken, storeData } from '../../helpers/functions';
import Header from '../../components/Bars&Header/Header';
import { setFolAct } from '../../store/actions';


const {width, height} = Dimensions.get("window")
 
const RecUser = ({navigation, route}) =>  {
  
  const dispatch =  useDispatch()
  const userFollowing = useSelector(state => state.folAct.folAct)

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

  // follow
  const [ loadingFlw, setLoadingFlw ] = useState(false)
  const [ clickingUserId, setClickingUserId  ] = useState(0)

  //Load firstdata -----------------------------------------------------


  useEffect(() => {
      setPageLoaded(0);
      LoadFirstData();
  }, [ refreshing ])

  useEffect(() => {
    // console.log("A_A")
    storeData("HomePageType", "2")
  }, [])

  const LoadFirstData = () => {
    setPageLoaded(0);
    if ( pageloaded == 0 ) {
      FetchUsers();
    }
    else setRefreshing(false)
  }

  const FetchUsers = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/users/users?page=" + (pageloaded + 1), {
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
          setDataLoaded(user.concat(res.users))
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
        fetch( BACKEND + "/users/users?page=" + (pageloaded + 1), {
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

  const follow = (followedId) => {
    setLoadingFlw(true)
    setClickingUserId(followedId)
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/follow/" + UserData.id , followFunction(JSON.stringify(followedId), accessToken ))
      .then(res => {
        if (res.status === 200 || res.status === 201){
          res.json().then( r => {
            const data = JSON.parse("[" + r.user_following+ "]")
            dispatch(setFolAct(data))
            storeData("storedFollowingIds", r.user_following) 
            setLoadingFlw(false)
          })
        }
        else {
          setLoadingFlw(false)
          res.json().then(res => {
            // console.log(res)
          })
        }
      })
    })
  }


  const OneUserList = (item)=> {
    const filter = userFollowing.filter( Ids => Ids == item.item.id)

    if (filter.length > 0 || item.item.id ==UserData.id ) return null
    return(
      <View style={{paddingHorizontal:26}} > 
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <View style={{width:"75%"}}>
            <List.UserList1
              title = {item.item.name} 
              secondary={item.item.title}
              image = {item.item.avatar} 
            />
          </View>
          { filter.length > 0 ? null :
            [
              loadingFlw && item.item.id == clickingUserId ? 
              <View style={{paddingHorizontal:15}}>
                <ActivityIndicator style={{marginLeft:10}}/>  
              </View>
              :
              <Pressable style={{backgroundColor:color.darkBrown, borderRadius:5, paddingVertical:5, paddingHorizontal:15}} onPress={() => follow(item.item.id)}>
                <Text style={{color:"white"}}>Follow</Text>    
              </Pressable>
            ]
          }
        </View>
        <View style={styles.Hline}/>  
      </View>
      
    )
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
      <Header
        icon="chevron-left"
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => navigation.navigate("HomeTab")}
        RightButtomName="Finish"
        title={"Add users!"}
      />
      <FlatList
        data={DataLoaded}
        keyExtractor={(item, index) => index}
        horizontal={false}
        numColumns={1}
        renderItem={OneUserList}
        onEndReachedThreshold={0.001}
        onEndReached={()=> setIsLoading(true)}
        // refreshControl = {
        //   <RefreshControl
        //     onRefresh={()=> setRefreshing(true)}
        //     refreshing={refreshing}
        //   />
        // }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Hline :{
    width: "100%",
    margin: 0,
    height: 1,
    backgroundColor: "#e6e6e6",
  },
});

export default RecUser;
