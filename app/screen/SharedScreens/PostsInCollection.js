
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions,ActivityIndicator, Platform, FlatList, Image, TouchableOpacity, Modal, TextInput, ScrollView, Pressable, RefreshControl, Alert} from 'react-native';

//import component
import { GET, getToken, getData } from '../../helpers/functions';// save
import * as Card from "../../components/Blocks/Card"
import { SaveModal } from '../../components/Blocks/Modals';

//library

// asset && style
import color from '../../config/color';
import { BACKEND } from '../../config/config';

// helpers && redux
import { useDispatch, useSelector } from "react-redux";
import { ColtModal, refreshCollection } from '../../store/actions';


const { width, height } = Dimensions.get("window");


const SharedPostsInCollection = ({navigation, route}) => {

  const dispatch = useDispatch();

  // load data 
  const [firstLoad, setFirstLoad] = useState(false)
  const [DataLoaded, setDataLoaded] = useState([])
  const [postCount, setPostCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0)
  const [pageloaded, setPageLoaded ] =useState(0) 
  
  // svae posts 
  const [ savedPost, setSavedPost] = useState("");

  // refresh && load 
  const [ refreshing, setRefreshing ] = useState(false);
  const [isLoading, setIsLoading] = useState(false)


  // navigation 
  const [ routeName, setRouteNmae ] = useState("")
  useEffect (() => {
    let name = route.name.charAt(0)
    if ( name == "E" ) { setRouteNmae("Explore")} 
    else if ( name == "S" ) { setRouteNmae("Saved")} 
    else if ( name == "H" ) { setRouteNmae("Home")} 
    else if ( name == "A" ) { setRouteNmae("Account")}
  }, [])

  //Load firstdata && refresh-----------------------------------------------------
  // token  

  useEffect(() => {
    setFirstLoad(false);
    setPageLoaded(0);
    LoadFirstData();
  }, [refreshing]);

  const LoadFirstData = () => {
    setPageLoaded(0);
    if ( pageloaded == 0 ) {
      FetchPosts();
    }
    setRefreshing(false)
  }

  const FetchPosts = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/collections/posts/" + route.params.userId + "?page=1"  + "&coltId=" + route.params.collectionId , GET(accessToken))
      .then(res => res.json())
      .then(res => {
        setFirstLoad(true)
        setDataLoaded([])
        if (res.posts) {
          setDataLoaded(res.posts)//
          setTotalPage(res.pagination.totalPages)
        }
        setRefreshing(false)
        setPostCount(res.count)
        setPageLoaded(2)//2
      })
    })
  }


  // load more data---------------------------------------
  useEffect(() => {
    if (0 < pageloaded < totalPage) {
      getToken("accessToken").then(accessToken => {
        fetch( BACKEND + "/collections/posts/" + route.params.userId + "?page=" + (pageloaded + 1) + "&coltId=" + route.params.collectionId , {
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
  }, [isLoading]);

  // save posts----------------------------------------
  const heartOnPress = (item) => {
    getData("LocalCollections").then( col => {
      dispatch(refreshCollection(JSON.parse(col)))
    })
    dispatch(ColtModal(true))
    setSavedPost(item.postId) // this is different!!!
    // console.log(item)
  }


  // console.log("------------------------------------------")
  // console.log("totalPage: " + totalPage)
  // console.log("PageLoaded: " + pageloaded)
  // console.log("postcount: " + postCount)
  // console.log("DataLoaded.length:" + DataLoaded.length)
  // console.log(DataLoaded)
  // console.log(savedPost)
  // console.log("------------------------------------------")

  return (
    <View style={styles.container}>

      {/* model  */}
      <SaveModal postId={savedPost} /> 

      { firstLoad ? 
      <FlatList
        style={{width:"100%"}}
        data={DataLoaded}
        // data={posts}
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        renderItem={({item }) => (
          <Card.NormalCards
            nextRoute={routeName+ "PostDetail"}
            item={item} 
            heartOnPress={() => heartOnPress(item)} 
            onPress={() => navigation.push(routeName+ "PostDetail", item)}
            onPressPoster={() => navigation.push(routeName+ "UserProfile", {userId: item.userId})}
          />
        )}
        onEndReachedThreshold={1}
        onEndReached={()=> setIsLoading(true)}
        // onRefresh={()=> LoadFirstData()}
        refreshControl = {
          <RefreshControl
            onRefresh={()=> setRefreshing(true)}
            refreshing={refreshing}
          />
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
    flex:1, 
    // paddingTop:40, 
    justifyContent:"center", 
    alignItems:"center", 
    backgroundColor:"white"
  },
  // Modal style

  Hline :{
    width: "100%",
    margin: 0,
    height: 1,
    backgroundColor: "#e6e6e6",
  },

  Modalcontainer: {
    // marginTop:50,
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    // paddingTop:20,
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 1600,
    // height:100,
    
    // marginTop:200,
  },
  option:{
    width:"100%", 
    height: 90, 
    alignItems:"center", 
    justifyContent:"center"
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
    flexDirection:"row",
    width:width,
    height: width*0.4*0.5, 
    marginVertical: 7, 
    borderRadius:12, 
    alignItems:"center",
    // justifyContent:"space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
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
  // flash message 
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
  },

});

export {SharedPostsInCollection};

