
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, FlatList, RefreshControl} from 'react-native';

//component
import * as Card from "../../components/Blocks/Card"
import { RemoveModal } from '../../components/Blocks/Modals';


// asset && config
import color from '../../config/color';
import { BACKEND } from '../../config/config';


// helper && redux
import { RemoveSave, GET, getToken, getData } from '../../helpers/functions';// save
import { useDispatch, useSelector } from "react-redux";
import { refreshCollection} from '../../store/actions';


const { width, height } = Dimensions.get("window");


const PostsInCollection = ({navigation, route}) => {

  // console.log(route.params)

  const LocalCollection = useSelector(state=> state.collections.collection)
  const UserData = useSelector(state => state.auth)
  // const TokenData = useSelector(state => state.token)
  const dispatch = useDispatch();
  // console.log(UserData)

  // load data 
  const [ firstLoad, setFirstLoad ] = useState(false)
  const [ DataLoaded, setDataLoaded ] = useState([])
  const [ postCount, setPostCount ] = useState(0);
  const [ totalPage, setTotalPage ] = useState(0)
  const [ pageloaded, setPageLoaded ] =useState(0) 
  

  // refresh && load 
  const [ refreshing, setRefreshing ] = useState(false);
  const [ isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {
    setFirstLoad(false);
    setPageLoaded(0);
    // LoadCollections();
    LoadFirstData();
  }, [ refreshing ]);

  const LoadFirstData = () => {
    setPageLoaded(0);
    if ( pageloaded == 0 ) {FetchPosts();}
    setRefreshing(false)
  }

  const FetchPosts = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/collections/profile/" + route.params.userId + "?page=1"  + "&coltId=" + route.params.collectionId , GET(accessToken))
      .then(res => {
        if (res.status ==200 ) {
          res.json().then( res => {
            setFirstLoad(true)
            setDataLoaded([])
            setDataLoaded(res.data)//
            // setIsLoading(false)
            setRefreshing(false)
            setTotalPage(res.pagination.totalPages)
            setPostCount(res.count)
            setPageLoaded(2)//2
          })
        }
        else {
          setRefreshing(false)
          setIsLoading(false)
        }
      })
    })
  }


  // load more data---------------------------------------
  useEffect(() => {
    if ( 0 < pageloaded < totalPage) {
      getToken("accessToken").then(accessToken => {
        fetch( BACKEND + "/collections/profile/" + route.params.userId + "?page=" + (pageloaded + 1) + "&coltId=" + route.params.collectionId , GET(accessToken))
        .then(res => {
          if (res.status === 200 ) {
            res.json().then( res => {
              setDataLoaded(DataLoaded.concat(res.data))
              setPageLoaded(pageloaded +1)
              setIsLoading(false)
              setRefreshing(false)
            })
          }
          else setRefreshing(false)
        })
      })
    }
  }, [ isLoading ]);

  // remove ------------------------------------
  const [ loggedItem, setLoggedItem ] = useState("")
  const [ showRemove, setShowRemove ] = useState(false)

  const onPressDots = (item) => {
    getData("LocalCollections").then( col => {
      dispatch(refreshCollection(JSON.parse(col)))
    })
    setShowRemove(true)
    setLoggedItem(item.postId)
  }

  const Remove = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/collection_post" , RemoveSave(loggedItem, route.params.collectionId, accessToken ))
      .then(res => {
        setShowRemove(false)
        setRefreshing(true)
      })
    })
  }


  // console.log("------------------------------------------")
  
  // console.log("totalPage: " + totalPage)
  // console.log("PageLoaded: " + pageloaded)
  // console.log("postcount: " + postCount)
  // console.log("DataLoaded.length:" + DataLoaded.length)
  // console.log(DataLoaded)
  // console.log(savedPost)
  // console.log(firstLoad)

  // console.log("------------------------------------------")

  return (
      <View style={styles.container}>

        {/* model  */}
        <RemoveModal visible={showRemove} onPressCancel={() => setShowRemove(false)} onPressRemove= {()=> Remove()} />

        { firstLoad ? 
        <FlatList
          style={{width:"100%"}}
          data={DataLoaded}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          renderItem={({item }) => (
            <Card.NormalCards
              dotOnPress={() => onPressDots(item)}
              nextRoute={"SavedPostDetail"}
              route={"PostInMyCollection"}
              item={item} 
              heartOnPress={() => onPressDots(item)} 
              onPress={()=> navigation.push( "SavedPostDetail", item)} 
              onPressPoster={()=> navigation.push( "SavedUserProfile", {userId:item.userId})} 
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
          
        />
        // <View/>
        :
          // null
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

});

export default PostsInCollection;

