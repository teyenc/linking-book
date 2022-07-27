
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, RefreshControl, ActivityIndicator, Alert, Switch} from 'react-native';

//import component
import * as Card from "../../components/Blocks/Card"
import { SaveModal } from '../../components/Blocks/Modals';

// asset & config 
import color from '../../config/color';
import { BACKEND } from '../../config/config';

//helper
import { GET, getToken, getData } from '../../helpers/functions';// save

// import redux
import { useDispatch, useSelector } from "react-redux";
import { ColtModal, refreshCollection } from '../../store/actions';

const { width } = Dimensions.get("window");

const MyPosts = ({navigation, route}) => {

  const UserData = useSelector(state => state.auth)
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
  const [ isLoading, setIsLoading ] = useState(false)

  //Load firstdata && refresh

  useEffect(() => {
    setFirstLoad(false);
    setPageLoaded(0);
    LoadFirstData();
  }, [ refreshing ]);

  const LoadFirstData = () => {
    setPageLoaded(0);
    if ( pageloaded === 0 ) FetchPosts()
    setRefreshing(false)
  }

  const FetchPosts = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/posts/profile/" + UserData.id + "?page=1", GET(accessToken))
      .then(res => {
        if (res.status === 200 ) {
          res.json().then( res => {
            setFirstLoad(true)
            setDataLoaded([])
            setDataLoaded(res.posts)//
            setRefreshing(false)
            if (!res.posts.length) setIsLoading(false)
            setTotalPage(res.pagination.totalPages)
            setPostCount(res.count)
            setPageLoaded((pageloaded + 1))//2
          })
        }
        else {
          setRefreshing(false)
          setIsLoading(false)
        }
      })
    })
  }
  
  // after delete && update
  useEffect(() => {
    if (route.params) {
      if (route.params.isDeleted == true) setRefreshing(true)
      if (route.params.isUpdated == true) setRefreshing(true)
    }
  }, [route.params])


  // load more data
  useEffect(() => {
    if (0 < pageloaded < totalPage) {
      getToken("accessToken").then(accessToken => {
        fetch( BACKEND + "/posts/profile/" + UserData.id + "?page=" + (pageloaded + 1), GET(accessToken))
        .then(res => {
          if (res.status === 200 ) {
            res.json().then( res => {
              if (res.posts) {
                setDataLoaded(DataLoaded.concat(res.posts))
                setPageLoaded(pageloaded +1)
              }
              setIsLoading(false)
              setRefreshing(false)
            })
          }
          else setRefreshing(false)
        })
      })
    }
  }, [ isLoading ]);


  // save posts
  const heartOnPress = (item) => {
    dispatch(ColtModal(true))
    getData("LocalCollections").then( col => {
      dispatch(refreshCollection(JSON.parse(col)))
    })
    setSavedPost(item.id)
  }

  return (
      <View style={styles.container}>
        <SaveModal postId={savedPost} /> 
        { firstLoad ? 
        <FlatList
          style={{width:"100%"}}
          data={DataLoaded}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <Card.NormalCards
              nextRoute={"MyPostDetail"}
              item={item} 
              heartOnPress={() => heartOnPress(item)} 
              onPress={() => navigation.push("MyPostDetail", item)}
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
          ListFooterComponent = {
            <View>
              { (isLoading == true && pageloaded < totalPage) ? <ActivityIndicator size="large" color={color.darkBrown} /> : null}
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
    flex:1,
    alignItems:"center", 
    backgroundColor:"white"
  },

  Hline :{
    width: "100%",
    margin: 0,
    height: 1,
    backgroundColor: "#e6e6e6",
  },

  Modalcontainer: {
    borderTopRightRadius:30,
    borderTopLeftRadius:30,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 1600,
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
  flashText:{
    fontSize:20, 
    padding:15, 
    color:"white",
    backgroundColor:color.darkBrown, 
    marginBottom:20, 
    position:'absolute', 
    alignSelf:"center",
    justifyContent:"center",
    overflow:"hidden",
    borderRadius:20
  },
});

export default MyPosts;

