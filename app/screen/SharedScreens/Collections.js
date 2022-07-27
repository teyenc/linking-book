
import React, { useState, useEffect } from 'react';
import { StyleSheet, View , Dimensions, FlatList, RefreshControl, ActivityIndicator} from 'react-native';

// config &&  asset
import color from '../../config/color';
import * as Typography from '../../config/Typography';
import { BACKEND } from '../../config/config';

// import component 
import * as Card from "../../components/Blocks/Card"

//redux && helpers
import { GET, getToken } from '../../helpers/functions';


const {width, height} = Dimensions.get("window")
 
const SharedCollections = ({ route, navigation }) =>  {

  // load data 
  const [firstLoad, setFirstLoad] = useState(false)
  const [DataLoaded, setDataLoaded] = useState([])
  const [postCount, setPostCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0)
  const [pageloaded, setPageLoaded ] =useState(0) 

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

  // refresh 

  useEffect(() => {
    setFirstLoad(false);
    setPageLoaded(0);
    LoadFirstData();
  }, [refreshing]);

  const LoadFirstData = () => {
    setPageLoaded(0);
    if ( pageloaded == 0 ) FetchPosts()
    setRefreshing(false)
  }

  const FetchPosts = () => {
    getToken("accessToken").then(accessToken => {
      fetch( BACKEND + "/collections?page=" + (pageloaded+1) + "&userId=" +route.params, GET(accessToken))
      .then(res => res.json())
      .then(res => {
        setFirstLoad(true)
        setTotalPage(res.pagination.totalPages)
        setPostCount(res.count)
        setDataLoaded([])
        setDataLoaded(res.collections)//
        setPageLoaded(2)
        console.log("loaded!!")
      })
    })
  }

  // load more data
  useEffect(() => {
    if (pageloaded < totalPage) {
      getToken("accessToken").then(accessToken => {
        fetch(BACKEND + "/collections?page=" + (pageloaded+1) + "&userId=" +route.params, GET(accessToken))
        .then(res => res.json())
        .then(res => {
          setDataLoaded(DataLoaded.concat(res.collections))
          setPageLoaded(pageloaded +1)
          setIsLoading(false)
          setRefreshing(false)
        })
      })
    }
  }, [isLoading]);

  return (
    <View style={styles.container}>
      { firstLoad ? 
        <FlatList
          ListHeaderComponent = {
            (!DataLoaded?.length && firstLoad )?
            <View style={{justifyContent:"center", height:height*0.8}}>
              <Typography.H1>This user has no collection!</Typography.H1>
            </View>
              :
            null
          }
          data={DataLoaded}
          keyExtractor={(item, index) => index}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          renderItem={({item}) => (
            <Card.collectionList 
            onPress={() => navigation.push(routeName + "PostsInCollection", {collectionId: item.id, userId: route.params})} 
            item={item}/>
          )}
          onEndReachedThreshold={0.4}
          onEndReached={()=> setIsLoading(true)}
          refreshControl = {
            <RefreshControl
              onRefresh={()=> setRefreshing(true)}
              refreshing={refreshing}
            />
          }
        />
        :
        <ActivityIndicator size="large" color={color.darkBrown} />
      }
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

export {SharedCollections};
